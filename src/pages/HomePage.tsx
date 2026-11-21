import { ArrowRight, ArrowUpRight, Check, Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { JITALX_ASSETS } from '../data/assets';
import { MediaFrame } from '../components/MediaFrame';
import { MotionSequencePlayer } from '../components/MotionSequencePlayer';
import { DiscordIcon } from '../components/DiscordIcon';
import { DISCORD_INVITE_URL } from '../utils/validation';
import { getLocaleStrings } from '../i18n/locale';
import { getAppLocaleStrings } from '../i18n/appLocale';

export function HomePage() {
  const { navigate, siteCopy, videos, promos, setSelectedVideoCode } = useSite();
  const mainVideo = videos.find((v) => v.code === 'A') ?? videos[0];
  const activePromos = promos.filter((p) => p.active);
  const locale = getLocaleStrings('fr');
  const appLocale = getAppLocaleStrings('fr');

  const openVideo = (code: string) => {
    setSelectedVideoCode(code);
    navigate('videos');
  };

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-14 sm:pt-20 pb-8 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-[460px] bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.14),rgba(34,211,238,0.06)_45%,transparent_75%)]"
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium tracking-wide text-[#22D3EE]">
                Plateforme numérique · Gamers &amp; Streamers · Second écran &amp; OBS
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-white">
                {siteCopy.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                {siteCopy.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={siteCopy.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{siteCopy.primaryCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => navigate('decouvrir')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-zinc-200 hover:text-white border border-white/12 hover:border-white/25 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Découvrir JITALX</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                <span>
                  Paiement unique sur Gumroad · Sans abonnement mensuel · Captures réelles
                </span>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={appLocale.discordQuickLinkAria}
                  className="inline-flex items-center gap-1.5 font-medium text-[#A5B4FC] hover:text-white transition-colors whitespace-nowrap"
                >
                  <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>{appLocale.discordQuickLink}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <MediaFrame
                src={JITALX_ASSETS.dashboardCommandCenter}
                alt="Capture authentique du tableau de bord Centre de Commandement JITALX"
                aspectClass="aspect-video"
                fit="contain"
                className="w-full"
                priority
                caption="Capture réelle de l’application : Centre de commandement, suivi Missions, Collectibles, Garage et Trophées."
              />
            </div>
          </div>

          {/* Full-width 4-column factual capability strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-white/10 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="py-5 pr-4 lg:px-6 first:lg:pl-0">
              <p className="font-mono text-xl font-semibold text-white tabular-nums">15 modules</p>
              <p className="text-xs text-zinc-400 mt-1">
                Tableau de bord, radar 360°, garage, notes et stats
              </p>
            </div>
            <div className="py-5 pl-4 lg:px-6">
              <p className="font-mono text-xl font-semibold text-white tabular-nums">16:9 &amp; 9:16</p>
              <p className="text-xs text-zinc-400 mt-1">
                Overlays OBS Chroma, Transparent et Capture Propre (H)
              </p>
            </div>
            <div className="py-5 pr-4 lg:px-6">
              <p className="font-mono text-xl font-semibold text-white tabular-nums">JSON &amp; Cloud</p>
              <p className="text-xs text-zinc-400 mt-1">
                Exportation locale standard et profils personnalisés
              </p>
            </div>
            <div className="py-5 pl-4 lg:px-6 last:lg:pr-0">
              <p className="font-mono text-xl font-semibold text-[#22D3EE] tabular-nums">7 €</p>
              <p className="text-xs text-zinc-400 mt-1">
                Accès complet en paiement unique sur Gumroad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Presentation Video A */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#22D3EE]">
              01. Présentation principale · Studio Vidéo JITALX
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Découvrir JITALX en séquence animée
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Parcourez les vrais écrans de l’application dans notre séquence de présentation
              principale, avec storyboard complet, narration et export WebM disponibles dans la
              bibliothèque vidéo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openVideo('A')}
            className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#22D3EE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Voir les 7 vidéos &amp; storyboards</span>
          </button>
        </div>

        <MotionSequencePlayer video={mainVideo} onOpenStudio={() => openVideo('A')} />
      </section>

      {/* Asymmetric Showcase Grid of Authentic Modules */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-[#22D3EE]">02. Architecture réelle</p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Chaque module répond à un besoin concret en jeu et en direct
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar 360 */}
          <article className="lg:col-span-7 rounded-xl border border-white/10 bg-[#11101B] p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Carte interactive · Marqueurs personnalisés · Statistiques
              </p>
              <h3 className="font-display text-2xl font-semibold text-white">
                Radar holographique 360° et suivi de trajectoire
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                Filtrez vos signaux par Missions, Secrets ou Garage, verrouillez un marqueur pour
                consulter ses coordonnées et combinez la carte avec votre carnet de notes et vos
                statistiques de session.
              </p>
            </div>
            <MediaFrame
              src={JITALX_ASSETS.radarTactical360}
              alt="Capture authentique du radar holographique tactique 360 degrés JITALX"
              fit="contain"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => navigate('fonctionnalites')}
                className="text-sm font-medium text-white hover:text-[#22D3EE] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explorer les 15 modules</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => openVideo('F')}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Séquence F · Carte &amp; Stats
              </button>
            </div>
          </article>

          {/* Garage */}
          <article className="lg:col-span-5 rounded-xl border border-white/10 bg-[#11101B] p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">Garage · Véhicules · Favoris</p>
              <h3 className="font-display text-2xl font-semibold text-white">
                Garage et fiches comparatives
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Comparez vitesse de pointe, maniabilité et blindage sur vos véhicules Sport,
                Muscle, Moto et 4x4, marquez vos favoris et repérez leurs localisations.
              </p>
            </div>
            <MediaFrame
              src={JITALX_ASSETS.garageVehicles}
              alt="Capture authentique du garage et fiches véhicules JITALX"
              fit="contain"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => openVideo('C')}
                className="text-sm font-medium text-white hover:text-[#22D3EE] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Voir la séquence Garage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-zinc-500 font-mono">Séquence C</span>
            </div>
          </article>

          {/* Streamer Studio OBS Full-Width Split */}
          <article className="lg:col-span-12 rounded-xl border border-white/10 bg-[#11101B] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs text-[#22D3EE] font-medium">
                Streamer Studio · OBS Studio · 16:9 &amp; 9:16
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Passez en direct sans bricolage grâce au Mode Capture Propre
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Choisissez votre fond (Vert Chroma, Transparent OBS ou Sunset Néon), activez vos
                widgets manuels (mission, compteur de défi, chat HUD, alertes manuelles,
                chronomètre), copiez votre URL OBS et appuyez sur la touche H pour masquer toute
                la barre d’édition.
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22D3EE] mt-0.5 shrink-0" />
                  <span>Générateur d’URL OBS intégré pour Source Navigateur.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22D3EE] mt-0.5 shrink-0" />
                  <span>Bascule immédiate entre paysage 16:9 et vertical 9:16.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22D3EE] mt-0.5 shrink-0" />
                  <span>Contrôle manuel fiable (sans dépendance OBS WebSocket).</span>
                </li>
              </ul>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('streamer-studio')}
                  className="px-5 py-2.5 text-sm font-semibold bg-white text-[#09090F] hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Tester le configurateur OBS
                </button>
                <button
                  type="button"
                  onClick={() => openVideo('D')}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  Séquences D &amp; E
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MediaFrame
                src={JITALX_ASSETS.streamerCleanCapture}
                alt="Mode Capture Propre OBS sans barre d’édition"
                fit="contain"
                caption="Mode Capture Propre (touche H)"
              />
              <MediaFrame
                src={JITALX_ASSETS.streamerChromaGreen}
                alt="Streamer Studio OBS en mode Fond Vert Chroma"
                fit="contain"
                caption="Mode Fond Vert Chroma"
              />
            </div>
          </article>
        </div>
      </section>

      {/* Active Promotional Highlights (Admin Managed) */}
      {activePromos.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePromos.map((promo) => {
              const isExternal = promo.ctaUrl.startsWith('http');
              return (
                <div
                  key={promo.id}
                  className="rounded-xl border border-white/10 bg-[#12111C] p-7 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-semibold text-white">{promo.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{promo.description}</p>
                  </div>
                  <div>
                    {isExternal ? (
                      <a
                        href={promo.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#EC4899] hover:text-white transition-colors"
                      >
                        <span>{promo.ctaLabel}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('streamer-studio')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#22D3EE] hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{promo.ctaLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Discord Community Section */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="rounded-2xl border border-[#5865F2]/30 bg-gradient-to-br from-[#141326] via-[#11101C] to-[#0E101E] p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2.5 max-w-2xl">
            <p className="text-xs font-medium text-[#8EA1E1]">{locale.communityEyebrow}</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {locale.communityTitle}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {locale.communityDescription}
            </p>
          </div>

          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <DiscordIcon className="w-5 h-5 shrink-0" />
            <span>{locale.joinDiscordCommunity}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Commercial Conversion Block — 7 € Gumroad */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#12111C] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-[#22D3EE]">Offre officielle unique</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {siteCopy.pricingHeadline}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              Obtenez l’accès complet à JITALX en un seul règlement sur Gumroad. Tous les modules
              présentés sur ce site sont inclus, sans abonnement mensuel caché.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
              {siteCopy.pricingNote}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-stretch gap-3">
            <a
              href={siteCopy.gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Accéder à JITALX sur Gumroad — 7 €</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => navigate('tarifs')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-zinc-200 hover:text-white border border-white/12 hover:border-white/25 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Consulter le détail de l’offre</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
