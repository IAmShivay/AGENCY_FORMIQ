export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '28091008350601343';

export const META_PIXEL_SCRIPT_URL = 'https://connect.facebook.net/en_US/fbevents.js';

// Bump CONSENT_VERSION whenever the set of trackers or the banner copy changes
// materially; stored choices with an older version are ignored and the banner shows again.
export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'formiq-cookie-consent';

export const CONSENT_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
} as const;

export type ConsentStatus = (typeof CONSENT_STATUS)[keyof typeof CONSENT_STATUS];

export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';
export const CONSENT_CHANGED_EVENT = 'cookie-consent-changed';

export const PRIVACY_POLICY_PATH = '/privacy';
