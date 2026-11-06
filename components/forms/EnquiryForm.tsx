'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { trackLead } from '@/lib/meta-pixel';
import { useCurrency } from '@/lib/use-currency';
import {
  EMAIL_PATTERN,
  ENQUIRY_NOTIFY_ENDPOINT,
  ENQUIRY_TABLE,
  MIN_NAME_LENGTH,
  PHONE_PLACEHOLDER,
  SERVICE_CHOICES,
  TIMELINE_CHOICES,
  budgetChoices,
} from '@/lib/enquiry-options';
import { BOOKING_LIMITS } from '@/lib/booking/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChipGroup, SelectField, TextAreaField, TextField } from './StudioField';
import BookingSlotPicker from './BookingSlotPicker';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const MESSAGE_ROWS = 3;
const PRIVACY_HREF = '/privacy';

interface EnquiryState {
  name: string;
  email: string;
  company: string;
  website: string;
  services: string[];
  budget: string;
  timeline: string;
  phone: string;
  message: string;
}

const INITIAL: EnquiryState = {
  name: '',
  email: '',
  company: '',
  website: '',
  services: [],
  budget: '',
  timeline: '',
  phone: '',
  message: '',
};

type Errors = Partial<Record<'name' | 'email' | 'services' | 'form', string>>;

interface SentEnquiry {
  name: string;
  email: string;
  /** Summary passed to the booked calendar event. */
  notes: string;
}

interface EnquiryFormProps {
  /** Prefix for element ids, so several forms can live on one page. */
  idPrefix: string;
  /** Where the enquiry came from (stored with the message, sent to analytics). */
  source: string;
  /** Called once the enquiry is stored. */
  onSubmitted?: () => void;
  /** Heading level for the success message. */
  successHeadingId?: string;
  /** 'sheet' fills the enquiry sheet's height: the message grows and the submit row sits at the bottom. */
  variant?: 'default' | 'sheet';
}

/** Studio project enquiry form. Stores into contact_messages; extra fields are folded into the message. */
export default function EnquiryForm({ idPrefix, source, onSubmitted, successHeadingId, variant = 'default' }: EnquiryFormProps) {
  const fill = variant === 'sheet';
  const [form, setForm] = useState<EnquiryState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<SentEnquiry | null>(null);
  const [currency] = useCurrency();
  const [showPhone, setShowPhone] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (showPhone) phoneRef.current?.focus(); }, [showPhone]);

  const budgets = useMemo(() => budgetChoices(currency), [currency]);
  const id = (field: string) => `${idPrefix}-${field}`;
  const set = <K extends keyof EnquiryState>(key: K, value: EnquiryState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < MIN_NAME_LENGTH) next.name = 'Please tell us your name.';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.services.length === 0) next.services = 'Pick at least one option.';
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (['name', 'email', 'services'] as const).find((k) => found[k]);
      const el = first === 'services'
        ? document.getElementById(`${id('services')}-0`)
        : first ? document.getElementById(id(first)) : null;
      el?.focus();
      return;
    }

    setSubmitting(true);
    const subject = form.services.join(', ');
    const budget = form.budget;
    const timeline = form.timeline;
    const phone = form.phone.trim();
    const details = [
      `Services: ${subject}`,
      form.company.trim() && `Company: ${form.company.trim()}`,
      form.website.trim() && `Website: ${form.website.trim()}`,
      budget && `Budget: ${budget} (${currency})`,
      timeline && `Timeline: ${timeline}`,
      phone && `Phone / WhatsApp: ${phone}`,
      `Source: ${source}`,
    ].filter(Boolean).join('\n');
    const note = form.message.trim();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: phone || null,
      subject,
      message: note ? `${details}\n\n${note}` : details,
    };

    try {
      const { error: dbError } = await supabase.from(ENQUIRY_TABLE).insert([payload]);
      if (dbError) {
        setErrors({ form: 'Sorry, that didn’t go through. Please try again or email us.' });
        return;
      }
      trackLead({ content_name: subject, budget, timeline, source, email: payload.email, phone: phone || undefined });
      if (phone) {
        fetch(ENQUIRY_NOTIFY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, name: payload.name, service: subject }),
        }).catch(() => {});
      }
      const callNotes = [
        `Services: ${subject}`,
        budget && `Budget: ${budget} (${currency})`,
        timeline && `Timeline: ${timeline}`,
        note,
      ].filter(Boolean).join('\n').slice(0, BOOKING_LIMITS.NOTES_MAX_LENGTH);
      setSent({ name: payload.name, email: payload.email, notes: callNotes });
      setForm(INITIAL);
      setShowPhone(false);
      onSubmitted?.();
    } catch {
      setErrors({ form: 'Something went wrong. Please try again or email us.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <BookingSlotPicker idPrefix={id('booking')} headingId={successHeadingId} name={sent.name} email={sent.email} notes={sent.notes} fill={fill} />
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className={cn('flex flex-col gap-5', fill && 'flex-1')}>
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <TextField id={id('name')} name="name" label="Name" required autoComplete="name" value={form.name}
          onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <TextField id={id('email')} name="email" type="email" label="Work email" required autoComplete="email" value={form.email}
          onChange={(e) => set('email', e.target.value)} error={errors.email} />
        <TextField id={id('company')} name="company" label="Company" optional autoComplete="organization" value={form.company}
          onChange={(e) => set('company', e.target.value)} />
        <TextField id={id('website')} name="website" type="url" inputMode="url" label="Website" optional placeholder="https://" value={form.website}
          onChange={(e) => set('website', e.target.value)} />
      </div>

      <ChipGroup name={id('services')} legend="What do you need?" hint="Pick all that apply." type="checkbox" required
        options={SERVICE_CHOICES} value={form.services} onChange={(v) => set('services', v)} error={errors.services} />

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <SelectField id={id('budget')} name="budget" label={`Budget (${currency})`} optional placeholder="Select a range"
          options={budgets} value={form.budget} onChange={(v) => set('budget', v)} />
        <SelectField id={id('timeline')} name="timeline" label="Timeline" optional placeholder="Select a timeline"
          options={TIMELINE_CHOICES} value={form.timeline} onChange={(v) => set('timeline', v)} />
      </div>

      {showPhone ? (
        <TextField ref={phoneRef} id={id('phone')} name="phone" type="tel" label="Phone / WhatsApp" optional autoComplete="tel" placeholder={PHONE_PLACEHOLDER}
          value={form.phone} onChange={(e) => set('phone', e.target.value)} />
      ) : (
        <button
          type="button"
          onClick={() => setShowPhone(true)}
          className={`-my-1 self-start inline-flex min-h-8 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm ${FOCUS_RING}`}
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add phone or WhatsApp (optional)
        </button>
      )}

      <TextAreaField id={id('message')} name="message" label="Anything we should know?" hideLabel optional grow={fill}
        placeholder="Anything we should know?" rows={MESSAGE_ROWS} value={form.message}
        onChange={(e) => set('message', e.target.value)} />

      {errors.form && <p role="alert" className="text-sm text-destructive">{errors.form}</p>}

      <div className={cn('flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between', fill && 'mt-auto')}>
        <p className="text-sm text-muted-foreground">
          We&apos;ll only use this to reply to you.{' '}
          <Link href={PRIVACY_HREF} className={`text-foreground rounded-sm ${FOCUS_RING}`}>
            <span className="link-draw">Privacy</span>
          </Link>
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          aria-busy={submitting}
          className={cn('btn-ink btn-ink-invert group/cta px-8', fill && 'lg:h-12')}
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" /> Sending…</>
          ) : (
            <>Send enquiry <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" /></>
          )}
        </Button>
      </div>
    </form>
  );
}
