import { describe, expect, it } from 'vitest';
import { isMonetagConfigured, parseMonetagConfig, shouldLoadAds } from '@/lib/ads/config';

const VALID_SRC = 'https://ads.example.net/400/1234567';

describe('parseMonetagConfig', () => {
  it('is off by default', () => {
    const config = parseMonetagConfig({});
    expect(config.enabled).toBe(false);
    expect(config.src).toBeNull();
    expect(isMonetagConfigured(config)).toBe(false);
  });

  it('only treats "true" as enabled', () => {
    expect(parseMonetagConfig({ enabled: 'true' }).enabled).toBe(true);
    expect(parseMonetagConfig({ enabled: ' TRUE ' }).enabled).toBe(true);
    expect(parseMonetagConfig({ enabled: '1' }).enabled).toBe(false);
    expect(parseMonetagConfig({ enabled: 'false' }).enabled).toBe(false);
  });

  it('accepts only https script URLs and derives the origin', () => {
    const config = parseMonetagConfig({ enabled: 'true', src: VALID_SRC });
    expect(config.src).toBe(VALID_SRC);
    expect(config.origin).toBe('https://ads.example.net');
    expect(parseMonetagConfig({ src: 'http://ads.example.net/tag.js' }).src).toBeNull();
    expect(parseMonetagConfig({ src: 'javascript:alert(1)' }).src).toBeNull();
    expect(parseMonetagConfig({ src: 'not a url' }).src).toBeNull();
    expect(parseMonetagConfig({ src: '' }).src).toBeNull();
  });

  it('validates the optional zone id and verification value', () => {
    expect(parseMonetagConfig({ zone: '9876543' }).zone).toBe('9876543');
    expect(parseMonetagConfig({ zone: '98a' }).zone).toBeNull();
    expect(parseMonetagConfig({ siteVerification: '  abc123 ' }).siteVerification).toBe('abc123');
    expect(parseMonetagConfig({ siteVerification: '   ' }).siteVerification).toBeNull();
  });
});

describe('shouldLoadAds', () => {
  const enabled = parseMonetagConfig({ enabled: 'true', src: VALID_SRC });

  it('loads only with flag, valid src, consent and an eligible path', () => {
    expect(shouldLoadAds({ config: enabled, advertisingConsent: true, pathEligible: true })).toBe(true);
    expect(shouldLoadAds({ config: enabled, advertisingConsent: false, pathEligible: true })).toBe(false);
    expect(shouldLoadAds({ config: enabled, advertisingConsent: true, pathEligible: false })).toBe(false);
  });

  it('stays off when the flag is off or the src is invalid', () => {
    expect(
      shouldLoadAds({ config: parseMonetagConfig({ src: VALID_SRC }), advertisingConsent: true, pathEligible: true })
    ).toBe(false);
    expect(
      shouldLoadAds({
        config: parseMonetagConfig({ enabled: 'true', src: 'http://insecure.example/tag.js' }),
        advertisingConsent: true,
        pathEligible: true,
      })
    ).toBe(false);
  });
});
