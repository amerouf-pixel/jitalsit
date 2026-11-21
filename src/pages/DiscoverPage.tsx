import { ArrowRight, ArrowUpRight, Check, Clock } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { JITALX_ASSETS } from '../data/assets';
import { MediaFrame } from '../components/MediaFrame';

export function DiscoverPage() {
  const { navigate, siteCopy } = useSite();

  const pillars = [
    {
      num: '01',
      title: 'Un vrai poste de commandement sur second écran',
      body: 'Plutôt que d’éparpiller vos suivis entre des feuilles volantes, des notes et plusieurs onglets, JITALX regroupe tableau de bord, missions, objets de collection, trophées, garage, carte radar 360°, notes et statistiques dans une interface cohérente.',
    },
    {
      num: '02',
      title: 'Conçu pour passer du jeu solo au direct OBS',
      body: 'Le Streamer Studio réutilise directement votre progression et votre chronomètre de session. Choisissez votre fond (Vert Chroma, Transparent OBS ou Sunset Néon), votre ratio (16:9 ou 9:16), générez votre URL OBS et passez en Mode Capture Propre avec la touche H.',
    },
    {
      num: '03',
      title: 'Vos sauvegardes restent libres et portables',
      body: 'Exportez et importez vos sauvegardes complètes au format JSON standard à tout moment, tout en profitant des profils personnalisés et de la synchronisation Cloud pour changer facilement de machine.',
    },
  ];

  const availableNow = [
    'Espace de travail et tableau de bord de progression 100 %',
    'Missions, objets de collection, objectifs et trophées',
    'Garage et fiches comparatives des véhicules',
    'Carte interactive radar 360° et marqueurs personnalisés',
    'Carnet de notes et statistiques de session',
    'Streamer Studio avec fonds Chroma, Transparent OBS et Sunset Néon',
    'Overlays aux formats 16:9 et 9:16 et Mode Capture Propre (H)',
    'Widgets mission, compteur de défi, chat HUD, alertes manuelles et chronomètre',
    'Générateur d’URL pour OBS Studio',
    'Exportation / importation JSON, profils personnalisés et sauvegardes Cloud',
    'Accès complet officiel à 7 € via Gumroad',
  ];

  const notYetConnected = [
    'Alertes automatiques Twitch et YouTube (les alertes actuelles sont déclenchées manuellement)',
    'Connexion OBS WebSocket (l’intégration passe aujourd’hui par Source Navigateur ou capture Chroma)',
    'Abonnements mensuels Stripe (non opérationnels)',
    'Activation automatique de formule Pro (non opérationnelle)',
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-20">
      {/* Intro Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <p className="text-xs font-medium text-[#22D3EE]">Découvrir JITALX</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Une plateforme pensée pour organiser vos sessions et habiller vos lives.
          </h1>
          <p className="text-base text-zinc-300 leading-relaxed">
            JITALX est un centre de commande numérique indépendant dédié aux joueurs exigeants et
            aux créateurs de contenu. Ce site officiel vous présente fidèlement ses modules réels,
            ses captures authentiques et son fonctionnement avec OBS Studio.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('fonctionnalites')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-white text-[#09090F] hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Parcourir les 15 fonctionnalités</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('videos')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-zinc-200 border border-white/12 hover:border-white/25 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Voir les vidéos de démonstration</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <MediaFrame
            src={JITALX_ASSETS.heroCreatorLoft}
            alt="Poste créateur JITALX dans un studio sombre"
            caption="Un environnement sobre et structuré pensé pour accompagner votre jeu sur second écran."
          />
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.num}
            className="rounded-xl border border-white/10 bg-[#11101B] p-7 space-y-3"
          >
            <p className="font-mono text-xs text-[#22D3EE]">{pillar.num}.</p>
            <h2 className="font-display text-xl font-semibold text-white">{pillar.title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{pillar.body}</p>
          </div>
        ))}
      </section>

      {/* Authentic Visual Gallery */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-[#22D3EE]">L’application en conditions réelles</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Un univers visuel fidèle de la gestion solo au direct OBS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaFrame
            src={JITALX_ASSETS.dualScreenProduct}
            alt="Poste double écran 16:9 et 9:16 pour JITALX"
            caption="Compatibilité double orientation : tableau de bord principal 16:9 et formats verticaux 9:16."
          />
          <MediaFrame
            src={JITALX_ASSETS.broadcastControlDesk}
            alt="Régie broadcast multi-écrans pour streamer"
            caption="Intégration naturelle dans un setup de streaming multi-écrans avec OBS Studio."
          />
        </div>
      </section>

      {/* Transparency Matrix */}
      <section className="rounded-2xl border border-white/10 bg-[#11101B] p-7 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-[#22D3EE]">Transparence technique</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Ce qui est opérationnel aujourd’hui et ce qui ne l’est pas encore
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Nous préférons présenter exactement l’état actuel de JITALX afin que vous sachiez avec
            précision ce que vous achetez à 7 €.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white pb-2 border-b border-white/10">
              Disponible dès maintenant
            </h3>
            <ul className="space-y-3">
              {availableNow.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white pb-2 border-b border-white/10">
              Non encore connecté / Non disponible
            </h3>
            <ul className="space-y-3">
              {notYetConnected.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <a
                href={siteCopy.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#EC4899] hover:bg-[#DB2777] rounded-lg transition-colors"
              >
                <span>Accès complet JITALX · 7 € sur Gumroad</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
