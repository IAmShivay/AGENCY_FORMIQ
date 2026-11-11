'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { TextAreaField, TextField, SelectField } from '@/components/forms/StudioField';
import { Checkbox } from '@/components/ui/checkbox';
import { BTN_EMBER, FOCUS_RING } from '@/components/studio/ui';
import { APPLICATION_LIMITS, APPLICATION_RETENTION_MONTHS, CAREERS_APPLY_ENDPOINT, OPEN_APPLICATION, TEAMS } from '@/lib/careers';

const PRIVACY_HREF = '/privacy';
const HONEYPOT_FIELD = 'company_website';
const MESSAGE_ROWS = 5;

interface ApplyFormProps {
  openingId?: string;
  roleTitle?: string;
}

const EMPTY = { name: '', email: '', phone: '', location: '', portfolio_url: '', linkedin_url: '', cv_url: '', message: '', team: '' };
type Fields = typeof EMPTY;

export default function ApplyForm({ openingId, roleTitle }: ApplyFormProps) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [form, setForm] = useState<Fields>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const role = roleTitle ?? (form.team ? `${OPEN_APPLICATION} · ${form.team}` : OPEN_APPLICATION);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch(CAREERS_APPLY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, opening_id: openingId, role_title: role, consent, [HONEYPOT_FIELD]: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ ...(data.fieldErrors ?? {}), form: data.error ?? 'Something went wrong. Please try again.' });
        return;
      }
      setSent(true);
      setForm(EMPTY);
      setConsent(false);
    } catch {
      setErrors({ form: 'Something went wrong. Please try again or email us.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div role="status" className="rounded-[22px] border border-border p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-5 w-5" aria-hidden="true" /></span>
        <h3 className="mt-6 font-display text-3xl font-bold tracking-[-0.04em]">Thanks, it&apos;s with us.</h3>
        <p className="mt-3 text-muted-foreground max-w-md">We read every application and reply within two weeks, whatever the answer.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {!roleTitle && (
        <SelectField id={id('team')} name="team" label="Which area?" optional options={TEAMS} value={form.team} onChange={(team) => setForm((f) => ({ ...f, team }))} placeholder="Choose a team" />
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id={id('name')} label="Full name" required autoComplete="name" maxLength={APPLICATION_LIMITS.name} value={form.name} onChange={set('name')} error={errors.name} />
        <TextField id={id('email')} label="Email" type="email" required autoComplete="email" maxLength={APPLICATION_LIMITS.email} value={form.email} onChange={set('email')} error={errors.email} />
        <TextField id={id('phone')} label="Phone / WhatsApp" optional type="tel" autoComplete="tel" maxLength={APPLICATION_LIMITS.phone} value={form.phone} onChange={set('phone')} />
        <TextField id={id('location')} label="Where are you based?" optional autoComplete="address-level2" maxLength={APPLICATION_LIMITS.location} value={form.location} onChange={set('location')} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <TextField id={id('portfolio')} label="Portfolio or GitHub" type="url" inputMode="url" placeholder="https://" maxLength={APPLICATION_LIMITS.url} value={form.portfolio_url} onChange={set('portfolio_url')} error={errors.portfolio_url} />
        <TextField id={id('cv')} label="CV link" optional type="url" inputMode="url" placeholder="Drive, Dropbox…" maxLength={APPLICATION_LIMITS.url} value={form.cv_url} onChange={set('cv_url')} error={errors.cv_url} />
        <TextField id={id('linkedin')} label="LinkedIn" optional type="url" inputMode="url" placeholder="https://linkedin.com/in/…" maxLength={APPLICATION_LIMITS.url} value={form.linkedin_url} onChange={set('linkedin_url')} error={errors.linkedin_url} />
      </div>
      <TextAreaField id={id('message')} label="Tell us about a project you're proud of" optional rows={MESSAGE_ROWS} maxLength={APPLICATION_LIMITS.message} value={form.message} onChange={set('message')} />

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id(HONEYPOT_FIELD)}>Leave this empty</label>
        <input id={id(HONEYPOT_FIELD)} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <Checkbox id={id('consent')} checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-invalid={errors.consent ? true : undefined} className="mt-0.5" />
          <label htmlFor={id('consent')} className="text-sm text-muted-foreground leading-relaxed">
            I agree that Formiq can keep my application for {APPLICATION_RETENTION_MONTHS} months to consider me for this and future roles, as described in the{' '}
            <Link href={PRIVACY_HREF} className={`text-foreground underline underline-offset-2 rounded-sm ${FOCUS_RING}`}>privacy policy</Link>.
          </label>
        </div>
        {errors.consent && <p className="mt-2 text-sm text-destructive">{errors.consent}</p>}
      </div>

      {errors.form && <p role="alert" className="text-sm text-destructive">{errors.form}</p>}

      <button type="submit" disabled={submitting} className={BTN_EMBER}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {submitting ? 'Sending…' : 'Send application'}
        {!submitting && <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />}
      </button>
    </form>
  );
}
