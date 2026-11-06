'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredConsent, loadMetaPixel, setConsent } from '@/lib/consent';
import {
  CONSENT_STATUS,
  OPEN_COOKIE_SETTINGS_EVENT,
  PRIVACY_POLICY_PATH,
  type ConsentStatus,
} from '@/lib/tracking-config';

export { openCookieSettings } from '@/lib/consent';

const COPY = {
  label: 'Cookies',
  body: 'We use cookies to measure our ads and improve the site. Nothing loads until you say so.',
  accept: 'Accept',
  decline: 'Decline',
  privacy: 'Privacy',
} as const;

const BUTTON_CLASS =
  'rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === CONSENT_STATUS.GRANTED) {
      loadMetaPixel();
    } else if (stored === null) {
      setOpen(true);
    }

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (status: ConsentStatus) => {
    setConsent(status);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-xl rounded border border-border bg-background p-4 text-foreground shadow-lg shadow-black/10 md:bottom-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{COPY.label}</p>
      <p className="mt-1.5 text-sm leading-relaxed">{COPY.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={BUTTON_CLASS} onClick={() => choose(CONSENT_STATUS.GRANTED)}>
          {COPY.accept}
        </button>
        <button type="button" className={BUTTON_CLASS} onClick={() => choose(CONSENT_STATUS.DENIED)}>
          {COPY.decline}
        </button>
        <Link
          href={PRIVACY_POLICY_PATH}
          className="ml-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {COPY.privacy}
        </Link>
      </div>
    </div>
  );
}
