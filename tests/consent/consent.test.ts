import { afterEach, describe, expect, it } from 'vitest';
import { createConsent } from '@/lib/consent-storage';
import { hasAdvertisingConsent, needsConsentPrompt, setConsent } from '@/lib/consent';
import { CONSENT_CHANGED_EVENT, CONSENT_COOKIE_NAME } from '@/lib/tracking-config';

afterEach(() => {
  document.cookie = `${CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/`;
  window.localStorage.clear();
});

describe('needsConsentPrompt', () => {
  it('prompts every visitor until they choose', () => {
    expect(needsConsentPrompt(null, false)).toBe(true);
    expect(needsConsentPrompt(null, true)).toBe(true);
  });

  it('re-prompts when advertising is offered but was never asked', () => {
    const consent = createConsent({ measurement: true, advertising: null });
    expect(needsConsentPrompt(consent, false)).toBe(false);
    expect(needsConsentPrompt(consent, true)).toBe(true);
  });

  it('does not re-prompt after an advertising decision', () => {
    expect(needsConsentPrompt(createConsent({ measurement: false, advertising: false }), true)).toBe(false);
  });
});

describe('setConsent', () => {
  it('denies advertising by default and persists a grant with an event', () => {
    expect(hasAdvertisingConsent()).toBe(false);
    const events: Event[] = [];
    const listener = (event: Event) => events.push(event);
    window.addEventListener(CONSENT_CHANGED_EVENT, listener);
    setConsent({ measurement: false, advertising: true });
    window.removeEventListener(CONSENT_CHANGED_EVENT, listener);
    expect(hasAdvertisingConsent()).toBe(true);
    expect(events).toHaveLength(1);
  });
});
