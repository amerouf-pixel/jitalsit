import { useMemo, useState } from 'react';
import { ArrowUpRight, Bell, Check, Copy, Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { JITALX_ASSETS } from '../data/assets';
import { MediaFrame } from '../components/MediaFrame';
import { MotionSequencePlayer } from '../components/MotionSequencePlayer';
import { AspectRatioOption, ObsOverlayConfig } from '../types/jitalx';
import { buildObsOverlayUrl } from '../utils/validation';

type StudioCaptureKey = 'sunset' | 'chroma' | 'transparent' | 'clean';

const STUDIO_CAPTURES: {
  id: StudioCaptureKey;
  label: string;
  subtitle: string;
  imageUrl: string;
  description: string;
}[] = [
  {
    id: 'sunset',
    label: 'Fond Sunset Néon',
    subtitle: 'Scène d’attente et overlay complet',
    imageUrl: JITALX_ASSETS.streamerSunsetWaiting,
    description:
      'Idéal pour démarrer votre direct avec l’écran d’attente « Le live commence bientôt », le cadre caméra 16:9 et la barre de progression synchronisée.',
  },
  {
    id: 'chroma',
    label: 'Fond Vert Chroma',
    subtitle: 'Incrustation rapide par filtre Chroma Key',
    imageUrl: JITALX_ASSETS.streamerChromaGreen,
    description:
      'Basculez sur le fond vert pur pour incruster uniquement le cadre caméra et le HUD inférieur au-dessus de votre jeu dans OBS.',
  },
  {
    id: 'transparent',
    label: 'Fond Transparent OBS',
    subtitle: 'Source Navigateur sans filtrage couleur',
    imageUrl: JITALX_ASSETS.streamerTransparentObs,
    description:
      'Conçu pour les Sources Navigateur OBS : arrière-plan transparent natif garantissant des bordures nettes sans halo vert.',
  },
  {
    id: 'clean',
    label: 'Mode Capture Propre (H)',
    subtitle: 'Zéro barre d’édition à l’écran',
    imageUrl: JITALX_ASSETS.streamerCleanCapture,
    description:
      'Appuyez sur la touche H : tous les champs et boutons de réglage disparaissent instantanément pour une capture parfaitement propre.',
  },
];

export function StreamerStudioPage() {
  const { navigate, siteCopy, videos, setSelectedVideoCode } = useSite();
  const [selectedCapture, setSelectedCapture] = useState<StudioCaptureKey>('clean');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [manualAlertText, setManualAlertText] = useState<string | null>(null);

  const [obsConfig, setObsConfig] = useState<ObsOverlayConfig>({
    baseUrl: 'https://jitalx.app',
    handle: '@Runner_10J',
    liveTitle: 'Objectif 100 % — Jour 1',
    format: '16:9',
    background: 'transparent',
    cleanMode: true,
    showMissionWidget: true,
    showChallengeCounter: true,
    showChatHud: true,
    showManualAlerts: true,
    showTimer: true,
  });

  const generatedUrl = useMemo(() => buildObsOverlayUrl(obsConfig), [obsConfig]);

  const activeCapture =
    STUDIO_CAPTURES.find((c) => c.id === selectedCapture) ?? STUDIO_CAPTURES[0];

  const videoObs = videos.find((v) => v.code === 'E') ?? videos[0];

  const copyObsUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Ignore if clipboard blocked
    }
  };

  const triggerManualAlert = (label: string) => {
    setManualAlertText(label);
    window.setTimeout(() => setManualAlertText(null), 4000);
  };

  const setRatio = (format: AspectRatioOption) =>
    setObsConfig((prev) => ({ ...prev, format }));

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-20">
      {/* Header */}
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-medium text-[#22D3EE]">
          Streamer Studio · Overlays 16:9 &amp; 9:16 · OBS Studio
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
          Un studio d’overlays pensé pour vos directs, prêt pour OBS en un clic.
        </h1>
        <p className="text-base text-zinc-300 leading-relaxed">
          Explorez les quatre vues authentiques du Streamer Studio JITALX, testez le générateur
          d’URL pour OBS et découvrez comment combiner les widgets manuels avec le Mode Capture
          Propre (touche H).
        </p>
      </header>

      {/* Authentic 4-Mode Capture Inspector */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              01. Les 4 modes réels du Streamer Studio
            </h2>
            <p className="text-sm text-zinc-400">
              Sélectionnez un mode pour inspecter la capture authentique correspondante.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Modes du Streamer Studio OBS"
            className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#11101B] border border-white/10"
          >
            {STUDIO_CAPTURES.map((cap) => {
              const active = cap.id === selectedCapture;
              return (
                <button
                  key={cap.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCapture(cap.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#EC4899] text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cap.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-white/10 bg-[#11101B] p-6 sm:p-8">
          <div className="lg:col-span-8">
            <MediaFrame
              src={activeCapture.imageUrl}
              alt={`Capture authentique JITALX : ${activeCapture.label}`}
              fit="contain"
            />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-mono text-[#22D3EE]">{activeCapture.subtitle}</p>
            <h3 className="font-display text-2xl font-semibold text-white">
              {activeCapture.label}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{activeCapture.description}</p>
            <div className="pt-2 space-y-2 text-xs text-zinc-400 border-t border-white/8">
              <p>Raccourcis intégrés dans l’application :</p>
              <p className="font-mono text-zinc-300">Touche H · Mode Capture Propre</p>
              <p className="font-mono text-zinc-300">Touche F11 · Affichage plein écran</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive OBS URL Generator & Manual Widgets Preview */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            02. Simulateur de générateur d’URL OBS et widgets manuels
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Configurez votre pseudo, votre format 16:9 ou 9:16, votre fond et vos widgets actifs
            pour voir l’URL de Source Navigateur OBS se construire en direct.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#11101B] p-6 sm:p-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="obs-handle" className="block text-xs font-medium text-zinc-300">
                  Pseudo streamer
                </label>
                <input
                  id="obs-handle"
                  type="text"
                  value={obsConfig.handle}
                  onChange={(e) => setObsConfig((prev) => ({ ...prev, handle: e.target.value }))}
                  maxLength={60}
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white focus:border-[#22D3EE]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="obs-title" className="block text-xs font-medium text-zinc-300">
                  Titre du live
                </label>
                <input
                  id="obs-title"
                  type="text"
                  value={obsConfig.liveTitle}
                  onChange={(e) =>
                    setObsConfig((prev) => ({ ...prev, liveTitle: e.target.value }))
                  }
                  maxLength={100}
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2.5 text-sm text-white focus:border-[#22D3EE]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-medium text-zinc-300">Format d’overlay</span>
                <div className="flex gap-2">
                  {(['16:9', '9:16'] as AspectRatioOption[]).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setRatio(ratio)}
                      className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                        obsConfig.format === ratio
                          ? 'bg-[#EC4899] border-[#EC4899] text-white'
                          : 'bg-[#0A0912] border-white/12 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="obs-bg" className="block text-xs font-medium text-zinc-300">
                  Mode de fond OBS
                </label>
                <select
                  id="obs-bg"
                  value={obsConfig.background}
                  onChange={(e) =>
                    setObsConfig((prev) => ({
                      ...prev,
                      background: e.target.value as ObsOverlayConfig['background'],
                    }))
                  }
                  className="w-full rounded-lg bg-[#0A0912] border border-white/12 px-3.5 py-2 text-sm text-white"
                >
                  <option value="transparent">Fond Transparent OBS</option>
                  <option value="chroma">Fond Vert Chroma</option>
                  <option value="sunset">Fond Sunset Néon</option>
                </select>
              </div>
            </div>

            {/* Widget checkboxes */}
            <fieldset className="space-y-2.5 pt-1">
              <legend className="text-xs font-medium text-zinc-300 mb-2">
                Widgets HUD inclus dans l’URL
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-zinc-300">
                {[
                  { key: 'showMissionWidget' as const, label: 'Widget de mission' },
                  { key: 'showChallengeCounter' as const, label: 'Compteur de défi' },
                  { key: 'showChatHud' as const, label: 'Chat HUD' },
                  { key: 'showManualAlerts' as const, label: 'Alertes manuelles' },
                  { key: 'showTimer' as const, label: 'Chronomètre de session' },
                  { key: 'cleanMode' as const, label: 'Mode Capture Propre (H)' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0A0912] border border-white/8 cursor-pointer hover:border-white/20"
                  >
                    <input
                      type="checkbox"
                      checked={obsConfig[item.key]}
                      onChange={(e) =>
                        setObsConfig((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="accent-[#EC4899] w-4 h-4"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Generated URL Output */}
            <div className="space-y-2 pt-2 border-t border-white/8">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-zinc-300">
                  URL générée pour Source Navigateur OBS
                </span>
                <button
                  type="button"
                  onClick={copyObsUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-[#09090F] hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedUrl ? 'URL copiée' : 'Copier l’URL OBS'}</span>
                </button>
              </div>
              <div
                data-testid="obs-generated-url"
                className="font-mono text-xs text-[#22D3EE] bg-[#07070D] border border-white/10 rounded-lg p-3.5 break-all"
              >
                {generatedUrl}
              </div>
            </div>
          </div>

          {/* Live Overlay Preview & Manual Alert Test */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#11101B] p-6 space-y-5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Aperçu de configuration ({obsConfig.format})</span>
                <span className="font-mono text-zinc-300">
                  {obsConfig.cleanMode ? 'Capture Propre active' : 'Mode édition'}
                </span>
              </div>

              <div
                className={`relative rounded-xl border border-white/12 overflow-hidden p-5 flex flex-col justify-between transition-all ${
                  obsConfig.format === '9:16'
                    ? 'aspect-[9/16] max-w-[300px] mx-auto'
                    : 'aspect-video w-full'
                } ${
                  obsConfig.background === 'chroma'
                    ? 'bg-[#00D900]'
                    : obsConfig.background === 'transparent'
                    ? 'bg-[repeating-conic-gradient(#1a1928_0%_25%,#12111d_0%_50%)] bg-[length:20px_20px]'
                    : 'bg-gradient-to-br from-[#230E35] via-[#120B24] to-[#0A1021]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-lg border border-[#22D3EE]/70 bg-[#0A0914]/90 px-3 py-2 text-xs">
                    <div className="font-mono text-[10px] text-[#EC4899] font-semibold">
                      CAMÉRA {obsConfig.format}
                    </div>
                    <div className="font-semibold text-white mt-0.5">
                      {obsConfig.handle || '@Runner_10J'}
                    </div>
                  </div>

                  {obsConfig.showChallengeCounter && (
                    <div className="rounded-lg border border-white/15 bg-[#0A0914]/90 px-3 py-2 text-right">
                      <div className="text-[10px] text-zinc-400">Compteur de défi</div>
                      <div className="font-mono text-sm font-semibold text-[#22D3EE] tabular-nums">
                        39 % · 1/4
                      </div>
                    </div>
                  )}
                </div>

                {manualAlertText && obsConfig.showManualAlerts && (
                  <div className="mx-auto my-2 rounded-lg border border-[#EC4899] bg-[#0B0915]/95 px-4 py-2.5 text-center shadow-lg">
                    <p className="text-[11px] font-mono text-[#EC4899]">Alerte manuelle</p>
                    <p className="text-sm font-semibold text-white">{manualAlertText}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {obsConfig.showChatHud && (
                    <div className="rounded-lg border border-white/12 bg-[#0A0914]/85 px-3 py-2 text-[11px] text-zinc-300 max-w-xs">
                      <span className="font-mono text-[#22D3EE]">Chat HUD :</span> En attente du
                      flux texte configuré dans le studio.
                    </div>
                  )}

                  <div className="rounded-lg border border-white/15 bg-[#0A0914]/95 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      {obsConfig.showMissionWidget && (
                        <p className="text-[10px] font-mono text-[#22D3EE]">
                          Mission active · Baie du Littoral
                        </p>
                      )}
                      <p className="text-sm font-semibold text-white truncate">
                        {obsConfig.liveTitle || 'Objectif 100 % — Jour 1'}
                      </p>
                    </div>
                    {obsConfig.showTimer && (
                      <div className="font-mono text-sm font-semibold text-white tabular-nums">
                        00:20:34
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Manual Alert Demo Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-white/8">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Bell className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Tester le déclenchement d’une alerte manuelle :</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Mission accomplie !',
                    'Nouveau record de session',
                    'Pause rapide — Retour dans 2 min',
                  ].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => triggerManualAlert(label)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-white/12 text-zinc-200 hover:text-white hover:bg-white/6 transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed pt-1">
                  Information importante : dans la version actuelle de JITALX, les alertes sont
                  déclenchées manuellement. Les alertes automatiques Twitch/YouTube et OBS
                  WebSocket ne sont pas encore connectés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded OBS Video Sequence E */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              03. Démonstration OBS en séquence animée
            </h2>
            <p className="text-sm text-zinc-400">
              Visionnez la séquence E dédiée à la mise en place dans OBS Studio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedVideoCode('E');
              navigate('videos');
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#22D3EE] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Ouvrir le storyboard complet (Séquence E)</span>
          </button>
        </div>

        <MotionSequencePlayer
          video={videoObs}
          onOpenStudio={() => {
            setSelectedVideoCode('E');
            navigate('videos');
          }}
        />
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-white/10 bg-[#12111C] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl font-bold text-white">
            Streamer Studio inclus dans l’accès complet à 7 €
          </h2>
          <p className="text-sm text-zinc-400">
            Aucun frais mensuel : achetez JITALX une seule fois sur Gumroad.
          </p>
        </div>
        <a
          href={siteCopy.gumroadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <span>Obtenir JITALX · 7 €</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
