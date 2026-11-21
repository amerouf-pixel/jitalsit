import {
  FaqEntry,
  FeatureModuleSpec,
  NewsArticleItem,
  PromoContentItem,
  SiteCopyConfig,
  VideoProductionItem,
} from '../types/jitalx';
import { JITALX_ASSETS } from './assets';
import { OFFICIAL_GUMROAD_URL } from '../utils/validation';

export const DEFAULT_SITE_COPY: SiteCopyConfig = {
  id: 'main',
  heroTitle: 'Le centre de commande numérique des gamers et streamers.',
  heroSubtitle:
    'Suivez vos missions, vos collectibles, votre garage et pilotez vos overlays OBS 16:9 ou 9:16 depuis un poste unifié pensé pour le second écran.',
  primaryCtaLabel: 'Obtenir JITALX · 7 €',
  pricingHeadline: 'Accès complet JITALX — 7 €',
  pricingNote:
    'Paiement unique officiel via Gumroad. Les abonnements mensuels Stripe et l’activation Pro automatique ne sont pas encore actifs.',
  gumroadUrl: OFFICIAL_GUMROAD_URL,
};

export const REAL_FEATURES: FeatureModuleSpec[] = [
  {
    id: 'feat-dashboard',
    number: '01',
    title: 'Espace de travail et tableau de bord',
    group: 'commandement',
    summary:
      'Centralise votre progression globale, le chronomètre de session et les indicateurs clés de complétion sur un écran tactique lisible en un coup d’œil.',
    details: [
      'Synthèse immédiate Missions, Collectibles, Garage & Tuning et Trophées.',
      'Navigation par onglets rapides conçue pour le second écran pendant vos sessions.',
      'Raccourci direct vers le mode Streamer Studio OBS et l’ajout d’entrées.',
    ],
    screenshotUrl: JITALX_ASSETS.dashboardCommandCenter,
    screenshotAlt: 'Capture authentique du tableau de bord et centre de commandement JITALX',
    relatedVideoCode: 'A',
  },
  {
    id: 'feat-missions',
    number: '02',
    title: 'Missions et progression',
    group: 'progression',
    summary:
      'Organisez vos quêtes principales, opérations secondaires et jalons de complétion à 100 % avec suivi d’avancement en temps réel.',
    details: [
      'Journal de missions structuré par statut et pourcentage de progression.',
      'Synchronisation directe avec la barre de progression affichée dans le Streamer Studio.',
      'Calcul clair de votre avancée session après session.',
    ],
    screenshotUrl: JITALX_ASSETS.dashboardCommandCenter,
    screenshotAlt: 'Suivi des missions et de la progression globale dans JITALX',
    relatedVideoCode: 'B',
  },
  {
    id: 'feat-collectibles',
    number: '03',
    title: 'Objets de collection',
    group: 'progression',
    summary:
      'Recensez chaque collectible découvert et suivez précisément ce qu’il vous reste à trouver pour atteindre la complétion totale.',
    details: [
      'Compteur dédié intégré au centre de commandement et aux overlays live.',
      'Filtrage rapide des secrets et emplacements associés sur le radar.',
      'Sauvegarde structurée pour ne jamais perdre votre inventaire.',
    ],
    screenshotUrl: JITALX_ASSETS.radarTactical360,
    screenshotAlt: 'Filtrage des collectibles et secrets sur le radar tactique JITALX',
    relatedVideoCode: 'B',
  },
  {
    id: 'feat-trophies',
    number: '04',
    title: 'Objectifs et trophées',
    group: 'progression',
    summary:
      'Regroupez vos objectifs personnels, défis de complétion et trophées à débloquer dans une vue dédiée orientée résultat.',
    details: [
      'Suivi dédié des trophées et succès en cours ou validés.',
      'Liaison directe avec l’indicateur de progression globale du tableau de bord.',
      'Idéal pour structurer un marathon 100 % ou une série d’épisodes en direct.',
    ],
    screenshotUrl: JITALX_ASSETS.dashboardCommandCenter,
    screenshotAlt: 'Bloc Objectifs et trophées synchronisés sur le tableau de bord JITALX',
    relatedVideoCode: 'B',
  },
  {
    id: 'feat-garage',
    number: '05',
    title: 'Garage et personnalisation des véhicules',
    group: 'progression',
    summary:
      'Consultez vos véhicules débloqués ou verrouillés, comparez vitesse de pointe, maniabilité et blindage, et repérez leurs emplacements.',
    details: [
      'Fiches détaillées par catégorie (Sport, Muscle, Moto, Offroad 4x4).',
      'Barres comparatives claires : Vitesse de pointe, Maniabilité et Blindage.',
      'Marquage en favori, statut de déblocage et localisation en jeu.',
    ],
    screenshotUrl: JITALX_ASSETS.garageVehicles,
    screenshotAlt: 'Capture authentique du garage JITALX avec fiches véhicules',
    relatedVideoCode: 'C',
  },
  {
    id: 'feat-streamer-studio',
    number: '06',
    title: 'Streamer Studio',
    group: 'streamer',
    summary:
      'Un espace dédié aux créateurs pour composer et piloter leur habillage de direct avec fond Vert Chroma, fond Transparent OBS ou thème Sunset Néon.',
    details: [
      'Changement de fond en un clic : Chroma vert, Transparent OBS ou Sunset Néon.',
      'Édition instantanée du pseudo streamer et du titre du live en direct.',
      'Écran d’attente « Le live commence bientôt » intégré et synchronisé.',
    ],
    screenshotUrl: JITALX_ASSETS.streamerSunsetWaiting,
    screenshotAlt: 'Capture authentique du Streamer Studio OBS en mode Sunset Néon',
    relatedVideoCode: 'D',
  },
  {
    id: 'feat-overlays-ratios',
    number: '07',
    title: 'Overlays aux formats 16:9 et 9:16',
    group: 'streamer',
    summary:
      'Basculez entre le format paysage 16:9 pour Twitch/YouTube et le format vertical 9:16 pour les lives mobiles, Shorts et TikTok.',
    details: [
      'Sélecteur natif 16:9 et 9:16 directement dans la barre du Streamer Studio.',
      'Cadre caméra calibré avec indicateur LIVE et bandeau d’identité.',
      'Disposition lisible aussi bien sur écran large que sur flux vertical.',
    ],
    screenshotUrl: JITALX_ASSETS.dualScreenProduct,
    screenshotAlt: 'Poste double écran illustrant les formats 16:9 et 9:16',
    relatedVideoCode: 'D',
  },
  {
    id: 'feat-widgets-hud',
    number: '08',
    title: 'Widgets HUD, alertes manuelles et chronomètre',
    group: 'streamer',
    summary:
      'Affichez vos widgets de mission, compteur de défi, chat HUD, alertes déclenchées manuellement et chronomètre de session en direct.',
    details: [
      'Widget de mission active, compteur de défi et bandeau chat HUD.',
      'Chronomètre de session avec commandes Pause et Reset en direct.',
      'Déclenchement d’alertes manuelles maîtrisé depuis le studio.',
    ],
    screenshotUrl: JITALX_ASSETS.streamerChromaGreen,
    screenshotAlt: 'Widgets HUD, barre de progression et chronomètre sur fond vert chroma',
    transparencyNote:
      'Transparence : les alertes actuelles sont manuelles. Les alertes automatiques Twitch/YouTube et OBS WebSocket ne sont pas encore connectés.',
    relatedVideoCode: 'D',
  },
  {
    id: 'feat-obs-url',
    number: '09',
    title: 'Générateur d’URL pour OBS',
    group: 'streamer',
    summary:
      'Générez une URL d’overlay prête à coller dans une Source Navigateur OBS Studio avec vos paramètres de format, fond et widgets.',
    details: [
      'Intégration directe dans OBS via Source Navigateur en mode fond transparent.',
      'Alternative Chroma Key verte disponible immédiatement pour la capture fenêtre.',
      'Configuration répétable sans recréer vos scènes à chaque session.',
    ],
    screenshotUrl: JITALX_ASSETS.streamerTransparentObs,
    screenshotAlt: 'Capture authentique du mode Fond Transparent OBS dans JITALX',
    transparencyNote:
      'Fonctionne par Source Navigateur ou capture fenêtre OBS. La liaison OBS WebSocket n’est pas encore connectée.',
    relatedVideoCode: 'E',
  },
  {
    id: 'feat-clean-capture',
    number: '10',
    title: 'Mode Capture Propre',
    group: 'streamer',
    summary:
      'Appuyez sur la touche H ou le bouton dédié pour masquer instantanément toute l’interface d’édition et diffuser un rendu parfaitement propre.',
    details: [
      'Disparition immédiate des barres d’outils, champs texte et contrôles studio.',
      'Seuls le cadre caméra, l’écran d’attente et la barre HUD restent visibles.',
      'Raccourci plein écran F11 et retour rapide au contrôle en une touche.',
    ],
    screenshotUrl: JITALX_ASSETS.streamerCleanCapture,
    screenshotAlt: 'Capture authentique du Mode Capture Propre (touche H) dans JITALX',
    relatedVideoCode: 'E',
  },
  {
    id: 'feat-radar-map',
    number: '11',
    title: 'Carte interactive et marqueurs personnalisés',
    group: 'commandement',
    summary:
      'Explorez le secteur sur le radar holographique 360°, filtrez par catégorie et cliquez sur chaque marqueur pour inspecter ses coordonnées.',
    details: [
      'Balayage télémétrique 360° avec portée configurable et commande Zoom.',
      'Filtres dédiés : Tout scanner, Missions, Secrets et Garage.',
      'Verrouillage de cible et ajout de marqueurs personnalisés.',
    ],
    screenshotUrl: JITALX_ASSETS.radarTactical360,
    screenshotAlt: 'Capture authentique du Radar holographique tactique 360 degrés de JITALX',
    relatedVideoCode: 'F',
  },
  {
    id: 'feat-notes',
    number: '12',
    title: 'Carnet de notes',
    group: 'commandement',
    summary:
      'Notez vos itinéraires, codes, stratégies de boss ou idées de live directement dans l’onglet Notes sans quitter votre centre de commande.',
    details: [
      'Accessible en un clic depuis la barre d’onglets principale de JITALX.',
      'Pensé pour consigner vos repères pendant une session ou préparer un live.',
      'Inclus dans vos exports JSON et sauvegardes de profil.',
    ],
    screenshotUrl: JITALX_ASSETS.heroCreatorLoft,
    screenshotAlt: 'Espace de travail calme pour préparer ses notes et sessions de jeu',
    relatedVideoCode: 'F',
  },
  {
    id: 'feat-stats',
    number: '13',
    title: 'Statistiques',
    group: 'commandement',
    summary:
      'Visualisez vos progrès par module, vos temps de session et l’avancement global vers le 100 % dans l’onglet Stats.',
    details: [
      'Vue consolidée de l’avancement par catégorie de jeu.',
      'Suivi du temps de session et estimation claire du parcours restant.',
      'Lecture rapide pensée pour les complétionnistes et les speedrunners.',
    ],
    screenshotUrl: JITALX_ASSETS.radarTactical360,
    screenshotAlt: 'Optimisateur de trajectoire et statistiques d’avancement JITALX',
    relatedVideoCode: 'F',
  },
  {
    id: 'feat-json-backup',
    number: '14',
    title: 'Exportation et importation des sauvegardes JSON',
    group: 'donnees',
    summary:
      'Gardez la maîtrise totale de vos données en exportant et réimportant vos sauvegardes complètes au format JSON standard.',
    details: [
      'Archivage local transparent et portable entre vos ordinateurs.',
      'Restauration rapide de vos missions, marqueurs, véhicules et notes.',
      'Aucun verrouillage propriétaire de vos sauvegardes.',
    ],
    screenshotUrl: JITALX_ASSETS.dashboardCommandCenter,
    screenshotAlt: 'Tableau de bord JITALX compatible exportation et importation JSON',
    relatedVideoCode: 'F',
  },
  {
    id: 'feat-profiles-cloud',
    number: '15',
    title: 'Profils personnalisés et sauvegardes Cloud',
    group: 'donnees',
    summary:
      'Créez vos profils personnalisés, retrouvez vos préférences et synchronisez vos sauvegardes dans le Cloud en toute sécurité.',
    details: [
      'Profils adaptés à vos différents jeux, défis ou identités de streaming.',
      'Sauvegarde Cloud associée à votre compte utilisateur authentifié.',
      'Architecture pensée pour unifier l’authentification Firebase.',
    ],
    screenshotUrl: JITALX_ASSETS.broadcastControlDesk,
    screenshotAlt: 'Poste de commande multi-écrans illustrant les profils personnalisés et le Cloud',
    relatedVideoCode: 'A',
  },
];

export const DEFAULT_VIDEO_PRODUCTIONS: VideoProductionItem[] = [
  {
    id: 'video-a-decouverte',
    code: 'A',
    title: 'Découverte de JITALX — Présentation principale',
    subtitle:
      'Vue d’ensemble complète du centre de commande numérique JITALX : tableau de bord 100 %, radar tactique 360°, garage et Streamer Studio OBS.',
    category: 'principale',
    aspectRatio: '16:9',
    durationLabel: '00:36',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.dashboardCommandCenter,
    targetPage: 'accueil',
    veoPrompt:
      'Sleek dark studio showcase presenting the real JITALX tactical HUD interface on an ultrawide desk monitor, smooth slow dolly-in across the command center dashboard, 360 holographic radar, vehicle garage cards, and OBS Streamer Studio overlay modes. Crisp typography, subtle sunset-magenta and cyan highlights, no distortion of UI text, 16:9 broadcast quality.',
    scenes: [
      {
        id: 'a-1',
        timecode: '00:00',
        durationSec: 6,
        title: 'Ouverture — L’univers JITALX',
        overlayCaption: 'JITALX · Centre de commande pour gamers & streamers',
        voiceOver:
          'Pilotez chaque session de jeu et chaque direct depuis une interface pensée pour votre second écran.',
        cameraMotion: 'zoom-in',
        transition: 'Fondu cinématique',
        imageUrl: JITALX_ASSETS.heroCreatorLoft,
        imageAlt: 'Créateur face à son poste de commande JITALX',
      },
      {
        id: 'a-2',
        timecode: '00:06',
        durationSec: 8,
        title: 'Centre de commandement 100 %',
        overlayCaption: 'Missions, Collectibles, Garage et Trophées réunis',
        voiceOver:
          'Dès l’ouverture, le tableau de bord rassemble vos missions, vos objets de collection, votre garage et vos trophées avec le chrono de session.',
        cameraMotion: 'pan-right',
        transition: 'Glissé latéral net',
        imageUrl: JITALX_ASSETS.dashboardCommandCenter,
        imageAlt: 'Tableau de bord Centre de Commandement JITALX',
      },
      {
        id: 'a-3',
        timecode: '00:14',
        durationSec: 7,
        title: 'Radar holographique 360°',
        overlayCaption: 'Carte interactive, filtres et verrouillage de marqueurs',
        voiceOver:
          'Repérez chaque objectif sur le radar 360 degrés, filtrez vos marqueurs personnalisés et gardez votre trajectoire sous contrôle.',
        cameraMotion: 'zoom-out',
        transition: 'Balayage vertical',
        imageUrl: JITALX_ASSETS.radarTactical360,
        imageAlt: 'Radar holographique tactique 360 degrés',
      },
      {
        id: 'a-4',
        timecode: '00:21',
        durationSec: 7,
        title: 'Garage & Streamer Studio OBS',
        overlayCaption: 'De votre progression au live OBS en un clic',
        voiceOver:
          'Passez directement du suivi de votre garage au Streamer Studio OBS en mode Sunset Néon, transparent ou fond vert chroma.',
        cameraMotion: 'zoom-in',
        transition: 'Fondu enchaîné',
        imageUrl: JITALX_ASSETS.streamerSunsetWaiting,
        imageAlt: 'Streamer Studio OBS fond Sunset Néon',
      },
      {
        id: 'a-5',
        timecode: '00:28',
        durationSec: 8,
        title: 'Appel à l’action — Accès complet 7 €',
        overlayCaption: 'Mode Capture Propre (H) · Accès complet à 7 € sur Gumroad',
        voiceOver:
          'Appuyez sur H pour activer le Mode Capture Propre et passez en direct. Accès complet JITALX disponible dès maintenant à 7 euros.',
        cameraMotion: 'zoom-out',
        transition: 'Clôture nette',
        imageUrl: JITALX_ASSETS.streamerCleanCapture,
        imageAlt: 'Mode Capture Propre OBS prêt à diffuser',
      },
    ],
  },
  {
    id: 'video-b-missions',
    code: 'B',
    title: 'Missions, progression et trophées',
    subtitle:
      'Suivez chaque mission, collectible et trophée sans rien oublier jusqu’au 100 %.',
    category: 'modules',
    aspectRatio: '16:9',
    durationLabel: '00:24',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.dashboardCommandCenter,
    targetPage: 'fonctionnalites',
    veoPrompt:
      'Focused UI presentation of the JITALX command dashboard highlighting the Missions, Collectibles, and Trophies progress bars alongside the 360 radar markers and session timer, clean camera pan preserving crisp French UI text, 16:9.',
    scenes: [
      {
        id: 'b-1',
        timecode: '00:00',
        durationSec: 8,
        title: 'Vue d’ensemble des compteurs 100 %',
        overlayCaption: 'Missions · Collectibles · Trophées & Succès',
        voiceOver:
          'Chaque module affiche votre progression exacte avec des jauges dédiées et un compteur global toujours visible en haut d’écran.',
        cameraMotion: 'zoom-in',
        transition: 'Ouverture douce',
        imageUrl: JITALX_ASSETS.dashboardCommandCenter,
        imageAlt: 'Jauges Missions, Collectibles et Trophées JITALX',
      },
      {
        id: 'b-2',
        timecode: '00:08',
        durationSec: 8,
        title: 'Filtrage des missions et secrets sur le radar',
        overlayCaption: 'Ciblez vos prochains objectifs sans perdre de temps',
        voiceOver:
          'Filtrez uniquement vos missions ou vos secrets sur le radar tactique et visualisez l’étape suivante à plus fort rendement.',
        cameraMotion: 'pan-right',
        transition: 'Glissé horizontal',
        imageUrl: JITALX_ASSETS.radarTactical360,
        imageAlt: 'Radar tactique et optimisateur de trajectoire',
      },
      {
        id: 'b-3',
        timecode: '00:16',
        durationSec: 8,
        title: 'Progression synchronisée sur votre overlay',
        overlayCaption: 'Votre barre 100 % s’affiche aussi pendant vos lives',
        voiceOver:
          'Votre avancement Missions et Collectibles alimente directement la barre inférieure de votre Streamer Studio pour votre communauté.',
        cameraMotion: 'zoom-out',
        transition: 'Fondu final',
        imageUrl: JITALX_ASSETS.streamerCleanCapture,
        imageAlt: 'Barre de progression 100% affichée dans l’overlay OBS',
      },
    ],
  },
  {
    id: 'video-c-garage',
    code: 'C',
    title: 'Garage et personnalisation des véhicules',
    subtitle:
      'Comparez les statistiques, gérez vos favoris et localisez chaque véhicule de votre collection.',
    category: 'modules',
    aspectRatio: '16:9',
    durationLabel: '00:22',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.garageVehicles,
    targetPage: 'fonctionnalites',
    veoPrompt:
      'Detailed UI walkthrough of the JITALX Garage screen showing Solaris Apex GT, Marlin Coastal Coupe, Mirage V-Wave 900, and DuneRunner Baja 4x4 vehicle cards with speed, handling, and armor bars, smooth editorial camera pan, 16:9.',
    scenes: [
      {
        id: 'c-1',
        timecode: '00:00',
        durationSec: 8,
        title: 'Votre parc de véhicules en un coup d’œil',
        overlayCaption: 'Sport · Muscle · Moto · Offroad 4x4',
        voiceOver:
          'L’onglet Véhicules réunit toutes vos machines : Solaris Apex GT, Marlin Coastal Coupe, Mirage V-Wave 900 et DuneRunner Baja 4x4.',
        cameraMotion: 'zoom-in',
        transition: 'Fondu net',
        imageUrl: JITALX_ASSETS.garageVehicles,
        imageAlt: 'Grille de fiches véhicules du Garage JITALX',
      },
      {
        id: 'c-2',
        timecode: '00:08',
        durationSec: 7,
        title: 'Comparaison vitesse, maniabilité et blindage',
        overlayCaption: 'Statistiques précises, favoris et points de localisation',
        voiceOver:
          'Comparez immédiatement vitesse de pointe, maniabilité et blindage, marquez vos favoris et retrouvez chaque emplacement sur la carte.',
        cameraMotion: 'pan-right',
        transition: 'Glissé fluide',
        imageUrl: JITALX_ASSETS.garageVehicles,
        imageAlt: 'Détail des statistiques de véhicules dans JITALX',
      },
      {
        id: 'c-3',
        timecode: '00:15',
        durationSec: 7,
        title: 'Relié au compteur Garage & Tuning',
        overlayCaption: 'Suivi intégré au tableau de bord principal',
        voiceOver:
          'Chaque véhicule débloqué met à jour votre jauge Garage et Tuning sur le centre de commandement.',
        cameraMotion: 'zoom-out',
        transition: 'Clôture nette',
        imageUrl: JITALX_ASSETS.dashboardCommandCenter,
        imageAlt: 'Compteur Garage et Tuning sur le tableau de bord',
      },
    ],
  },
  {
    id: 'video-d-streamer',
    code: 'D',
    title: 'Streamer Studio et overlays 16:9 & 9:16',
    subtitle:
      'Découvrez les fonds Chroma, Transparent OBS et Sunset Néon ainsi que les widgets HUD et alertes manuelles.',
    category: 'streamer',
    aspectRatio: '16:9',
    durationLabel: '00:32',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.streamerSunsetWaiting,
    targetPage: 'streamer-studio',
    veoPrompt:
      'Dynamic broadcast showcase of JITALX Streamer Studio transitioning cleanly between Sunset Neon waiting screen, Chroma Green overlay, Transparent OBS mode, and dual 16:9 + 9:16 creator monitor setup. Crisp HUD typography, no fake alerts.',
    scenes: [
      {
        id: 'd-1',
        timecode: '00:00',
        durationSec: 8,
        title: 'Un studio overlay pensé pour les streamers',
        overlayCaption: 'Formats 16:9 et 9:16 · Pseudo, titre et chrono en direct',
        voiceOver:
          'Activez le Streamer Studio pour personnaliser votre pseudo, votre titre de live et choisir votre format 16:9 ou vertical 9:16.',
        cameraMotion: 'zoom-in',
        transition: 'Fondu d’entrée',
        imageUrl: JITALX_ASSETS.dualScreenProduct,
        imageAlt: 'Poste double écran 16:9 et 9:16',
      },
      {
        id: 'd-2',
        timecode: '00:08',
        durationSec: 8,
        title: 'Scène d’attente Sunset Néon',
        overlayCaption: 'Écran « Le live commence bientôt » intégré',
        voiceOver:
          'Accueillez vos spectateurs avec l’écran d’attente Sunset Néon, le cadre caméra calibré et la barre de progression en temps réel.',
        cameraMotion: 'pan-right',
        transition: 'Balayage latéral',
        imageUrl: JITALX_ASSETS.streamerSunsetWaiting,
        imageAlt: 'Streamer Studio mode Sunset Néon avec écran d’attente',
      },
      {
        id: 'd-3',
        timecode: '00:16',
        durationSec: 8,
        title: 'Fond Vert Chroma et widgets manuels',
        overlayCaption: 'Mission, compteur de défi, chat HUD et alertes manuelles',
        voiceOver:
          'Basculez en Fond Vert Chroma ou en Fond Transparent OBS, et déclenchez vos alertes manuelles et votre chronomètre à la demande.',
        cameraMotion: 'zoom-in',
        transition: 'Coupe franche',
        imageUrl: JITALX_ASSETS.streamerChromaGreen,
        imageAlt: 'Streamer Studio en mode Fond Vert Chroma',
      },
      {
        id: 'd-4',
        timecode: '00:24',
        durationSec: 8,
        title: 'Rendu final sans distraction',
        overlayCaption: 'Prêt pour vos diffusions Twitch, YouTube ou TikTok',
        voiceOver:
          'Votre habillage reste cohérent du début à la fin du stream sans aucun logiciel complexe à installer.',
        cameraMotion: 'zoom-out',
        transition: 'Clôture',
        imageUrl: JITALX_ASSETS.streamerDualMonitorDesk,
        imageAlt: 'Streamer en direct devant son setup double écran',
      },
    ],
  },
  {
    id: 'video-e-obs',
    code: 'E',
    title: 'Utilisation avec OBS Studio',
    subtitle:
      'Générateur d’URL pour OBS, fond transparent, incrustation chroma et Mode Capture Propre (touche H).',
    category: 'streamer',
    aspectRatio: '16:9',
    durationLabel: '00:28',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.streamerTransparentObs,
    targetPage: 'streamer-studio',
    veoPrompt:
      'Practical tutorial showcase demonstrating JITALX integration with OBS Studio: switching from Transparent OBS mode to Chroma Green and activating Clean Capture Mode (H key) on a dual-monitor streaming setup, crisp legible UI.',
    scenes: [
      {
        id: 'e-1',
        timecode: '00:00',
        durationSec: 7,
        title: 'Étape 1 — Choisissez le mode Fond Transparent OBS',
        overlayCaption: 'Source Navigateur OBS directe sans détourage',
        voiceOver:
          'Sélectionnez le mode Fond Transparent OBS pour coller directement l’URL générée dans une Source Navigateur OBS Studio.',
        cameraMotion: 'zoom-in',
        transition: 'Fondu net',
        imageUrl: JITALX_ASSETS.streamerTransparentObs,
        imageAlt: 'Streamer Studio OBS en mode Fond Transparent',
      },
      {
        id: 'e-2',
        timecode: '00:07',
        durationSec: 7,
        title: 'Étape 2 — Alternative Fond Vert Chroma',
        overlayCaption: 'Filtre Chroma Key prêt en quelques secondes',
        voiceOver:
          'Vous préférez la capture de fenêtre ? Activez le Fond Vert Chroma en un clic et appliquez le filtre Chroma Key dans OBS.',
        cameraMotion: 'pan-right',
        transition: 'Glissé',
        imageUrl: JITALX_ASSETS.streamerChromaGreen,
        imageAlt: 'Mode Fond Vert Chroma dans JITALX',
      },
      {
        id: 'e-3',
        timecode: '00:14',
        durationSec: 7,
        title: 'Étape 3 — Activez le Mode Capture Propre (touche H)',
        overlayCaption: 'Touche H : toute la barre d’édition disparaît',
        voiceOver:
          'Une pression sur la touche H masque immédiatement tous les champs d’édition et les boutons studio : il ne reste que votre overlay propre.',
        cameraMotion: 'zoom-out',
        transition: 'Coupe instantanée',
        imageUrl: JITALX_ASSETS.streamerCleanCapture,
        imageAlt: 'Mode Capture Propre OBS sans barre d’outils',
      },
      {
        id: 'e-4',
        timecode: '00:21',
        durationSec: 7,
        title: 'Diffusion fluide en direct',
        overlayCaption: 'Workflow OBS simple, léger et maîtrisé manuellement',
        voiceOver:
          'Vous gardez le contrôle manuel total sur votre chrono et vos alertes, sans dépendre d’une connexion OBS WebSocket.',
        cameraMotion: 'zoom-in',
        transition: 'Clôture douce',
        imageUrl: JITALX_ASSETS.liveProductionSetup,
        imageAlt: 'Setup streamer trois écrans avec caméra et régie OBS',
      },
    ],
  },
  {
    id: 'video-f-carte-notes',
    code: 'F',
    title: 'Carte interactive, carnet de notes et statistiques',
    subtitle:
      'Marqueurs personnalisés sur radar 360°, prise de notes rapide, statistiques et sauvegardes JSON.',
    category: 'modules',
    aspectRatio: '16:9',
    durationLabel: '00:24',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.radarTactical360,
    targetPage: 'fonctionnalites',
    veoPrompt:
      'Editorial product showcase of the JITALX 360 tactical radar map with target lock panel, route optimizer, notes tab, statistics overview, and JSON backup workflow on a matte dark workstation, 16:9.',
    scenes: [
      {
        id: 'f-1',
        timecode: '00:00',
        durationSec: 8,
        title: 'Radar 360° et marqueurs personnalisés',
        overlayCaption: '10 signaux détectés · Zoom 1x · Filtres par type',
        voiceOver:
          'Sur la carte radar interactive, sélectionnez n’importe quel marqueur lumineux pour verrouiller ses coordonnées et inspecter ses récompenses.',
        cameraMotion: 'zoom-in',
        transition: 'Ouverture fluide',
        imageUrl: JITALX_ASSETS.radarTactical360,
        imageAlt: 'Radar holographique tactique 360° JITALX',
      },
      {
        id: 'f-2',
        timecode: '00:08',
        durationSec: 8,
        title: 'Carnet de notes et statistiques de session',
        overlayCaption: 'Onglets Notes & Stats intégrés à votre second écran',
        voiceOver:
          'Consignez vos astuces dans le carnet de notes et consultez l’onglet Statistiques pour suivre votre rythme de complétion.',
        cameraMotion: 'pan-right',
        transition: 'Glissé latéral',
        imageUrl: JITALX_ASSETS.broadcastControlDesk,
        imageAlt: 'Poste de travail multi-écrans pour notes et statistiques',
      },
      {
        id: 'f-3',
        timecode: '00:16',
        durationSec: 8,
        title: 'Export / Import JSON et profils Cloud',
        overlayCaption: 'Vos sauvegardes toujours portables et sécurisées',
        voiceOver:
          'Exportez ou importez vos sauvegardes au format JSON à tout moment, ou synchronisez vos profils personnalisés dans le Cloud.',
        cameraMotion: 'zoom-out',
        transition: 'Fondu final',
        imageUrl: JITALX_ASSETS.dashboardCommandCenter,
        imageAlt: 'Centre de commandement JITALX avec progression sauvegardée',
      },
    ],
  },
  {
    id: 'video-g-social',
    code: 'G',
    title: 'Spot publicitaire court — Réseaux sociaux',
    subtitle:
      'Format vertical 9:16 rythmé pour TikTok, Reels et YouTube Shorts présentant JITALX et l’offre 7 €.',
    category: 'social',
    aspectRatio: '9:16',
    durationLabel: '00:20',
    status: 'storyboard',
    videoUrl: '',
    posterUrl: JITALX_ASSETS.commandWallSetup,
    targetPage: 'videos',
    veoPrompt:
      'High-energy 9:16 vertical promotional reel for JITALX aimed at gamers and streamers: quick clean cuts between a multi-screen gaming station, the real JITALX dashboard HUD, 360 radar, and Clean Capture OBS overlay, ending on a clean 7 EUR full-access card.',
    scenes: [
      {
        id: 'g-1',
        timecode: '00:00',
        durationSec: 5,
        title: 'Accroche 9:16',
        overlayCaption: 'Ton second écran mérite un vrai centre de commande.',
        voiceOver: 'Ton second écran mérite mieux qu’un simple bloc-notes.',
        cameraMotion: 'zoom-in',
        transition: 'Coupe rythmée',
        imageUrl: JITALX_ASSETS.commandWallSetup,
        imageAlt: 'Setup gaming immersif multi-écrans',
      },
      {
        id: 'g-2',
        timecode: '00:05',
        durationSec: 5,
        title: 'Missions, Radar & Garage',
        overlayCaption: 'Missions · Collectibles · Garage · Radar 360°',
        voiceOver: 'Suis tes missions, ton garage et tes marqueurs radar en direct.',
        cameraMotion: 'pan-right',
        transition: 'Glissé rapide',
        imageUrl: JITALX_ASSETS.dashboardCommandCenter,
        imageAlt: 'Tableau de bord JITALX',
      },
      {
        id: 'g-3',
        timecode: '00:10',
        durationSec: 5,
        title: 'Streamer Studio OBS prêt en 1 touche',
        overlayCaption: 'Overlays 16:9 & 9:16 · Capture Propre (H)',
        voiceOver: 'Passe en Mode Capture Propre OBS d’une seule touche.',
        cameraMotion: 'zoom-in',
        transition: 'Coupe nette',
        imageUrl: JITALX_ASSETS.streamerCleanCapture,
        imageAlt: 'Overlay OBS propre JITALX',
      },
      {
        id: 'g-4',
        timecode: '00:15',
        durationSec: 5,
        title: 'Offre finale 7 €',
        overlayCaption: 'JITALX · Accès complet à 7 € sur Gumroad',
        voiceOver: 'JITALX, accès complet à 7 euros. Lien officiel en description.',
        cameraMotion: 'zoom-out',
        transition: 'Clôture impact',
        imageUrl: JITALX_ASSETS.dualScreenProduct,
        imageAlt: 'Poste double écran JITALX 16:9 et 9:16',
      },
    ],
  },
];

export const DEFAULT_NEWS_ARTICLES: NewsArticleItem[] = [
  {
    id: 'news-lancement-site',
    title: 'Ouverture du site officiel JITALX et du Studio Vidéo',
    category: 'Annonce',
    summary:
      'JITALX dispose désormais d’une vitrine commerciale dédiée, d’une bibliothèque de démonstrations animées et d’un accès direct à l’offre complète à 7 €.',
    body: 'Nous lançons aujourd’hui le site officiel de JITALX afin de présenter clairement chaque module de l’application aux gamers et aux streamers. Vous y trouverez les captures authentiques de l’interface, les 7 séquences de présentation du Studio Vidéo (avec storyboards et scripts complets), un espace membre connecté à Firebase ainsi que le lien d’achat officiel sur Gumroad.',
    publishedLabel: 'Novembre 2026',
    status: 'published',
  },
  {
    id: 'news-streamer-studio-obs',
    title: 'Streamer Studio : Mode Capture Propre (H), Chroma et Fond Transparent OBS',
    category: 'Streamer Studio',
    summary:
      'Tour d’horizon des trois modes de fond OBS, de la bascule 16:9 / 9:16 et du raccourci Capture Propre pour diffuser sans barre d’outils.',
    body: 'Le Streamer Studio intégré à JITALX permet de préparer votre habillage en direct en quelques instants : choisissez le Fond Transparent OBS pour une Source Navigateur directe, le Fond Vert Chroma pour une incrustation rapide ou le thème Sunset Néon avec écran d’attente « Le live commence bientôt ». Une pression sur la touche H masque immédiatement les champs d’édition pour une diffusion parfaitement nette.',
    publishedLabel: 'Novembre 2026',
    status: 'published',
  },
  {
    id: 'news-transparence-roadmap',
    title: 'Point de transparence : alertes manuelles, OBS et modèle tarifaire unique à 7 €',
    category: 'Feuille de route',
    summary:
      'Clarification officielle sur ce qui est disponible aujourd’hui dans JITALX et les intégrations en préparation pour les prochaines étapes.',
    body: 'Par souci de transparence totale envers la communauté : les alertes du Streamer Studio fonctionnent actuellement en déclenchement manuel. Les alertes automatiques Twitch et YouTube ainsi que la connexion OBS WebSocket ne sont pas encore connectées. De même, les abonnements mensuels Stripe et l’activation Pro automatique ne sont pas opérationnels : l’accès complet JITALX est proposé uniquement en achat unique à 7 € via Gumroad.',
    publishedLabel: 'Octobre 2026',
    status: 'published',
  },
  {
    id: 'news-sauvegardes-json-cloud',
    title: 'Sauvegardes JSON et profils personnalisés : gardez le contrôle de vos données',
    category: 'Produit',
    summary:
      'Exportez et réimportez vos progressions en JSON standard tout en profitant de profils personnalisés et de la synchronisation Cloud.',
    body: 'Vos missions, collectibles, favoris du garage, marqueurs sur la carte radar et notes personnelles vous appartiennent. JITALX combine l’exportation et l’importation de fichiers JSON locaux avec la gestion de profils personnalisés et les sauvegardes Cloud pour vous permettre de passer facilement d’un poste à un autre.',
    publishedLabel: 'Octobre 2026',
    status: 'published',
  },
];

export const DEFAULT_PROMOS: PromoContentItem[] = [
  {
    id: 'promo-gumroad-7eur',
    title: 'Accès complet JITALX à 7 €',
    description:
      'Un paiement unique sans abonnement récurrent pour profiter du tableau de bord tactique, du garage, de la carte radar 360° et du Streamer Studio OBS.',
    ctaLabel: 'Acheter sur Gumroad · 7 €',
    ctaUrl: OFFICIAL_GUMROAD_URL,
    active: true,
  },
  {
    id: 'promo-studio-obs',
    title: 'Prêt pour vos lives 16:9 et 9:16',
    description:
      'Testez notre configurateur d’URL OBS et inspectez les 4 modes de capture réels du Streamer Studio avant de passer en direct.',
    ctaLabel: 'Explorer Streamer Studio',
    ctaUrl: '#streamer-studio',
    active: true,
  },
];

export const DEFAULT_FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'faq-1',
    category: 'Achat & Licence',
    question: 'Comment acheter JITALX et quel est le tarif exact ?',
    answer:
      'L’accès complet à JITALX est proposé au tarif unique de 7 € via notre page officielle Gumroad (https://gumroad.com/l/jitalx). Il n’y a aucun abonnement mensuel actif.',
  },
  {
    id: 'faq-2',
    category: 'Achat & Licence',
    question: 'Existe-t-il un abonnement mensuel Stripe ou une activation Pro automatique ?',
    answer:
      'Non. Les abonnements mensuels Stripe et l’activation automatique Pro ne sont pas encore opérationnels. L’offre officielle disponible aujourd’hui est uniquement l’accès complet à 7 € sur Gumroad.',
  },
  {
    id: 'faq-3',
    category: 'Streamer Studio & OBS',
    question: 'Comment intégrer JITALX dans OBS Studio ?',
    answer:
      'Dans le Streamer Studio, utilisez le générateur d’URL pour OBS avec le mode Fond Transparent OBS (à coller dans une Source Navigateur), ou utilisez le mode Fond Vert Chroma avec un filtre Chroma Key. Appuyez ensuite sur la touche H pour activer le Mode Capture Propre.',
  },
  {
    id: 'faq-4',
    category: 'Streamer Studio & OBS',
    question: 'Les alertes Twitch/YouTube automatiques et OBS WebSocket sont-ils connectés ?',
    answer:
      'Pas encore. Les alertes actuelles du Streamer Studio sont déclenchées manuellement. La connexion automatique aux alertes Twitch/YouTube et le pilotage par OBS WebSocket ne sont pas encore connectés.',
  },
  {
    id: 'faq-5',
    category: 'Application & Données',
    question: 'Puis-je sauvegarder et transférer ma progression vers un autre PC ?',
    answer:
      'Oui. JITALX intègre l’exportation et l’importation de sauvegardes au format JSON ainsi que les profils personnalisés et sauvegardes Cloud.',
  },
  {
    id: 'faq-6',
    category: 'Application & Données',
    question: 'Mon compte sur ce site officiel utilise-t-il Firebase ?',
    answer:
      'Oui. L’authentification et le stockage des profils membres reposent sur Firebase. Si vous disposez déjà d’un projet Firebase JITALX existant, la même base d’authentification peut être rattachée afin d’éviter deux systèmes de comptes séparés.',
  },
];
