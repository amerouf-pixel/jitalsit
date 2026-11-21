export type LocaleCode = 'fr' | 'en';

export interface LandingLocaleStrings {
  discordButtonLabel: string;
  discordButtonAria: string;
  joinDiscordCommunity: string;
  communityEyebrow: string;
  communityTitle: string;
  communityDescription: string;
  footerCommunityHeading: string;
  footerDiscordLink: string;
}

export const LOCALE_STRINGS: Record<LocaleCode, LandingLocaleStrings> = {
  fr: {
    discordButtonLabel: 'Discord',
    discordButtonAria: 'Rejoindre la communauté Discord JITALX (nouvel onglet)',
    joinDiscordCommunity: 'Rejoindre la communauté Discord',
    communityEyebrow: 'Communauté officielle · Entraide & OBS',
    communityTitle: 'Échangez avec la communauté JITALX sur Discord',
    communityDescription:
      'Partagez vos réglages OBS 16:9 et 9:16, posez vos questions techniques, proposez des améliorations et suivez les annonces en direct avec les autres gamers et streamers.',
    footerCommunityHeading: 'Communauté',
    footerDiscordLink: 'Rejoindre la communauté Discord',
  },
  en: {
    discordButtonLabel: 'Discord',
    discordButtonAria: 'Join the JITALX Discord community (opens in a new tab)',
    joinDiscordCommunity: 'Join the Discord Community',
    communityEyebrow: 'Official Community · Support & OBS',
    communityTitle: 'Connect with the JITALX community on Discord',
    communityDescription:
      'Share your 16:9 and 9:16 OBS setups, ask technical questions, suggest improvements, and follow announcements live with other gamers and streamers.',
    footerCommunityHeading: 'Community',
    footerDiscordLink: 'Join the Discord Community',
  },
};

export const DEFAULT_LOCALE: LocaleCode = 'fr';

export function getLocaleStrings(locale: LocaleCode = DEFAULT_LOCALE): LandingLocaleStrings {
  return LOCALE_STRINGS[locale];
}
