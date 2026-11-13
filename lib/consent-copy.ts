export const CONSENT_LOCALES = { EN: 'en' } as const;

export type ConsentLocale = (typeof CONSENT_LOCALES)[keyof typeof CONSENT_LOCALES];

export const DEFAULT_CONSENT_LOCALE: ConsentLocale = CONSENT_LOCALES.EN;

export type ConsentCopy = {
  dialogLabel: string;
  label: string;
  body: string;
  bodyWithAds: string;
  necessaryOnly: string;
  acceptAdvertising: string;
  manage: string;
  hideManage: string;
  save: string;
  privacy: string;
  necessaryTitle: string;
  necessaryDescription: string;
  alwaysOn: string;
  measurementTitle: string;
  measurementDescription: string;
  advertisingTitle: string;
  advertisingDescription: string;
};

export const CONSENT_COPY: Record<ConsentLocale, ConsentCopy> = {
  en: {
    dialogLabel: 'Cookie consent',
    label: 'Cookies',
    body: 'We use cookies to measure our ads and improve the site. Nothing loads until you say so.',
    bodyWithAds:
      'We use cookies to measure our ads, and our blog articles can show ads from Monetag. Nothing loads until you say so.',
    necessaryOnly: 'Necessary only',
    acceptAdvertising: 'Accept advertising',
    manage: 'Manage',
    hideManage: 'Hide options',
    save: 'Save choices',
    privacy: 'Privacy',
    necessaryTitle: 'Necessary',
    necessaryDescription: 'Remembers this choice. No tracking.',
    alwaysOn: 'Always on',
    measurementTitle: 'Ad measurement',
    measurementDescription: 'Meta Pixel, to see which of our own ads bring visitors.',
    advertisingTitle: 'Blog advertising',
    advertisingDescription: 'Monetag In-Page Push ads on blog articles only. The ad network may use cookies and your IP address.',
  },
};
