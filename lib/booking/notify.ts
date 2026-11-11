import { sendEmail } from '@/lib/email/index';
import { BOOKING_NOTIFY } from './constants';
import { escapeHtml, formatStudioTime, safeFormatTime } from './event';

export interface BookingNotification {
  name: string;
  email: string;
  start: Date;
  timezone?: string;
  notes?: string;
  meetLink: string | null;
  calendarLink: string | null;
}

const link = (href: string, label = href) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

/** Google only emails guests, so the studio gets its own heads-up. Never throws. */
export async function notifyStudioOfBooking(booking: BookingNotification) {
  if (!BOOKING_NOTIFY.RECIPIENTS.length) return;

  const studioTime = formatStudioTime(booking.start);
  const localTime = booking.timezone ? safeFormatTime(booking.start, booking.timezone) : null;
  const inviteeTime = localTime && localTime !== studioTime ? localTime : null;

  const rows: [string, string, string][] = [
    [BOOKING_NOTIFY.LABEL_NAME, booking.name, escapeHtml(booking.name)],
    [BOOKING_NOTIFY.LABEL_EMAIL, booking.email, link(`mailto:${booking.email}`, booking.email)],
    [BOOKING_NOTIFY.LABEL_STUDIO_TIME, studioTime, escapeHtml(studioTime)],
    ...(inviteeTime ? [[BOOKING_NOTIFY.LABEL_INVITEE_TIME, inviteeTime, escapeHtml(inviteeTime)] as [string, string, string]] : []),
    ...(booking.meetLink ? [[BOOKING_NOTIFY.LABEL_MEET, booking.meetLink, link(booking.meetLink)] as [string, string, string]] : []),
    ...(booking.calendarLink ? [[BOOKING_NOTIFY.LABEL_CALENDAR, booking.calendarLink, link(booking.calendarLink)] as [string, string, string]] : []),
  ];

  const text = [
    BOOKING_NOTIFY.HEADING,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(booking.notes ? ['', `${BOOKING_NOTIFY.LABEL_NOTES}:`, booking.notes] : []),
    '',
    BOOKING_NOTIFY.FOOTER,
  ].join('\n');

  const html = [
    `<p><b>${BOOKING_NOTIFY.HEADING}</b></p>`,
    `<table cellpadding="4">${rows.map(([label, , value]) => `<tr><td><b>${label}</b></td><td>${value}</td></tr>`).join('')}</table>`,
    booking.notes ? `<p><b>${BOOKING_NOTIFY.LABEL_NOTES}</b><br>${escapeHtml(booking.notes).replace(/\r?\n/g, '<br>')}</p>` : '',
    `<p>${BOOKING_NOTIFY.FOOTER}</p>`,
  ].join('');

  try {
    const result = await sendEmail({
      to: BOOKING_NOTIFY.RECIPIENTS.join(', '),
      subject: BOOKING_NOTIFY.SUBJECT(booking.name, studioTime),
      text,
      html,
      replyTo: booking.email,
    });
    if (!result.success) console.error('[booking] studio notification failed', result.error);
  } catch (error) {
    console.error('[booking] studio notification failed', error);
  }
}
