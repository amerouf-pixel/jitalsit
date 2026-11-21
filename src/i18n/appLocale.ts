import { DEFAULT_LOCALE, LocaleCode } from './locale';

export interface AppLocaleStrings {
  discordQuickLink: string;
  discordQuickLinkAria: string;
  discordSupportTitle: string;
  discordSupportDescription: string;
  discordSupportCta: string;
}

export const APP_LOCALE_STRINGS: Record<LocaleCode, AppLocaleStrings> = {
  fr: {
    discordQuickLink: 'Support & Communauté Discord',
    discordQuickLinkAria: 'Ouvrir le Support et la Communauté Discord JITALX dans un nouvel onglet',
    discordSupportTitle: 'Support & Communauté Discord',
    discordSupportDescription:
      'Besoin d’une réponse rapide sur OBS Studio, le Mode Capture Propre ou vos sauvegardes JSON ? Rejoignez le serveur Discord officiel JITALX.',
    discordSupportCta: 'Rejoindre la communauté Discord',
  },
  en: {
    discordQuickLink: 'Discord Community & Support',
    discordQuickLinkAria: 'Open JITALX Discord Community and Support in a new tab',
    discordSupportTitle: 'Discord Community & Support',
    discordSupportDescription:
      'Need quick help with OBS Studio, Clean Capture Mode, or your JSON backups? Join the official JITALX Discord server.',
    discordSupportCta: 'Join the Discord Community',
  },
};

export function getAppLocaleStrings(locale: LocaleCode = DEFAULT_LOCALE): AppLocaleStrings {
  return APP_LOCALE_STRINGS[locale];
}
