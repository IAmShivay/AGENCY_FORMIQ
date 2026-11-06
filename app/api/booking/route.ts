import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import {
  BOOKING_LIMITS,
  BOOKING_MESSAGES,
  BOOKING_RECORD,
  HTTP_STATUS,
} from '@/lib/booking/constants';
import { createCalendarEvent, isGoogleCalendarConfigured } from '@/lib/booking/google-calendar';
import { getAvailableSlots, invalidateAvailability, slotEnd } from '@/lib/booking/availability';
import { buildEventDescription, buildEventSummary, formatStudioTime } from '@/lib/booking/event';
import { BookingError } from '@/lib/booking/errors';
import { clientIp, takeToken } from '@/lib/booking/rate-limit';
import { notifyStudioOfBooking } from '@/lib/booking/notify';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const createBookingSchema = z.object({
  name: z
    .string({ message: BOOKING_MESSAGES.NAME_LENGTH })
    .trim()
    .min(BOOKING_LIMITS.NAME_MIN_LENGTH, BOOKING_MESSAGES.NAME_LENGTH)
    .max(BOOKING_LIMITS.NAME_MAX_LENGTH, BOOKING_MESSAGES.NAME_LENGTH),
  email: z
    .string({ message: BOOKING_MESSAGES.INVALID_EMAIL })
    .trim()
    .email(BOOKING_MESSAGES.INVALID_EMAIL)
    .max(BOOKING_LIMITS.EMAIL_MAX_LENGTH, BOOKING_MESSAGES.INVALID_EMAIL)
    .transform((value) => value.toLowerCase()),
  start: z.string({ message: BOOKING_MESSAGES.INVALID_START }).datetime({ message: BOOKING_MESSAGES.INVALID_START }),
  timezone: z
    .string()
    .trim()
    .max(BOOKING_LIMITS.TIMEZONE_MAX_LENGTH, BOOKING_MESSAGES.INVALID_TIMEZONE)
    .regex(BOOKING_LIMITS.TIMEZONE_PATTERN, BOOKING_MESSAGES.INVALID_TIMEZONE)
    .optional(),
  notes: z.string().trim().max(BOOKING_LIMITS.NOTES_MAX_LENGTH, BOOKING_MESSAGES.NOTES_LENGTH).optional(),
});

const pendingStarts = new Set<string>();

const fail = (message: string, status: number) => NextResponse.json({ success: false, message }, { status });

/** Best-effort follow-up row next to the enquiry, so the team sees the booked call. */
async function recordBooking(name: string, email: string, start: Date, meetLink: string | null, notes?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  try {
    const { error } = await createClient(url, key, { auth: { persistSession: false } })
      .from(BOOKING_RECORD.TABLE)
      .insert([{ name, email, phone: null, subject: BOOKING_RECORD.SUBJECT, message: BOOKING_RECORD.MESSAGE(formatStudioTime(start), meetLink, notes) }]);
    if (error) console.error('[booking] could not record booking', error.message);
  } catch (error) {
    console.error('[booking] could not record booking', error);
  }
}

export async function POST(req: NextRequest) {
  if (!isGoogleCalendarConfigured()) return fail(BOOKING_MESSAGES.NOT_CONFIGURED, HTTP_STATUS.SERVICE_UNAVAILABLE);
  if (!takeToken(clientIp(req.headers))) return fail(BOOKING_MESSAGES.RATE_LIMITED, HTTP_STATUS.TOO_MANY_REQUESTS);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(BOOKING_MESSAGES.INVALID_BODY, HTTP_STATUS.BAD_REQUEST);
  }

  const validation = createBookingSchema.safeParse(body);
  if (!validation.success) {
    return fail(validation.error.issues.map((issue) => issue.message).join(', '), HTTP_STATUS.BAD_REQUEST);
  }

  const { name, email, timezone, notes } = validation.data;
  const start = new Date(validation.data.start).toISOString();
  if (pendingStarts.has(start)) return fail(BOOKING_MESSAGES.SLOT_TAKEN, HTTP_STATUS.CONFLICT);
  pendingStarts.add(start);

  try {
    const available = await getAvailableSlots({ fresh: true });
    if (!available.includes(start)) return fail(BOOKING_MESSAGES.SLOT_TAKEN, HTTP_STATUS.CONFLICT);

    const startDate = new Date(start);
    const end = slotEnd(startDate);
    const event = await createCalendarEvent({
      start: startDate,
      end,
      summary: buildEventSummary(name),
      description: buildEventDescription({ name, email, start: startDate, timezone, notes }),
      attendee: { email, name },
    });

    invalidateAvailability();
    console.info(BOOKING_MESSAGES.EVENT_CREATED(event.id));
    await Promise.all([
      recordBooking(name, email, startDate, event.meetLink, notes),
      notifyStudioOfBooking({ name, email, start: startDate, timezone, notes, meetLink: event.meetLink, calendarLink: event.htmlLink }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: BOOKING_MESSAGES.CREATED,
        data: { start, end: end.toISOString(), meetLink: event.meetLink },
      },
      { status: HTTP_STATUS.CREATED },
    );
  } catch (error) {
    const status = error instanceof BookingError ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    if (status === HTTP_STATUS.SERVICE_UNAVAILABLE) return fail(BOOKING_MESSAGES.NOT_CONFIGURED, status);
    console.error('[booking] create failed', error);
    return fail(BOOKING_MESSAGES.FAILED, status);
  } finally {
    pendingStarts.delete(start);
  }
}
