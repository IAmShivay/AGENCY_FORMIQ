import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { emailService } from '@/lib/emailService';
import { clientIp, takeToken } from '@/lib/booking/rate-limit';
import { HTTP_STATUS } from '@/lib/booking/constants';
import { escapeHtml } from '@/lib/booking/event';
import { ENQUIRY_EMAIL } from '@/lib/enquiry-options';
import { APPLICATION_LIMITS, CAREERS_TABLES, OPEN_APPLICATION } from '@/lib/careers';

export const dynamic = 'force-dynamic';

const HONEYPOT_FIELD = 'company_website';
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const URL_PATTERN = /^https?:\/\/\S+$/i;
const RECIPIENTS = (process.env.CAREERS_NOTIFY_EMAIL || ENQUIRY_EMAIL).split(',').map((e) => e.trim()).filter(Boolean);

const MESSAGES = {
  RATE_LIMITED: 'Too many attempts. Please try again in a few minutes.',
  INVALID: 'Please check the highlighted fields.',
  FAILED: 'Sorry, that didn’t go through. Please try again or email us.',
} as const;

type Body = Record<string, unknown>;

const str = (body: Body, key: string, max: number) => {
  const value = typeof body[key] === 'string' ? (body[key] as string).trim() : '';
  return value.slice(0, max);
};

export async function POST(req: NextRequest) {
  if (!takeToken(clientIp(req.headers))) return NextResponse.json({ error: MESSAGES.RATE_LIMITED }, { status: HTTP_STATUS.TOO_MANY_REQUESTS });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: MESSAGES.INVALID }, { status: HTTP_STATUS.BAD_REQUEST });
  }

  if (str(body, HONEYPOT_FIELD, APPLICATION_LIMITS.url)) return NextResponse.json({ ok: true }, { status: HTTP_STATUS.CREATED });

  const application = {
    opening_id: str(body, 'opening_id', 64) || null,
    role_title: str(body, 'role_title', APPLICATION_LIMITS.name) || OPEN_APPLICATION,
    name: str(body, 'name', APPLICATION_LIMITS.name),
    email: str(body, 'email', APPLICATION_LIMITS.email),
    phone: str(body, 'phone', APPLICATION_LIMITS.phone) || null,
    location: str(body, 'location', APPLICATION_LIMITS.location) || null,
    portfolio_url: str(body, 'portfolio_url', APPLICATION_LIMITS.url) || null,
    linkedin_url: str(body, 'linkedin_url', APPLICATION_LIMITS.url) || null,
    cv_url: str(body, 'cv_url', APPLICATION_LIMITS.url) || null,
    message: str(body, 'message', APPLICATION_LIMITS.message) || null,
    consent: body.consent === true,
    status: 'new' as const,
  };

  const fieldErrors: Record<string, string> = {};
  if (application.name.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(application.email)) fieldErrors.email = 'Please enter a valid email.';
  if (!application.portfolio_url && !application.cv_url && !application.linkedin_url) fieldErrors.portfolio_url = 'Add a link to your work, CV or LinkedIn.';
  (['portfolio_url', 'linkedin_url', 'cv_url'] as const).forEach((k) => {
    if (application[k] && !URL_PATTERN.test(application[k]!)) fieldErrors[k] = 'Links need to start with https://';
  });
  if (!application.consent) fieldErrors.consent = 'Please agree so we can review your application.';
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: MESSAGES.INVALID, fieldErrors }, { status: HTTP_STATUS.BAD_REQUEST });

  const { error } = await supabase.from(CAREERS_TABLES.applications).insert([application]);
  if (error) return NextResponse.json({ error: MESSAGES.FAILED }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });

  const rows = [
    ['Role', application.role_title],
    ['Name', application.name],
    ['Email', application.email],
    ['Phone', application.phone],
    ['Location', application.location],
    ['Portfolio', application.portfolio_url],
    ['LinkedIn', application.linkedin_url],
    ['CV', application.cv_url],
  ].filter(([, v]) => v) as [string, string][];
  const html = `<h2>New application: ${escapeHtml(application.role_title)}</h2>
<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}</table>
${application.message ? `<p style="white-space:pre-wrap">${escapeHtml(application.message)}</p>` : ''}`;
  await Promise.allSettled(RECIPIENTS.map((to) => emailService.sendEmail({ to, subject: `New application · ${application.role_title} · ${application.name}`, html })));

  return NextResponse.json({ ok: true }, { status: HTTP_STATUS.CREATED });
}
