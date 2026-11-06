import { NextResponse } from 'next/server';
import { BOOKING_MESSAGES, BOOKING_SCHEDULE, HTTP_STATUS } from '@/lib/booking/constants';
import { isGoogleCalendarConfigured } from '@/lib/booking/google-calendar';
import { getAvailableSlots } from '@/lib/booking/availability';
import { BookingError } from '@/lib/booking/errors';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      { success: false, message: BOOKING_MESSAGES.NOT_CONFIGURED },
      { status: HTTP_STATUS.SERVICE_UNAVAILABLE },
    );
  }

  try {
    const slots = await getAvailableSlots();
    return NextResponse.json({
      success: true,
      data: {
        timezone: BOOKING_SCHEDULE.TIMEZONE,
        slotMinutes: BOOKING_SCHEDULE.SLOT_MINUTES,
        slots,
      },
    });
  } catch (error) {
    const status = error instanceof BookingError ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = status === HTTP_STATUS.SERVICE_UNAVAILABLE ? BOOKING_MESSAGES.NOT_CONFIGURED : BOOKING_MESSAGES.FAILED;
    if (status !== HTTP_STATUS.SERVICE_UNAVAILABLE) console.error('[booking] slots failed', error);
    return NextResponse.json({ success: false, message }, { status });
  }
}
