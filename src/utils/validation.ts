import {
  ContactTopic,
  ObsOverlayConfig,
  VideoCategory,
  VideoProductionItem,
} from '../types/jitalx';

export const BLUEPRINT_LIMITS = {
  idPattern: /^[a-zA-Z0-9_-]+$/,
  idMaxLength: 128,
  displayNameMin: 1,
  displayNameMax: 100,
  emailMin: 3,
  emailMax: 200,
  streamerHandleMax: 60,
  bioMax: 400,
  contactNameMin: 2,
  contactNameMax: 100,
  contactMessageMin: 10,
  contactMessageMax: 2000,
  videoTitleMin: 2,
  videoTitleMax: 140,
  videoSubtitleMax: 260,
  videoUrlMax: 500,
  newsTitleMin: 4,
  newsTitleMax: 160,
  newsSummaryMin: 10,
  newsSummaryMax: 320,
  newsBodyMin: 20,
  newsBodyMax: 4000,
  heroTitleMin: 5,
  heroTitleMax: 160,
  heroSubtitleMin: 10,
  heroSubtitleMax: 360,
  ctaLabelMin: 2,
  ctaLabelMax: 60,
} as const;

export const ALLOWED_CONTACT_TOPICS: readonly ContactTopic[] = [
  'Achat & Licence 7 €',
  'Streamer Studio & OBS',
  'Compte & Sauvegarde',
  'Partenariat & Presse',
  'Autre question',
] as const;

export const OFFICIAL_GUMROAD_URL = 'https://gumroad.com/l/jitalx';
export const BOOTSTRAPPED_ADMIN_EMAIL = 'harzyyouness75@gmail.com';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length < BLUEPRINT_LIMITS.emailMin || trimmed.length > BLUEPRINT_LIMITS.emailMax) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export function isSafeHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/assets/')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateContactForm(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length < BLUEPRINT_LIMITS.contactNameMin) {
    errors.name = 'Veuillez indiquer votre nom ou pseudo (2 caractères minimum).';
  } else if (name.length > BLUEPRINT_LIMITS.contactNameMax) {
    errors.name = `Le nom ne peut pas dépasser ${BLUEPRINT_LIMITS.contactNameMax} caractères.`;
  }

  if (!isValidEmail(email)) {
    errors.email = 'Veuillez saisir une adresse e-mail valide.';
  }

  if (!ALLOWED_CONTACT_TOPICS.includes(input.topic as ContactTopic)) {
    errors.topic = 'Veuillez sélectionner un sujet valide.';
  }

  if (message.length < BLUEPRINT_LIMITS.contactMessageMin) {
    errors.message = 'Votre message doit contenir au moins 10 caractères.';
  } else if (message.length > BLUEPRINT_LIMITS.contactMessageMax) {
    errors.message = `Votre message ne peut pas dépasser ${BLUEPRINT_LIMITS.contactMessageMax} caractères.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileUpdate(input: {
  displayName: string;
  streamerHandle: string;
  bio: string;
  preferredFormat: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const displayName = input.displayName.trim();
  const handle = input.streamerHandle.trim();
  const bio = input.bio.trim();

  if (displayName.length < BLUEPRINT_LIMITS.displayNameMin) {
    errors.displayName = 'Le nom affiché est requis.';
  } else if (displayName.length > BLUEPRINT_LIMITS.displayNameMax) {
    errors.displayName = `Maximum ${BLUEPRINT_LIMITS.displayNameMax} caractères.`;
  }

  if (handle.length > BLUEPRINT_LIMITS.streamerHandleMax) {
    errors.streamerHandle = `Maximum ${BLUEPRINT_LIMITS.streamerHandleMax} caractères.`;
  }

  if (bio.length > BLUEPRINT_LIMITS.bioMax) {
    errors.bio = `Maximum ${BLUEPRINT_LIMITS.bioMax} caractères.`;
  }

  if (input.preferredFormat !== '16:9' && input.preferredFormat !== '9:16') {
    errors.preferredFormat = 'Le format doit être 16:9 ou 9:16.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildObsOverlayUrl(config: ObsOverlayConfig): string {
  const base = config.baseUrl.replace(/\/+$/, '');
  const params = new URLSearchParams();
  const normalizedHandle = config.handle.trim() || '@Runner_10J';
  const normalizedTitle = config.liveTitle.trim() || 'Objectif 100 % — Jour 1';

  params.set('mode', 'streamer-overlay');
  params.set('handle', normalizedHandle);
  params.set('title', normalizedTitle);
  params.set('ratio', config.format);
  params.set('bg', config.background);
  params.set('clean', config.cleanMode ? '1' : '0');

  const widgets: string[] = [];
  if (config.showMissionWidget) widgets.push('mission');
  if (config.showChallengeCounter) widgets.push('challenge');
  if (config.showChatHud) widgets.push('chat-hud');
  if (config.showManualAlerts) widgets.push('manual-alerts');
  if (config.showTimer) widgets.push('timer');
  params.set('widgets', widgets.join(',') || 'none');

  return `${base}/studio/obs?${params.toString()}`;
}

export function filterVideosByCategory(
  videos: VideoProductionItem[],
  category: VideoCategory | 'all'
): VideoProductionItem[] {
  if (category === 'all') return videos;
  return videos.filter((video) => video.category === category);
}

export function getTotalStoryboardSeconds(video: VideoProductionItem): number {
  return video.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
}

export function formatSecondsToTimecode(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function sanitizeSlugId(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return cleaned || `item-${Date.now()}`;
}

export function isBootstrappedAdminEmail(
  email: string | null | undefined,
  emailVerified: boolean | null | undefined
): boolean {
  if (!email || !emailVerified) return false;
  return email.trim().toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;
}
