'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { applyConsent, getStoredConsent, needsConsentPrompt, setConsent, type ConsentChoice } from '@/lib/consent';
import { CONSENT_COPY, DEFAULT_CONSENT_LOCALE } from '@/lib/consent-copy';
import { MONETAG_CONFIG, isMonetagConfigured } from '@/lib/ads/config';
import { OPEN_COOKIE_SETTINGS_EVENT, PRIVACY_POLICY_PATH } from '@/lib/tracking-config';

export { openCookieSettings } from '@/lib/consent';

const COPY = CONSENT_COPY[DEFAULT_CONSENT_LOCALE];

const ADVERTISING_OFFERED = isMonetagConfigured(MONETAG_CONFIG);

const BUTTON_CLASS =
  'rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const TEXT_LINK_CLASS =
  'text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-sm';

const offeredAdvertising = (value: boolean): ConsentChoice['advertising'] => (ADVERTISING_OFFERED ? value : null);

type PurposeRowProps = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  trailing?: string;
};

function PurposeRow({ id, title, description, checked, disabled, onChange, trailing }: PurposeRowProps) {
  return (
    <li className="flex items-start gap-3 border-t border-border py-3 first:border-t-0">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange?.(value === true)}
        aria-describedby={`${id}-description`}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {title}
        </label>
        <p id={`${id}-description`} className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {trailing && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{trailing}</span>
      )}
    </li>
  );
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [measurement, setMeasurement] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusOnOpenRef = useRef(false);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const bodyId = `${baseId}-body`;
  const panelId = `${baseId}-panel`;

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) applyConsent(stored);
    if (needsConsentPrompt(stored, ADVERTISING_OFFERED)) setOpen(true);

    const reopen = () => {
      const current = getStoredConsent();
      setMeasurement(current?.measurement === true);
      setAdvertising(current?.advertising === true);
      setManaging(true);
      focusOnOpenRef.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (!open || !focusOnOpenRef.current) return;
    focusOnOpenRef.current = false;
    dialogRef.current?.focus();
  }, [open]);

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setManaging(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      tabIndex={-1}
      className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-xl rounded border border-border bg-background p-4 text-foreground shadow-lg shadow-black/10 focus:outline-none md:bottom-5"
    >
      <p id={titleId} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="sr-only">{COPY.dialogLabel}: </span>
        {COPY.label}
      </p>
      <p id={bodyId} className="mt-1.5 text-sm leading-relaxed">
        {ADVERTISING_OFFERED ? COPY.bodyWithAds : COPY.body}
      </p>

      {managing && (
        <ul id={panelId} className="mt-3 rounded border border-border px-3">
          <PurposeRow
            id={`${baseId}-necessary`}
            title={COPY.necessaryTitle}
            description={COPY.necessaryDescription}
            checked
            disabled
            trailing={COPY.alwaysOn}
          />
          <PurposeRow
            id={`${baseId}-measurement`}
            title={COPY.measurementTitle}
            description={COPY.measurementDescription}
            checked={measurement}
            onChange={setMeasurement}
          />
          {ADVERTISING_OFFERED && (
            <PurposeRow
              id={`${baseId}-advertising`}
              title={COPY.advertisingTitle}
              description={COPY.advertisingDescription}
              checked={advertising}
              onChange={setAdvertising}
            />
          )}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={BUTTON_CLASS}
          onClick={() => choose({ measurement: false, advertising: offeredAdvertising(false) })}
        >
          {COPY.necessaryOnly}
        </button>
        <button
          type="button"
          className={BUTTON_CLASS}
          onClick={() => choose({ measurement: true, advertising: offeredAdvertising(true) })}
        >
          {COPY.acceptAdvertising}
        </button>
        {managing && (
          <button
            type="button"
            className={BUTTON_CLASS}
            onClick={() => choose({ measurement, advertising: offeredAdvertising(advertising) })}
          >
            {COPY.save}
          </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className={TEXT_LINK_CLASS}
            aria-expanded={managing}
            aria-controls={managing ? panelId : undefined}
            onClick={() => setManaging((value) => !value)}
          >
            {managing ? COPY.hideManage : COPY.manage}
          </button>
          <Link href={PRIVACY_POLICY_PATH} className={TEXT_LINK_CLASS}>
            {COPY.privacy}
          </Link>
        </div>
      </div>
    </div>
  );
}
