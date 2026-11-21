import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Download,
  Film,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { VideoProductionItem } from '../types/jitalx';
import {
  formatSecondsToTimecode,
  getTotalStoryboardSeconds,
  isSafeHttpUrl,
} from '../utils/validation';

interface MotionSequencePlayerProps {
  video: VideoProductionItem;
  compact?: boolean;
  onOpenStudio?: () => void;
}

export function MotionSequencePlayer({
  video,
  compact = false,
  onOpenStudio,
}: MotionSequencePlayerProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [exportState, setExportState] = useState<'idle' | 'rendering' | 'done' | 'unsupported'>(
    'idle'
  );
  const [exportMessage, setExportMessage] = useState('');
  const timerRef = useRef<number | null>(null);

  const hasPublishedVideo =
    video.status === 'published' && Boolean(video.videoUrl) && isSafeHttpUrl(video.videoUrl);

  const scenes = video.scenes;
  const currentScene = scenes[sceneIndex] ?? scenes[0];
  const totalSeconds = useMemo(() => getTotalStoryboardSeconds(video), [video]);

  const cumulativeElapsed = useMemo(() => {
    let prior = 0;
    for (let i = 0; i < sceneIndex; i += 1) {
      prior += scenes[i]?.durationSec ?? 0;
    }
    return prior + sceneElapsed;
  }, [scenes, sceneIndex, sceneElapsed]);

  useEffect(() => {
    setSceneIndex(0);
    setSceneElapsed(0);
    setIsPlaying(false);
    setExportState('idle');
    setExportMessage('');
  }, [video.id]);

  useEffect(() => {
    if (!isPlaying || hasPublishedVideo || !currentScene) return;

    timerRef.current = window.setInterval(() => {
      setSceneElapsed((prev) => {
        const next = prev + 0.25;
        if (next >= currentScene.durationSec) {
          setSceneIndex((idx) => {
            if (idx + 1 < scenes.length) {
              return idx + 1;
            }
            setIsPlaying(false);
            return 0;
          });
          return 0;
        }
        return next;
      });
    }, 250);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, hasPublishedVideo, currentScene, scenes.length]);

  const handleRestart = () => {
    setSceneIndex(0);
    setSceneElapsed(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setSceneIndex((idx) => (idx > 0 ? idx - 1 : scenes.length - 1));
    setSceneElapsed(0);
  };

  const handleNext = () => {
    setSceneIndex((idx) => (idx + 1 < scenes.length ? idx + 1 : 0));
    setSceneElapsed(0);
  };

  // Real client-side Canvas + MediaRecorder WebM export from the authentic screenshots
  const handleExportWebM = async () => {
    if (
      typeof window === 'undefined' ||
      typeof MediaRecorder === 'undefined' ||
      !HTMLCanvasElement.prototype.captureStream
    ) {
      setExportState('unsupported');
      setExportMessage(
        'Votre navigateur ne prend pas en charge l’enregistrement Canvas WebM local.'
      );
      return;
    }

    setExportState('rendering');
    setExportMessage('Rendu de la séquence animée en cours à partir des captures authentiques...');

    try {
      const width = video.aspectRatio === '9:16' ? 720 : 1280;
      const height = video.aspectRatio === '9:16' ? 1280 : 720;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Contexte graphique indisponible.');

      const loadedImages = await Promise.all(
        scenes.map(
          (scene) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error(`Impossible de charger ${scene.imageUrl}`));
              img.src = scene.imageUrl;
            })
        )
      );

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunks.push(ev.data);
      };

      const recordingDone = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });

      recorder.start();

      // Render a crisp 2.5s condensed cut per scene so export finishes swiftly in browser
      const fps = 30;
      const secPerScene = 2.5;
      const framesPerScene = Math.round(fps * secPerScene);

      for (let s = 0; s < scenes.length; s += 1) {
        const scene = scenes[s];
        const img = loadedImages[s];

        for (let f = 0; f < framesPerScene; f += 1) {
          const t = f / framesPerScene;
          ctx.fillStyle = '#09090F';
          ctx.fillRect(0, 0, width, height);

          // Subtle Ken Burns zoom preserving crisp screenshot readability
          const scaleBase = Math.max(width / img.width, height / img.height);
          const zoom =
            scene.cameraMotion === 'zoom-out' ? 1.07 - 0.06 * t : 1.01 + 0.06 * t;
          const drawW = img.width * scaleBase * zoom;
          const drawH = img.height * scaleBase * zoom;
          const panOffset = scene.cameraMotion === 'pan-right' ? (t - 0.5) * 32 : 0;
          const dx = (width - drawW) / 2 - panOffset;
          const dy = (height - drawH) / 2;

          ctx.save();
          ctx.globalAlpha = Math.min(1, f / 8);
          ctx.drawImage(img, dx, dy, drawW, drawH);
          ctx.restore();

          // Measured contrast scrim
          const grad = ctx.createLinearGradient(0, height * 0.58, 0, height);
          grad.addColorStop(0, 'rgba(9,9,15,0)');
          grad.addColorStop(0.55, 'rgba(9,9,15,0.72)');
          grad.addColorStop(1, 'rgba(9,9,15,0.94)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, height * 0.58, width, height * 0.42);

          // Editorial lower-third overlay
          const pad = width === 720 ? 36 : 56;
          ctx.fillStyle = '#22D3EE';
          ctx.font = '600 18px sans-serif';
          ctx.fillText(`JITALX · SÉQUENCE ${video.code} · PLAN ${s + 1}/${scenes.length}`, pad, height - 96);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = width === 720 ? '700 28px sans-serif' : '700 34px sans-serif';
          ctx.fillText(scene.overlayCaption, pad, height - 54, width - pad * 2);

          // Progress rail
          const progress = (s * framesPerScene + f) / (scenes.length * framesPerScene);
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(pad, height - 24, width - pad * 2, 4);
          ctx.fillStyle = '#EC4899';
          ctx.fillRect(pad, height - 24, (width - pad * 2) * progress, 4);

          await new Promise((r) => window.setTimeout(r, 1000 / fps));
        }
      }

      recorder.stop();
      const blob = await recordingDone;
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `jitalx-sequence-${video.code.toLowerCase()}-${video.aspectRatio.replace(':', 'x')}.webm`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 4000);

      setExportState('done');
      setExportMessage(
        'Export WebM terminé. Vous pouvez réutiliser cette séquence de montage ou y associer une vidéo MP4 finale dans l’espace Administration.'
      );
    } catch (err) {
      setExportState('unsupported');
      setExportMessage(
        err instanceof Error ? err.message : 'Échec de l’export vidéo local.'
      );
    }
  };

  const kbClass =
    currentScene?.cameraMotion === 'pan-right'
      ? 'animate-kb-pan'
      : currentScene?.cameraMotion === 'zoom-out'
      ? 'animate-kb-out'
      : 'animate-kb-in';

  const progressPct = totalSeconds > 0 ? Math.min(100, (cumulativeElapsed / totalSeconds) * 100) : 0;

  const aspectWrapperClass =
    video.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-w-[360px] mx-auto'
      : 'aspect-video w-full';

  return (
    <div className="rounded-xl border border-white/10 bg-[#11101B] overflow-hidden">
      {/* Header metadata bar (unboxed typographic separators) */}
      <div className="px-5 py-3.5 border-b border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[#22D3EE] font-medium">Séquence {video.code}</span>
          <span aria-hidden="true">·</span>
          <span>Format {video.aspectRatio}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono">{video.durationLabel}</span>
          <span aria-hidden="true">·</span>
          <span className={hasPublishedVideo ? 'text-emerald-400' : 'text-zinc-300'}>
            {hasPublishedVideo
              ? 'Vidéo HD publiée'
              : 'Aperçu animé de pré-production (captures authentiques)'}
          </span>
        </div>

        {onOpenStudio && (
          <button
            type="button"
            onClick={onOpenStudio}
            className="text-xs font-medium text-[#22D3EE] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ouvrir le storyboard complet
          </button>
        )}
      </div>

      {/* Viewport */}
      <div className="p-4 sm:p-5 bg-[#0A0912]">
        <div
          className={`relative ${aspectWrapperClass} rounded-lg overflow-hidden border border-white/10 bg-black`}
          data-testid={`video-player-${video.code}`}
        >
          {hasPublishedVideo ? (
            <video
              key={video.videoUrl}
              src={video.videoUrl}
              poster={video.posterUrl}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <>
              <img
                key={`${video.id}-${currentScene.id}-${isPlaying ? 'play' : 'pause'}`}
                src={currentScene.imageUrl}
                alt={currentScene.imageAlt}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${isPlaying ? kbClass : ''}`}
              />

              {/* Measured scrim for 4.5:1+ contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090F]/95 via-[#09090F]/35 to-transparent pointer-events-none" />

              {/* Center Play overlay when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Lire la séquence ${video.code} : ${video.title}`}
                    className="w-16 h-16 rounded-full bg-[#EC4899] hover:bg-[#DB2777] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  </button>
                </div>
              )}

              {/* Lower-third editorial caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] tabular-nums">
                  <span>
                    Plan {sceneIndex + 1}/{scenes.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentScene.timecode}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-300">{currentScene.transition}</span>
                </div>
                <p className="font-display text-lg sm:text-2xl font-semibold text-white leading-snug">
                  {currentScene.overlayCaption}
                </p>
                {!compact && (
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                    « {currentScene.voiceOver} »
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls bar for animated storyboard mode */}
      {!hasPublishedVideo && (
        <div className="px-5 pb-5 space-y-4">
          {/* Progress rail */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#EC4899] to-[#22D3EE] transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Mettre en pause la séquence' : 'Lancer la lecture'}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white text-[#09090F] hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Lire la séquence'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Plan précédent"
                className="p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Plan suivant"
                className="p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                aria-label="Relancer depuis le début"
                className="p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="ml-2 text-xs font-mono text-zinc-400 tabular-nums">
                {formatSecondsToTimecode(cumulativeElapsed)} / {formatSecondsToTimecode(totalSeconds)}
              </span>
            </div>

            {!compact && (
              <button
                type="button"
                onClick={handleExportWebM}
                disabled={exportState === 'rendering'}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-white/12 text-zinc-200 hover:text-white hover:bg-white/6 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                {exportState === 'rendering' ? (
                  <Film className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>
                  {exportState === 'rendering'
                    ? 'Export WebM en cours...'
                    : 'Exporter aperçu WebM'}
                </span>
              </button>
            )}
          </div>

          {exportMessage && (
            <p
              className={`text-xs leading-relaxed ${
                exportState === 'unsupported' ? 'text-amber-300' : 'text-[#22D3EE]'
              }`}
            >
              {exportMessage}
            </p>
          )}

          {/* Scene timeline selector */}
          {!compact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {scenes.map((scene, idx) => {
                const active = idx === sceneIndex;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setSceneIndex(idx);
                      setSceneElapsed(0);
                    }}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1A172B] border-[#EC4899]/60 text-white'
                        : 'bg-[#0C0B14] border-white/8 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
                    }`}
                  >
                    <div className="text-[11px] font-mono text-zinc-500 tabular-nums">
                      Plan {idx + 1} · {scene.timecode} · {scene.durationSec}s
                    </div>
                    <div className="text-xs font-medium mt-0.5 truncate">{scene.title}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
