export type PageId =
  | 'accueil'
  | 'decouvrir'
  | 'fonctionnalites'
  | 'videos'
  | 'streamer-studio'
  | 'tarifs'
  | 'connexion'
  | 'membre'
  | 'actualites'
  | 'assistance'
  | 'admin';

export type VideoCategory = 'principale' | 'modules' | 'streamer' | 'social';
export type AspectRatioOption = '16:9' | '9:16';
export type VideoStatus = 'storyboard' | 'published';

export interface StoryboardScene {
  id: string;
  timecode: string;
  durationSec: number;
  title: string;
  overlayCaption: string;
  voiceOver: string;
  cameraMotion: 'zoom-in' | 'pan-right' | 'zoom-out';
  transition: string;
  imageUrl: string;
  imageAlt: string;
}

export interface VideoProductionItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: VideoCategory;
  aspectRatio: AspectRatioOption;
  durationLabel: string;
  status: VideoStatus;
  videoUrl: string;
  posterUrl: string;
  targetPage: PageId;
  veoPrompt: string;
  scenes: StoryboardScene[];
  updatedAt?: string;
}

export type MediaCategory = 'capture-app' | 'streamer-obs' | 'studio-photo';

export interface MediaAssetItem {
  id: string;
  title: string;
  moduleName: string;
  category: MediaCategory;
  imageUrl: string;
  caption: string;
  updatedAt?: string;
}

export interface SiteCopyConfig {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaLabel: string;
  pricingHeadline: string;
  pricingNote: string;
  gumroadUrl: string;
  updatedAt?: string;
}

export type NewsCategory = 'Produit' | 'Streamer Studio' | 'Feuille de route' | 'Annonce';
export type NewsStatus = 'published' | 'draft';

export interface NewsArticleItem {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  body: string;
  publishedLabel: string;
  status: NewsStatus;
  updatedAt?: string;
}

export interface PromoContentItem {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  active: boolean;
  updatedAt?: string;
}

export type ContactTopic =
  | 'Achat & Licence 7 €'
  | 'Streamer Studio & OBS'
  | 'Compte & Sauvegarde'
  | 'Partenariat & Presse'
  | 'Autre question';

export type ContactStatus = 'new' | 'in_progress' | 'resolved';

export interface ContactRequestItem {
  id: string;
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  status: ContactStatus;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileRecord {
  uid: string;
  email: string;
  displayName: string;
  streamerHandle: string;
  bio: string;
  preferredFormat: AspectRatioOption;
  newsletterOptIn: boolean;
  role: 'member' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureModuleSpec {
  id: string;
  number: string;
  title: string;
  group: 'commandement' | 'progression' | 'streamer' | 'donnees';
  summary: string;
  details: string[];
  screenshotUrl: string;
  screenshotAlt: string;
  transparencyNote?: string;
  relatedVideoCode: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category: 'Achat & Licence' | 'Streamer Studio & OBS' | 'Application & Données';
}

export interface ObsOverlayConfig {
  baseUrl: string;
  handle: string;
  liveTitle: string;
  format: AspectRatioOption;
  background: 'chroma' | 'transparent' | 'sunset';
  cleanMode: boolean;
  showMissionWidget: boolean;
  showChallengeCounter: boolean;
  showChatHud: boolean;
  showTimer: boolean;
  showManualAlerts: boolean;
}
