'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BOOKING_URL } from '@/lib/pricing';
import { ENQUIRY_REPLY_PROMISE } from '@/lib/enquiry-options';
import {
  BOOKING_ENDPOINTS,
  BOOKING_LIMITS,
  BOOKING_MESSAGES,
  BOOKING_SCHEDULE,
  HTTP_STATUS,
} from '@/lib/booking/constants';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const EYEBROW = 'font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground';
const LEGEND = 'mb-3 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-muted-foreground';
const HEADING = 'font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] leading-tight focus:outline-none';
const CHIP = 'inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border px-4 text-sm font-medium tabular-nums transition-colors duration-300 select-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background';
const CHIP_ON = 'bg-foreground text-background border-foreground';
const CHIP_OFF = 'border-foreground/20 text-foreground hover:border-foreground/50';

/** en-CA formats as YYYY-MM-DD, a stable per-day key in the visitor's zone. */
const DAY_KEY_LOCALE = 'en-CA';
const SKELETON_DAYS = 5;
const SKELETON_TIMES = 10;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

const COPY = {
  PICK_HEADING: `Pick a time for a ${BOOKING_SCHEDULE.SLOT_MINUTES}-minute call.`,
  PICK_INTRO: (name: string) => `Thanks, ${name}, enquiry received. Grab a slot now, or skip it and we'll reply ${ENQUIRY_REPLY_PROMISE}.`,
  RECEIVED: (name: string) => `Thanks, ${name}. Enquiry received`,
  THANKS: (name: string) => `Thanks, ${name}.`,
  REPLY: `We'll reply ${ENQUIRY_REPLY_PROMISE}.`,
  LOADING: 'Loading available times…',
  DAY: 'Day',
  TIME: 'Time',
  TIMEZONE: (label: string) => `Times in ${label}`,
  BOOK: 'Book call',
  BOOKING: 'Booking…',
  SKIP: 'Skip for now',
  BOOKING_AS: (name: string, email: string) => `Invite goes to ${name} · ${email}`,
  BOOKED_HEADING: 'See you on the call.',
  BOOKED: (when: string, email: string) =>
    `You're booked for ${when}. A Google Calendar invite with the Meet link is on its way to ${email}.`,
  MEET: 'Join Google Meet',
  FALLBACK_CTA: 'Book a call',
} as const;

type Phase =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'unavailable' }
  | { kind: 'skipped' }
  | { kind: 'booked'; start: string; meetLink: string | null };

interface BookingSlotPickerProps {
  idPrefix: string;
  headingId?: string;
  name: string;
  email: string;
  notes: string;
  /** Fill a flex column (the enquiry sheet): the confirm row sits at the bottom. */
  fill?: boolean;
}

const visitorTimeZone = () => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return zone || BOOKING_SCHEDULE.TIMEZONE;
};

const timeZoneLabel = (timeZone: string) =>
  new Intl.DateTimeFormat(undefined, { timeZone, timeZoneName: 'long' })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName')?.value ?? timeZone;

/** Discovery-call slot picker shown after the enquiry is sent. Falls back to the booking link when Calendar is unavailable. */
export default function BookingSlotPicker({ idPrefix, headingId, name, email, notes, fill }: BookingSlotPickerProps) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const [slots, setSlots] = useState<string[]>([]);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [timeZone] = useState(visitorTimeZone);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const activeRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(BOOKING_ENDPOINTS.SLOTS, { cache: 'no-store' });
      const json = await res.json().catch(() => null);
      const list: string[] = res.ok && Array.isArray(json?.data?.slots) ? json.data.slots : [];
      if (!activeRef.current) return;
      if (list.length === 0) {
        setPhase({ kind: 'unavailable' });
        return;
      }
      setSlots(list);
      setPhase({ kind: 'ready' });
    } catch {
      if (activeRef.current) setPhase({ kind: 'unavailable' });
    }
  }, []);

  useEffect(() => {
    activeRef.current = true;
    load();
    return () => {
      activeRef.current = false;
    };
  }, [load]);

  // Move focus to the new step (the enquiry form it replaced is gone), and again when the outcome changes.
  useEffect(() => {
    if (phase.kind !== 'ready') headingRef.current?.focus();
  }, [phase.kind]);

  const formats = useMemo(() => ({
    key: new Intl.DateTimeFormat(DAY_KEY_LOCALE, { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }),
    day: new Intl.DateTimeFormat(undefined, { timeZone, weekday: 'short', day: 'numeric', month: 'short' }),
    time: new Intl.DateTimeFormat(undefined, { timeZone, hour: 'numeric', minute: '2-digit' }),
    full: new Intl.DateTimeFormat(undefined, {
      timeZone, weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    }),
  }), [timeZone]);

  const days = useMemo(() => {
    const byDay = new Map<string, string[]>();
    slots.forEach((slot) => {
      const key = formats.key.format(new Date(slot));
      const list = byDay.get(key);
      if (list) list.push(slot);
      else byDay.set(key, [slot]);
    });
    return Array.from(byDay, ([key, starts]) => ({ key, starts, label: formats.day.format(new Date(starts[0])) }));
  }, [slots, formats]);

  const activeDay = days.find((d) => d.key === dayKey) ?? days[0];

  const book = async (e: FormEvent) => {
    e.preventDefault();
    if (!start || submitting) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch(BOOKING_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({
          name: name.slice(0, BOOKING_LIMITS.NAME_MAX_LENGTH),
          email,
          start,
          timezone: BOOKING_LIMITS.TIMEZONE_PATTERN.test(timeZone) ? timeZone : undefined,
          notes: notes || undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        setPhase({ kind: 'booked', start: json?.data?.start ?? start, meetLink: json?.data?.meetLink ?? null });
        return;
      }
      if (res.status === HTTP_STATUS.CONFLICT) {
        setStart(null);
        setNotice(BOOKING_MESSAGES.SLOT_TAKEN);
        await load();
        return;
      }
      if (res.status === HTTP_STATUS.SERVICE_UNAVAILABLE) {
        setPhase({ kind: 'unavailable' });
        return;
      }
      const clientError = res.status === HTTP_STATUS.BAD_REQUEST || res.status === HTTP_STATUS.TOO_MANY_REQUESTS;
      setNotice(clientError && typeof json?.message === 'string' ? json.message : BOOKING_MESSAGES.FAILED);
    } catch {
      setPhase({ kind: 'unavailable' });
    } finally {
      if (activeRef.current) setSubmitting(false);
    }
  };

  if (phase.kind === 'booked') {
    return (
      <div role="status" className="py-2">
        <p className={EYEBROW}>{COPY.RECEIVED(name)}</p>
        <h3 ref={headingRef} tabIndex={-1} id={headingId} className={`mt-3 ${HEADING}`}>{COPY.BOOKED_HEADING}</h3>
        <p className="mt-3 max-w-xl text-base sm:text-lg text-muted-foreground">
          {COPY.BOOKED(formats.full.format(new Date(phase.start)), email)}
        </p>
        {phase.meetLink && (
          <a
            href={phase.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold rounded-sm ${FOCUS_RING}`}
          >
            <span className="link-draw">{COPY.MEET}</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        )}
      </div>
    );
  }

  if (phase.kind === 'unavailable' || phase.kind === 'skipped') {
    return (
      <div role="status" className="py-2">
        <h3 ref={headingRef} tabIndex={-1} id={headingId} className={HEADING}>{COPY.THANKS(name)}</h3>
        <p className="mt-3 text-base sm:text-lg text-muted-foreground">{COPY.REPLY}</p>
        {phase.kind === 'unavailable' && (
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold rounded-sm ${FOCUS_RING}`}
          >
            <span className="link-draw">{COPY.FALLBACK_CTA}</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        )}
      </div>
    );
  }

  const loading = phase.kind === 'loading';
  const dayName = `${idPrefix}-day`;
  const timeName = `${idPrefix}-time`;

  return (
    <form noValidate onSubmit={book} aria-busy={loading} className={cn('flex flex-col gap-6', fill && 'flex-1')}>
      <div>
        <h3 ref={headingRef} tabIndex={-1} id={headingId} className={cn(HEADING, fill && 'lg:text-3xl')}>{COPY.PICK_HEADING}</h3>
        <p className="mt-2 text-base text-muted-foreground">{COPY.PICK_INTRO(name)}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground" title={timeZone}>
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          {COPY.TIMEZONE(timeZoneLabel(timeZone))}
        </p>
      </div>

      {loading ? (
        <div aria-hidden="true" className="space-y-5">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: SKELETON_DAYS }, (_, i) => (
              <span key={i} className="h-11 w-28 shrink-0 rounded-full bg-muted motion-safe:animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: SKELETON_TIMES }, (_, i) => (
              <span key={i} className="h-11 rounded-full bg-muted motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <fieldset>
            <legend className={LEGEND}>{COPY.DAY}</legend>
            <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 py-1 [scrollbar-width:thin]">
              {days.map((day, i) => {
                const checked = day.key === activeDay?.key;
                const inputId = `${dayName}-${i}`;
                return (
                  <label key={day.key} htmlFor={inputId} className="relative shrink-0 cursor-pointer">
                    <input
                      id={inputId}
                      type="radio"
                      name={dayName}
                      value={day.key}
                      checked={checked}
                      onChange={() => {
                        setDayKey(day.key);
                        setStart(null);
                      }}
                      className="peer sr-only"
                    />
                    <span className={`${CHIP} ${checked ? CHIP_ON : CHIP_OFF}`}>{day.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className={LEGEND}>{COPY.TIME}</legend>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {activeDay?.starts.map((slot, i) => {
                const checked = slot === start;
                const inputId = `${timeName}-${i}`;
                return (
                  <label key={slot} htmlFor={inputId} className="relative cursor-pointer">
                    <input
                      id={inputId}
                      type="radio"
                      name={timeName}
                      value={slot}
                      checked={checked}
                      onChange={() => setStart(slot)}
                      className="peer sr-only"
                    />
                    <span className={`${CHIP} w-full ${checked ? CHIP_ON : CHIP_OFF}`}>{formats.time.format(new Date(slot))}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </>
      )}

      <div className={cn('flex flex-col gap-4 border-t border-border pt-6 sm:flex-row-reverse sm:items-center sm:justify-between', fill && 'mt-auto')}>
        <Button
          type="submit"
          size="lg"
          disabled={!start || submitting || loading}
          aria-busy={submitting}
          className={cn('btn-ink btn-ink-invert group/cta px-8', fill && 'lg:h-12')}
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" /> {COPY.BOOKING}</>
          ) : (
            <>{COPY.BOOK} <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" /></>
          )}
        </Button>
        <div className="flex flex-col">
          <p aria-live="polite" className="text-sm font-medium text-destructive">
            {loading ? <span className="sr-only">{COPY.LOADING}</span> : notice}
          </p>
          <p className="text-sm text-muted-foreground">
            {COPY.BOOKING_AS(name, email)}
            <span aria-hidden="true"> · </span>
            <button
              type="button"
              onClick={() => setPhase({ kind: 'skipped' })}
              className={`inline-flex min-h-6 items-center font-semibold text-foreground rounded-sm ${FOCUS_RING}`}
            >
              <span className="link-draw">{COPY.SKIP}</span>
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
