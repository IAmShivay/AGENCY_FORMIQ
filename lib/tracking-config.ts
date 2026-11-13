export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '28091008350601343';

export const META_PIXEL_SCRIPT_URL = 'https://connect.facebook.net/en_US/fbevents.js';

// Bump CONSENT_VERSION whenever the set of trackers or the banner copy changes
// materially; stored choices with an older version are ignored and the banner shows again.
export const CONSENT_VERSION = 2;
export const CONSENT_STORAGE_KEY = 'formiq-cookie-consent';
export const CONSENT_COOKIE_NAME = 'formiq_consent';
export const CONSENT_COOKIE_MAX_AGE_DAYS = 180;
export const SECONDS_PER_DAY = 86400;
export const CONSENT_COOKIE_MAX_AGE_SECONDS = CONSENT_COOKIE_MAX_AGE_DAYS * SECONDS_PER_DAY;
export const CONSENT_COOKIE_SAME_SITE = 'Lax';
export const CONSENT_COOKIE_PATH = '/';
export const SECURE_PROTOCOL = 'https:';

export const CONSENT_PURPOSE = {
  MEASUREMENT: 'measurement',
  ADVERTISING: 'advertising',
} as const;

export type ConsentPurpose = (typeof CONSENT_PURPOSE)[keyof typeof CONSENT_PURPOSE];

export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';
export const CONSENT_CHANGED_EVENT = 'cookie-consent-changed';

export const PRIVACY_POLICY_PATH = '/privacy';
export const PRIVACY_ADVERTISING_ANCHOR = 'advertising';
