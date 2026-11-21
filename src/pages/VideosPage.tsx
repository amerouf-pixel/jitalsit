import { useMemo, useState } from 'react';
import { Check, Copy, Film } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { MotionSequencePlayer } from '../components/MotionSequencePlayer';
import { MediaFrame } from '../components/MediaFrame';
import { VideoCategory } from '../types/jitalx';
import { filterVideosByCategory } from '../utils/validation';

const VIDEO_FILTERS: { id: VideoCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes les vidéos (7)' },
  { id: 'principale', label: 'Principale' },
  { id: 'modules', label: 'Modules' },
  { id: 'streamer', label: 'Streamer & OBS' },
  { id: 'social', label: 'Réseaux sociaux 9:16' },
];

type DossierTab = 'storyboard' | 'script' | 'veo';

export function VideosPage() {
  const { videos, selectedVideoCode, setSelectedVideoCode, navigate, isAdmin } = useSite();
  const [category, setCategory] = useState<VideoCategory | 'all'>('all');
  const [dossierTab, setDossierTab] = useState<DossierTab>('storyboard');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredVideos = useMemo(
    () => filterVideosByCategory(videos, category),
    [videos, category]
  );

  const activeVideo =
    videos.find((v) => v.code === selectedVideoCode) ?? filteredVideos[0] ?? videos[0];

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback ignored if clipboard denied
    }
  };

  const fullScriptText = activeVideo.scenes
    .map(
      (scene, index) =>
        `Plan ${index + 1} (${scene.timecode} — ${scene.durationSec}s) — ${scene.title}\nTitre écran : ${scene.overlayCaption}\nVoix-off : ${scene.voiceOver}\nTransition : ${scene.transition}`
    )
    .join('\n\n');

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-12 space-y-8">
      {/* Header */}
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-medium text-[#22D3EE]">
          Bibliothèque vidéo &amp; Studio de production JITALX
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.1]">
          Les 7 séquences promotionnelles, construites sur les vraies captures de JITALX.
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Chaque vidéo (A à G) inclut une séquence animée interactive, un export WebM local, un
          storyboard plan par plan, un script voix-off et un prompt prêt pour le rendu final.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filtrer les vidéos par catégorie"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#11101B] border border-white/10"
        >
          {VIDEO_FILTERS.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(item.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#EC4899] text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('admin')}
          className="text-xs font-medium text-[#22D3EE] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
        >
          {isAdmin
            ? 'Gérer les URL vidéo dans Administration'
            : 'Espace Administration (publier une vidéo MP4)'}
        </button>
      </div>

      {/* Main Theater + Playlist Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Player & Production Dossier */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {activeVideo.code}. {activeVideo.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{activeVideo.subtitle}</p>
          </div>

          <MotionSequencePlayer video={activeVideo} />

          <p className="text-xs text-zinc-400 border border-white/10 bg-[#11101B] rounded-lg px-4 py-3 leading-relaxed">
            Note de transparence production : aucune vidéo Veo distante n’est pré-générée
            automatiquement sans clé facturée configurée. Les aperçus ci-dessus sont des séquences
            animées de pré-production générées à partir des captures authentiques, exportables en
            WebM et remplaçables à tout moment par vos fichiers MP4 finaux depuis l’espace
            Administration.
          </p>

          {/* Production Dossier Tabs */}
          <div className="rounded-xl border border-white/10 bg-[#11101B] overflow-hidden">
            <div className="px-5 pt-4 border-b border-white/8 flex flex-wrap items-center justify-between gap-3">
              <div role="tablist" aria-label="Dossier de production vidéo" className="flex gap-5">
                {[
                  { id: 'storyboard' as DossierTab, label: 'Storyboard plan par plan' },
                  { id: 'script' as DossierTab, label: 'Script voix-off & titres' },
                  { id: 'veo' as DossierTab, label: 'Prompt Veo & intégration MP4' },
                ].map((tab) => {
                  const active = dossierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setDossierTab(tab.id)}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'text-white border-[#EC4899]'
                          : 'text-zinc-400 border-transparent hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {dossierTab === 'storyboard' && (
                <div className="space-y-5">
                  {activeVideo.scenes.map((scene, index) => (
                    <div
                      key={scene.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-5 border-b border-white/8 last:border-b-0 last:pb-0 items-center"
                    >
                      <div className="sm:col-span-4">
                        <MediaFrame
                          src={scene.imageUrl}
                          alt={scene.imageAlt}
                          fit={scene.imageUrl.includes('Capture_d__cran') ? 'contain' : 'cover'}
                        />
                      </div>
                      <div className="sm:col-span-8 space-y-1.5">
                        <div className="text-xs font-mono text-zinc-400 tabular-nums">
                          <span className="text-[#22D3EE]">Plan {index + 1}</span>
                          {' · '}
                          {scene.timecode} ({scene.durationSec}s)
                          {' · '}
                          Transition : {scene.transition}
                        </div>
                        <h3 className="text-base font-semibold text-white">{scene.title}</h3>
                        <p className="text-xs text-zinc-300">
                          <span className="text-zinc-500">Titre incrusté :</span>{' '}
                          {scene.overlayCaption}
                        </p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          <span className="text-zinc-500">Voix-off :</span> {scene.voiceOver}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {dossierTab === 'script' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-zinc-300">
                      Script narratif complet et minutage pour l’enregistrement voix-off ou le
                      sous-titrage.
                    </p>
                    <button
                      type="button"
                      onClick={() => copyText('script', fullScriptText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/12 text-zinc-200 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedKey === 'script' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === 'script' ? 'Script copié' : 'Copier le script'}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-300 bg-[#0A0912] border border-white/8 rounded-lg p-5 leading-relaxed">
                    {fullScriptText}
                  </pre>
                </div>
              )}

              {dossierTab === 'veo' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-zinc-300">
                      Prompt calibré pour une production Veo / montage vidéo externe préservant la
                      lisibilité des captures JITALX.
                    </p>
                    <button
                      type="button"
                      onClick={() => copyText('veo', activeVideo.veoPrompt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/12 text-zinc-200 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedKey === 'veo' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === 'veo' ? 'Prompt copié' : 'Copier le prompt'}</span>
                    </button>
                  </div>

                  <div className="font-mono text-xs text-zinc-300 bg-[#0A0912] border border-white/8 rounded-lg p-5 leading-relaxed">
                    {activeVideo.veoPrompt}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-zinc-400">
                    <span>
                      Statut actuel :{' '}
                      <strong className="text-white">
                        {activeVideo.status === 'published' && activeVideo.videoUrl
                          ? 'Vidéo MP4/WebM publiée'
                          : 'Pré-production animée (emplacement vidéo prêt)'}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('admin')}
                      className="text-[#22D3EE] hover:text-white font-medium cursor-pointer"
                    >
                      Associer une URL vidéo finale
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Playlist Sidebar (All 7 Videos A–G) */}
        <aside className="lg:col-span-4 space-y-3" aria-label="Liste des séquences vidéo">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-white">Catalogue des séquences (A – G)</h2>
            <span className="text-xs font-mono text-zinc-500 tabular-nums">
              {filteredVideos.length} affichée{filteredVideos.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredVideos.map((item) => {
              const selected = item.code === activeVideo.code;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedVideoCode(item.code)}
                  className={`w-full text-left rounded-xl border p-3.5 transition-colors flex gap-3.5 items-center cursor-pointer ${
                    selected
                      ? 'bg-[#19162B] border-[#EC4899]/65'
                      : 'bg-[#11101B] border-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="w-24 aspect-video rounded-md overflow-hidden border border-white/10 bg-black shrink-0">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 tabular-nums">
                      <span className="text-[#22D3EE] font-semibold">Vidéo {item.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.aspectRatio}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.durationLabel}</span>
                    </div>
                    <p className="text-sm font-medium text-white line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {item.status === 'published' && item.videoUrl
                        ? 'Vidéo HD publiée'
                        : 'Séquence animée · Storyboard prêt'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredVideos.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-[#11101B] p-6 text-center space-y-2">
              <Film className="w-6 h-6 text-zinc-500 mx-auto" />
              <p className="text-sm text-zinc-400">Aucune séquence dans cette catégorie.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
