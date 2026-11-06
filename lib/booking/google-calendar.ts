// Server-only: talks to Google Calendar with the studio's OAuth refresh token.

import { randomUUID } from 'node:crypto';
import { BOOKING_MESSAGES, BOOKING_SCHEDULE, GOOGLE_API, HTTP_STATUS } from './constants';
import { BookingError } from './errors';

export interface BusyInterval {
  start: number;
  end: number;
}

export interface CalendarEventInput {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  attendee: { email: string; name: string };
}

export interface CreatedCalendarEvent {
  id: string;
  meetLink: string | null;
  htmlLink: string | null;
}

const SECOND_MS = 1000;

const googleEnv = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN ?? '',
  calendarId: process.env.GOOGLE_CALENDAR_ID || GOOGLE_API.DEFAULT_CALENDAR_ID,
});

let accessToken: { value: string; expiresAt: number } | null = null;

export const isGoogleCalendarConfigured = () => {
  const { clientId, clientSecret, refreshToken } = googleEnv();
  return Boolean(clientId && clientSecret && refreshToken);
};

async function getAccessToken(): Promise<string> {
  if (accessToken && accessToken.expiresAt > Date.now() + GOOGLE_API.TOKEN_REFRESH_MARGIN_MS) {
    return accessToken.value;
  }

  const { clientId, clientSecret, refreshToken } = googleEnv();
  const response = await fetch(GOOGLE_API.TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': GOOGLE_API.FORM_CONTENT_TYPE },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: GOOGLE_API.GRANT_REFRESH_TOKEN,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const failure = (await response.json().catch(() => ({}))) as { error?: string };
    if (failure.error === GOOGLE_API.INVALID_GRANT) {
      accessToken = null;
      console.error(GOOGLE_API.RECONNECT_REQUIRED);
      throw new BookingError(BOOKING_MESSAGES.NOT_CONFIGURED, HTTP_STATUS.SERVICE_UNAVAILABLE);
    }
    throw new BookingError(GOOGLE_API.TOKEN_FAILED(response.status));
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  accessToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * SECOND_MS };
  return accessToken.value;
}

async function google<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${GOOGLE_API.CALENDAR_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': GOOGLE_API.JSON_CONTENT_TYPE,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new BookingError(GOOGLE_API.REQUEST_FAILED(response.status));
  }

  return response.json() as Promise<T>;
}

export async function getBusyIntervals(timeMin: Date, timeMax: Date): Promise<BusyInterval[]> {
  const data = await google<{ calendars: Record<string, { busy?: { start: string; end: string }[] }> }>('/freeBusy', {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    timeZone: BOOKING_SCHEDULE.TIMEZONE,
    items: [{ id: googleEnv().calendarId }],
  });

  return Object.values(data.calendars)
    .flatMap((calendar) => calendar.busy ?? [])
    .map((interval) => ({ start: Date.parse(interval.start), end: Date.parse(interval.end) }));
}

export async function createCalendarEvent(input: CalendarEventInput): Promise<CreatedCalendarEvent> {
  const query = new URLSearchParams({
    conferenceDataVersion: GOOGLE_API.CONFERENCE_DATA_VERSION,
    sendUpdates: GOOGLE_API.SEND_UPDATES,
  });

  const event = await google<{
    id: string;
    hangoutLink?: string;
    htmlLink?: string;
  }>(`/calendars/${encodeURIComponent(googleEnv().calendarId)}/events?${query}`, {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.start.toISOString(), timeZone: BOOKING_SCHEDULE.TIMEZONE },
    end: { dateTime: input.end.toISOString(), timeZone: BOOKING_SCHEDULE.TIMEZONE },
    attendees: [{ email: input.attendee.email, displayName: input.attendee.name }],
    guestsCanModify: false,
    guestsCanInviteOthers: true,
    guestsCanSeeOtherGuests: true,
    conferenceData: {
      createRequest: {
        requestId: randomUUID(),
        conferenceSolutionKey: { type: GOOGLE_API.CONFERENCE_TYPE },
      },
    },
    reminders: { useDefault: true },
  });

  return { id: event.id, meetLink: event.hangoutLink ?? null, htmlLink: event.htmlLink ?? null };
}
