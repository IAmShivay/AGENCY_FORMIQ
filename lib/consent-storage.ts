import { z } from 'zod';
import {
  CONSENT_COOKIE_MAX_AGE_SECONDS,
  CONSENT_COOKIE_NAME,
  CONSENT_COOKIE_PATH,
  CONSENT_COOKIE_SAME_SITE,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  SECURE_PROTOCOL,
} from '@/lib/tracking-config';

const storedConsentSchema = z.object({
  version: z.literal(CONSENT_VERSION),
  measurement: z.boolean(),
  advertising: z.boolean().nullable(),
  updatedAt: z.string().datetime(),
});

export type StoredConsent = z.infer<typeof storedConsentSchema>;

export type ConsentChoice = Pick<StoredConsent, 'measurement' | 'advertising'>;

const COOKIE_SEPARATOR = ';';
const COOKIE_KEY_VALUE_SEPARATOR = '=';

export const createConsent = (choice: ConsentChoice, now: Date = new Date()): StoredConsent => ({
  version: CONSENT_VERSION,
  measurement: choice.measurement,
  advertising: choice.advertising,
  updatedAt: now.toISOString(),
});

export const parseConsent = (raw: string | null | undefined): StoredConsent | null => {
  if (!raw) return null;
  try {
    const result = storedConsentSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const readConsentCookie = (cookieHeader: string): string | null => {
  const prefix = `${CONSENT_COOKIE_NAME}${COOKIE_KEY_VALUE_SEPARATOR}`;
  const entry = cookieHeader
    .split(COOKIE_SEPARATOR)
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(prefix.length));
  } catch {
    return null;
  }
};

export const buildConsentCookie = (consent: StoredConsent, secure: boolean): string => {
  const attributes = [
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}`,
    `Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}`,
    `Path=${CONSENT_COOKIE_PATH}`,
    `SameSite=${CONSENT_COOKIE_SAME_SITE}`,
  ];
  if (secure) attributes.push('Secure');
  return attributes.join('; ');
};

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const readCookieConsent = (): StoredConsent | null => {
  try {
    return parseConsent(readConsentCookie(document.cookie));
  } catch {
    return null;
  }
};

const readLocalConsent = (): StoredConsent | null => {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const readStoredConsent = (): StoredConsent | null => {
  if (!isBrowser()) return null;
  return readCookieConsent() ?? readLocalConsent();
};

export const writeStoredConsent = (consent: StoredConsent): void => {
  if (!isBrowser()) return;
  try {
    document.cookie = buildConsentCookie(consent, window.location.protocol === SECURE_PROTOCOL);
  } catch {
  }
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
  }
};
