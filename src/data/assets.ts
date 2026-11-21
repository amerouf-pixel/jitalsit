import { MediaAssetItem } from '../types/jitalx';

export const JITALX_ASSETS = {
  // Authentic JITALX / NeonOS application screenshots
  dashboardCommandCenter: '/assets/aistudio/Capture_d__cran__1672__dc570c81.png',
  radarTactical360: '/assets/aistudio/Capture_d__cran__1673__a2e44307.png',
  garageVehicles: '/assets/aistudio/Capture_d__cran__1674__bc0bfe52.png',
  streamerSunsetWaiting: '/assets/aistudio/Capture_d__cran__1675__285bfd52.png',
  streamerChromaGreen: '/assets/aistudio/Capture_d__cran__1676__9d2919e7.png',
  streamerTransparentObs: '/assets/aistudio/Capture_d__cran__1677__eb048e78.png',
  streamerCleanCapture: '/assets/aistudio/Capture_d__cran__1678__a74cc666.png',

  // Curated studio & creator editorial photography
  heroCreatorLoft:
    '/assets/aistudio/chitalix_hero_studio_1795218833743_a0f46614.jpg',
  dualScreenProduct:
    '/assets/aistudio/chitalix_product_jitalx_1795218833865_25fdee9f.jpg',
  streamerDualMonitorDesk:
    '/assets/aistudio/pnoHcDd_NiLKJL6Wf2KCv8X4-odYPuxPfmyMdkM5zbBakbe6mdz9mZ4t30ZfgdgUs0dTLv_uK7ZnVIps1H63_-TaD2k1Vvk2DuoUHBHfnqt1ZsiyvOqIE7j7XMV9dvZnH1YNNhoojOdFwJBneViG_WBUf4VLbvlXFx7ghsQqy_rWOet45qjPJFNtGPL6JUq7_1ef60b19.jpg',
  broadcastControlDesk:
    '/assets/aistudio/YyLG4NyHPujrruQUDArAAVa4TvMuuC3QdvWg83ktS3VAC_fn3rF7DhPZrUCR1HrK-UU3aJL3N0rwBfDS3pL3C6nWsL3uqD2hW5w01OJtT2-cS9lbLS1n8HKgvpTQNlg8K0Uy849loJA8GTMf_PgV9PBsJNth-vFSZqEZe51WqxvD-jjLrw3-wdY3chjkzQT5_46eaf9a2.jpg',
  liveProductionSetup:
    '/assets/aistudio/vCe7eq1HEge9KV4EAf_yziJR2TZfRXDsJNhcP484Mjsoa_OLNUw0syFVmbkiv7YI07vfgMPRgHsOOmIY9Lk1GxqzIaLsMzA1tlKO4KhJkzbvvgSJDsQWy5Fogr0Be1PJZ_o61YacFZKWMHXOP1evMIkmfBUJ-ghCjBM55GzuEz2f28CWmrJix60O5dGXcm4Y_dec31b81.jpg',
  commandWallSetup:
    '/assets/aistudio/8viLF5hybK-8nJ-gq7EkGRoXsnnj-NxJFvy4_YCIPFTkgxZgQsRzPvIXXP2IXekowAqraCxrtNIsE7KFlD6ztMEn_FtwcGso9dKoQdXM7-1Ufj5YUtjH7oxjz5-hwwIVobJQWQcl0no7yImCzSkOkRwqzmkOfqC4QQIZk3KRR4CMuVxqIw28NhDEF9Ajf64k_3f48db38.jpg',
} as const;

export const DEFAULT_MEDIA_ASSETS: MediaAssetItem[] = [
  {
    id: 'asset-dashboard',
    title: 'Centre de commandement 100 %',
    moduleName: 'Tableau de bord',
    category: 'capture-app',
    imageUrl: JITALX_ASSETS.dashboardCommandCenter,
    caption:
      'Capture authentique du tableau de bord JITALX : suivi Missions, Collectibles, Garage & Tuning, Trophées et chrono de session.',
  },
  {
    id: 'asset-radar',
    title: 'Radar holographique tactique 360°',
    moduleName: 'Carte & Marqueurs',
    category: 'capture-app',
    imageUrl: JITALX_ASSETS.radarTactical360,
    caption:
      'Capture authentique de la carte radar 360° avec filtres Tout scanner, Missions, Secrets, Garage et verrouillage de marqueurs.',
  },
  {
    id: 'asset-garage',
    title: 'Garage & fiches véhicules',
    moduleName: 'Garage & Personnalisation',
    category: 'capture-app',
    imageUrl: JITALX_ASSETS.garageVehicles,
    caption:
      'Capture authentique du garage JITALX : Solaris Apex GT, Marlin Coastal Coupe, Mirage V-Wave 900 et DuneRunner Baja 4x4.',
  },
  {
    id: 'asset-streamer-chroma',
    title: 'Streamer Studio — Fond Vert Chroma',
    moduleName: 'Streamer Studio OBS',
    category: 'streamer-obs',
    imageUrl: JITALX_ASSETS.streamerChromaGreen,
    caption:
      'Incrustation chroma key prête pour OBS avec cadre caméra 16:9, barre de progression et chronomètre en direct.',
  },
  {
    id: 'asset-streamer-transparent',
    title: 'Streamer Studio — Fond Transparent OBS',
    moduleName: 'Streamer Studio OBS',
    category: 'streamer-obs',
    imageUrl: JITALX_ASSETS.streamerTransparentObs,
    caption:
      'Mode transparent natif conçu pour les sources navigateur OBS sans filtrage chromatique.',
  },
  {
    id: 'asset-streamer-sunset',
    title: 'Streamer Studio — Fond Sunset Néon',
    moduleName: 'Écran d’attente & Overlay',
    category: 'streamer-obs',
    imageUrl: JITALX_ASSETS.streamerSunsetWaiting,
    caption:
      'Scène Sunset Néon avec panneau d’attente « Le live commence bientôt » et barre de statut synchronisée.',
  },
  {
    id: 'asset-streamer-clean',
    title: 'Mode Capture Propre (Touche H)',
    moduleName: 'Capture Propre OBS',
    category: 'streamer-obs',
    imageUrl: JITALX_ASSETS.streamerCleanCapture,
    caption:
      'Interface d’édition masquée instantanément pour ne laisser à l’écran que l’overlay final prêt à diffuser.',
  },
  {
    id: 'asset-dual-format',
    title: 'Poste double écran 16:9 et 9:16',
    moduleName: 'Formats horizontaux & verticaux',
    category: 'studio-photo',
    imageUrl: JITALX_ASSETS.dualScreenProduct,
    caption:
      'Mise en scène d’un poste combinant moniteur principal 16:9 et écran secondaire vertical 9:16.',
  },
  {
    id: 'asset-hero-studio',
    title: 'Studio créateur JITALX',
    moduleName: 'Environnement de travail',
    category: 'studio-photo',
    imageUrl: JITALX_ASSETS.heroCreatorLoft,
    caption:
      'Espace de travail moderne pensé pour piloter sa session de jeu et son direct sur second écran.',
  },
  {
    id: 'asset-broadcast-desk',
    title: 'Régie broadcast multi-écrans',
    moduleName: 'Production vidéo & live',
    category: 'studio-photo',
    imageUrl: JITALX_ASSETS.broadcastControlDesk,
    caption:
      'Configuration régie complète dédiée au streaming, au montage et au suivi d’overlays.',
  },
];
