'use client';

import { useCallback, useEffect, useState } from 'react';
import { getStoredConsent, openCookieSettings, setConsent, type ConsentChoice, type StoredConsent } from '@/lib/consent';
import { CONSENT_CHANGED_EVENT } from '@/lib/tracking-config';

const STORAGE_EVENT = 'storage';

export type UseConsentResult = {
  consent: StoredConsent | null;
  ready: boolean;
  measurement: boolean;
  advertising: boolean;
  update: (choice: ConsentChoice) => void;
  openSettings: () => void;
};

export function useConsent(): UseConsentResult {
  const [consent, setConsentState] = useState<StoredConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setConsentState(getStoredConsent());
    sync();
    setReady(true);
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    window.addEventListener(STORAGE_EVENT, sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
      window.removeEventListener(STORAGE_EVENT, sync);
    };
  }, []);

  const update = useCallback((choice: ConsentChoice) => setConsent(choice), []);

  return {
    consent,
    ready,
    measurement: consent?.measurement === true,
    advertising: consent?.advertising === true,
    update,
    openSettings: openCookieSettings,
  };
}
