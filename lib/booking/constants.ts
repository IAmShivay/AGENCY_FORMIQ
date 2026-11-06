// Discovery-call booking (Google Calendar). Shared by the API routes and the slot picker.

import { ENQUIRY_EMAIL, ENQUIRY_TABLE } from '@/lib/enquiry-options';

const MINUTES_PER_HOUR = 60;

export const BOOKING_SCHEDULE = {
  TIMEZONE: 'Asia/Kolkata',
  WORKING_DAYS: [1, 2, 3, 4, 5],
  DAY_START_MINUTES: 11 * MINUTES_PER_HOUR,
  DAY_END_MINUTES: 20 * MINUTES_PER_HOUR,
  SLOT_MINUTES: 30,
  BUFFER_MINUTES: 15,
  MIN_NOTICE_MINUTES: 180,
  HORIZON_DAYS: 21,
} as const;

export const BOOKING_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 120,
  EMAIL_MAX_LENGTH: 255,
  NOTES_MAX_LENGTH: 2000,
  TIMEZONE_MAX_LENGTH: 64,
  TIMEZONE_PATTERN: /^[A-Za-z]+(?:[/_+-][A-Za-z0-9]+)*$/,
  AVAILABILITY_CACHE_MS: 30_000,
  MINUTE_MS: 60_000,
  DAY_MS: 86_400_000,
} as const;

export const BOOKING_RATE_LIMIT = {
  WINDOW_MS: 10 * 60_000,
  MAX_REQUESTS: 5,
  MAX_TRACKED_IPS: 5000,
  FORWARDED_FOR_HEADER: 'x-forwarded-for',
  REAL_IP_HEADER: 'x-real-ip',
  UNKNOWN_IP: 'unknown',
} as const;

export const BOOKING_MESSAGES = {
  CREATED: 'Your discovery call is booked',
  NOT_CONFIGURED: 'Booking is not configured yet',
  SLOT_TAKEN: 'That time was just taken. Please pick another slot',
  RATE_LIMITED: 'Too many booking attempts. Please try again in a few minutes',
  FAILED: 'Could not book the call. Please try again',
  INVALID_BODY: 'Invalid request body',
  NAME_LENGTH: 'Name must be between 2 and 120 characters',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_START: 'Invalid start time',
  INVALID_TIMEZONE: 'Invalid timezone',
  NOTES_LENGTH: 'Notes must be 2000 characters or fewer',
  EVENT_CREATED: (id: string) => `Booking created as calendar event ${id}`,
} as const;

export const BOOKING_EVENT = {
  SUMMARY: (name: string) => `Discovery call · ${name} × FormiqStudio`,
  INTRO: 'Thanks for booking a discovery call with FormiqStudio. The Google Meet link is attached to this invite.',
  AGENDA_HEADING: 'What we will cover in 30 minutes',
  AGENDA_POINTS: [
    'Your project, goals and timeline',
    'What you need: brand, website, Shopify or ongoing design & development',
    'Budget, next steps and a fixed quote within a few days',
  ],
  PREPARE_HEADING: 'Before the call',
  PREPARE_POINTS: ['Links to your current site, references or a brief help us prepare'],
  ABOUT_HEADING: 'Booking details',
  LABEL_NAME: 'Name',
  LABEL_EMAIL: 'Email',
  LABEL_INVITEE_TIME: 'Your time',
  LABEL_STUDIO_TIME: 'Studio time',
  LABEL_NOTES: 'Notes',
  STUDIO_EMAIL: ENQUIRY_EMAIL,
  RESCHEDULE: (email: string) =>
    `Need to move it? Reply to this invite or email <a href="mailto:${email}">${email}</a> and we will find another time.`,
  DATE_LOCALE: 'en-GB',
  BLOCK_SEPARATOR: '<br>',
} as const;

/** Follow-up row in the enquiry table so the team sees the booked call next to the lead. */
export const BOOKING_RECORD = {
  TABLE: ENQUIRY_TABLE,
  SUBJECT: 'Call booked',
  MESSAGE: (studioTime: string, meetLink: string | null, notes?: string) =>
    [`Discovery call booked for ${studioTime}`, meetLink && `Meet: ${meetLink}`, notes && `\n${notes}`]
      .filter(Boolean)
      .join('\n'),
} as const;

export const BOOKING_NOTIFY = {
  RECIPIENTS: (process.env.BOOKING_NOTIFY_EMAIL || ENQUIRY_EMAIL).split(',').map((email) => email.trim()).filter(Boolean),
  SUBJECT: (name: string, studioTime: string) => `New call booked · ${name} · ${studioTime}`,
  HEADING: 'A discovery call was just booked',
  LABEL_NAME: 'Name',
  LABEL_EMAIL: 'Email',
  LABEL_STUDIO_TIME: 'Studio time',
  LABEL_INVITEE_TIME: 'Their time',
  LABEL_MEET: 'Google Meet',
  LABEL_CALENDAR: 'Calendar event',
  LABEL_NOTES: 'Notes',
  FOOTER: 'The invite has been sent to the client from your Google Calendar. Reply to this email to write to them directly.',
} as const;

export const GOOGLE_API = {
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  CALENDAR_BASE_URL: 'https://www.googleapis.com/calendar/v3',
  SCOPES: [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.freebusy',
  ],
  DEFAULT_CALENDAR_ID: 'primary',
  GRANT_REFRESH_TOKEN: 'refresh_token',
  CONFERENCE_TYPE: 'hangoutsMeet',
  CONFERENCE_DATA_VERSION: '1',
  SEND_UPDATES: 'all',
  TOKEN_REFRESH_MARGIN_MS: 60_000,
  FORM_CONTENT_TYPE: 'application/x-www-form-urlencoded',
  JSON_CONTENT_TYPE: 'application/json',
  DATE_PARTS_LOCALE: 'en-US',
  REQUEST_FAILED: (status: number) => `Google Calendar request failed with status ${status}`,
  TOKEN_FAILED: (status: number) => `Google token refresh failed with status ${status}`,
  INVALID_GRANT: 'invalid_grant',
  RECONNECT_REQUIRED:
    'Google Calendar access was revoked or expired. Run "npm run google:auth" to replace GOOGLE_REFRESH_TOKEN in .env',
} as const;

/** Client-side endpoints and copy for the slot picker. */
export const BOOKING_ENDPOINTS = {
  SLOTS: '/api/booking/slots',
  CREATE: '/api/booking',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
