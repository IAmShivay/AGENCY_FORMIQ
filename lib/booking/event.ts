import { BOOKING_EVENT, BOOKING_SCHEDULE } from './constants';

export interface BookingEventDetails {
  name: string;
  email: string;
  start: Date;
  timezone?: string;
  notes?: string;
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const formatTime = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat(BOOKING_EVENT.DATE_LOCALE, {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'long',
  }).format(date);

export const safeFormatTime = (date: Date, timeZone: string) => {
  try {
    return formatTime(date, timeZone);
  } catch {
    return null;
  }
};

export const formatStudioTime = (date: Date) => formatTime(date, BOOKING_SCHEDULE.TIMEZONE);

const section = (heading: string, lines: string[]) =>
  `<b>${heading}</b><ul>${lines.map((line) => `<li>${line}</li>`).join('')}</ul>`;

export const buildEventSummary = (name: string) => BOOKING_EVENT.SUMMARY(name);

export function buildEventDescription(details: BookingEventDetails): string {
  const studioTime = formatStudioTime(details.start);
  const localTime = details.timezone ? safeFormatTime(details.start, details.timezone) : null;
  const inviteeTime = localTime && localTime !== studioTime ? localTime : null;

  const about = [
    `${BOOKING_EVENT.LABEL_NAME}: ${escapeHtml(details.name)}`,
    `${BOOKING_EVENT.LABEL_EMAIL}: ${escapeHtml(details.email)}`,
    ...(inviteeTime ? [`${BOOKING_EVENT.LABEL_INVITEE_TIME}: ${inviteeTime}`] : []),
    `${BOOKING_EVENT.LABEL_STUDIO_TIME}: ${studioTime}`,
    ...(details.notes ? [`${BOOKING_EVENT.LABEL_NOTES}: ${escapeHtml(details.notes).replace(/\r?\n/g, '<br>')}`] : []),
  ];

  return [
    BOOKING_EVENT.INTRO,
    section(BOOKING_EVENT.AGENDA_HEADING, [...BOOKING_EVENT.AGENDA_POINTS]),
    section(BOOKING_EVENT.PREPARE_HEADING, [...BOOKING_EVENT.PREPARE_POINTS]),
    section(BOOKING_EVENT.ABOUT_HEADING, about),
    BOOKING_EVENT.RESCHEDULE(BOOKING_EVENT.STUDIO_EMAIL),
  ].join(BOOKING_EVENT.BLOCK_SEPARATOR);
}
