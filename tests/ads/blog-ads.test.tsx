import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BlogAds from '@/app/(routes)/blog/components/BlogAds';
import { AD_FALLBACK_DELAY_MS, AD_IDLE_TIMEOUT_MS, MONETAG_SCRIPT_ELEMENT_ID } from '@/lib/ads/config';
import { setConsent } from '@/lib/consent';
import { CONSENT_COOKIE_NAME } from '@/lib/tracking-config';

const TEST_SRC = 'https://ads.example.net/400/1234567';
const ARTICLE_PATH = '/blog/shopify-cod-app-guide';
const SETTLE_MS = Math.max(AD_FALLBACK_DELAY_MS, AD_IDLE_TIMEOUT_MS) + 1;

const navigation = vi.hoisted(() => ({ pathname: '/blog/shopify-cod-app-guide' }));

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }));

vi.mock('@/lib/ads/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ads/config')>();
  return {
    ...actual,
    MONETAG_CONFIG: actual.parseMonetagConfig({ enabled: 'true', src: 'https://ads.example.net/400/1234567' }),
  };
});

const adScripts = () => document.querySelectorAll(`script#${MONETAG_SCRIPT_ELEMENT_ID}`);

const settle = () =>
  act(() => {
    vi.advanceTimersByTime(SETTLE_MS);
  });

beforeEach(() => {
  vi.useFakeTimers();
  navigation.pathname = ARTICLE_PATH;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/`;
  window.localStorage.clear();
});

describe('BlogAds', () => {
  it('injects nothing without consent', () => {
    render(<BlogAds />);
    settle();
    expect(adScripts()).toHaveLength(0);
  });

  it('injects the script exactly once under repeated renders', () => {
    setConsent({ measurement: false, advertising: true });
    const { rerender } = render(<BlogAds />);
    rerender(<BlogAds />);
    settle();
    rerender(<BlogAds />);
    rerender(<BlogAds />);
    settle();

    const scripts = adScripts();
    expect(scripts).toHaveLength(1);
    expect((scripts[0] as HTMLScriptElement).src).toBe(TEST_SRC);
    expect((scripts[0] as HTMLScriptElement).async).toBe(true);
  });

  it('waits until the page is idle before injecting', () => {
    setConsent({ measurement: false, advertising: true });
    render(<BlogAds />);
    expect(adScripts()).toHaveLength(0);
    settle();
    expect(adScripts()).toHaveLength(1);
  });

  it('removes the script element on unmount', () => {
    setConsent({ measurement: false, advertising: true });
    const { unmount } = render(<BlogAds />);
    settle();
    expect(adScripts()).toHaveLength(1);
    unmount();
    expect(adScripts()).toHaveLength(0);
  });

  it('removes the script when consent is withdrawn', () => {
    setConsent({ measurement: false, advertising: true });
    render(<BlogAds />);
    settle();
    act(() => setConsent({ measurement: false, advertising: false }));
    expect(adScripts()).toHaveLength(0);
  });

  it.each(['/', '/admin/blog', '/contact', '/services/web', '/blog', '/blog/category/shopify'])(
    'never injects on %s even when mounted there',
    (path) => {
      navigation.pathname = path;
      setConsent({ measurement: false, advertising: true });
      render(<BlogAds />);
      settle();
      expect(adScripts()).toHaveLength(0);
    }
  );
});
