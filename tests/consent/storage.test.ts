import { afterEach, describe, expect, it } from 'vitest';
import {
  buildConsentCookie,
  createConsent,
  parseConsent,
  readConsentCookie,
  readStoredConsent,
  writeStoredConsent,
} from '@/lib/consent-storage';
import {
  CONSENT_COOKIE_MAX_AGE_SECONDS,
  CONSENT_COOKIE_NAME,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
} from '@/lib/tracking-config';

const NOW = new Date('2026-11-13T10:00:00.000Z');
const ONE_HUNDRED_EIGHTY_DAYS_IN_SECONDS = 180 * 24 * 60 * 60;

afterEach(() => {
  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/`;
  window.localStorage.clear();
});

describe('consent codec', () => {
  it('round-trips a versioned, timestamped choice', () => {
    const consent = createConsent({ measurement: false, advertising: true }, NOW);
    expect(consent).toEqual({
      version: CONSENT_VERSION,
      measurement: false,
      advertising: true,
      updatedAt: NOW.toISOString(),
    });
    expect(parseConsent(JSON.stringify(consent))).toEqual(consent);
  });

  it('rejects other versions', () => {
    const stale = { ...createConsent({ measurement: true, advertising: true }, NOW), version: CONSENT_VERSION - 1 };
    expect(parseConsent(JSON.stringify(stale))).toBeNull();
  });

  it.each([
    '{not json',
    '"granted"',
    'null',
    '{}',
    '{"version":2,"measurement":"yes","advertising":true,"updatedAt":"x"}',
  ])('rejects corrupt value %s', (raw) => {
    expect(parseConsent(raw)).toBeNull();
  });

  it('builds a Lax, 180-day, site-wide cookie and adds Secure on https', () => {
    const consent = createConsent({ measurement: true, advertising: false }, NOW);
    const cookie = buildConsentCookie(consent, true);
    expect(CONSENT_COOKIE_MAX_AGE_SECONDS).toBe(ONE_HUNDRED_EIGHTY_DAYS_IN_SECONDS);
    expect(cookie).toContain(`Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}`);
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('Secure');
    expect(buildConsentCookie(consent, false)).not.toContain('Secure');
  });

  it('reads the cookie among others and survives bad encoding', () => {
    expect(readConsentCookie(`a=1; ${CONSENT_COOKIE_NAME}=%7B%7D; b=2`)).toBe('{}');
    expect(readConsentCookie('a=1')).toBeNull();
    expect(readConsentCookie(`${CONSENT_COOKIE_NAME}=%E0%A4%A`)).toBeNull();
  });
});

describe('browser storage', () => {
  it('writes the cookie and the localStorage mirror', () => {
    const consent = createConsent({ measurement: false, advertising: true }, NOW);
    writeStoredConsent(consent);
    expect(readConsentCookie(document.cookie)).toBe(JSON.stringify(consent));
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe(JSON.stringify(consent));
    expect(readStoredConsent()).toEqual(consent);
  });

  it('falls back to localStorage when the cookie is missing', () => {
    const consent = createConsent({ measurement: true, advertising: null }, NOW);
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    expect(readStoredConsent()).toEqual(consent);
  });

  it('defaults to no consent when every copy is corrupt', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=garbage; Path=/`;
    window.localStorage.setItem(CONSENT_STORAGE_KEY, '{broken');
    expect(readStoredConsent()).toBeNull();
  });

  it('keeps working when localStorage throws', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    try {
      expect(() => writeStoredConsent(createConsent({ measurement: false, advertising: false }, NOW))).not.toThrow();
      expect(readStoredConsent()?.advertising).toBe(false);
    } finally {
      if (original) Object.defineProperty(window, 'localStorage', original);
    }
  });
});
