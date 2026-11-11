// Server-only: open discovery-call slots from the studio schedule minus Google Calendar busy time.

import { BOOKING_LIMITS, BOOKING_SCHEDULE } from './constants';
import { zonedDate, zonedTimeToUtc } from './timezone';
import { getBusyIntervals, type BusyInterval } from './google-calendar';

let busyCache: { expiresAt: number; value: Promise<BusyInterval[]> } | null = null;

const slotMs = BOOKING_SCHEDULE.SLOT_MINUTES * BOOKING_LIMITS.MINUTE_MS;
const bufferMs = BOOKING_SCHEDULE.BUFFER_MINUTES * BOOKING_LIMITS.MINUTE_MS;

function loadBusy(now: number, fresh: boolean) {
  if (!fresh && busyCache && busyCache.expiresAt > now) return busyCache.value;
  const value = getBusyIntervals(new Date(now), new Date(now + (BOOKING_SCHEDULE.HORIZON_DAYS + 1) * BOOKING_LIMITS.DAY_MS));
  busyCache = { expiresAt: now + BOOKING_LIMITS.AVAILABILITY_CACHE_MS, value };
  value.catch(() => {
    busyCache = null;
  });
  return value;
}

export function invalidateAvailability() {
  busyCache = null;
}

export async function getAvailableSlots({ fresh = false }: { fresh?: boolean } = {}): Promise<string[]> {
  const now = Date.now();
  const earliest = now + BOOKING_SCHEDULE.MIN_NOTICE_MINUTES * BOOKING_LIMITS.MINUTE_MS;
  const latest = now + BOOKING_SCHEDULE.HORIZON_DAYS * BOOKING_LIMITS.DAY_MS;
  const busy = await loadBusy(now, fresh);
  const workingDays: readonly number[] = BOOKING_SCHEDULE.WORKING_DAYS;
  const slots = new Set<string>();

  for (let offset = 0; offset <= BOOKING_SCHEDULE.HORIZON_DAYS; offset += 1) {
    const day = zonedDate(new Date(now + offset * BOOKING_LIMITS.DAY_MS), BOOKING_SCHEDULE.TIMEZONE);
    if (!workingDays.includes(day.weekday)) continue;

    for (
      let minutes = BOOKING_SCHEDULE.DAY_START_MINUTES;
      minutes + BOOKING_SCHEDULE.SLOT_MINUTES <= BOOKING_SCHEDULE.DAY_END_MINUTES;
      minutes += BOOKING_SCHEDULE.SLOT_MINUTES
    ) {
      const start = zonedTimeToUtc(day, minutes, BOOKING_SCHEDULE.TIMEZONE).getTime();
      const end = start + slotMs;
      if (start < earliest || start > latest) continue;
      const clashes = busy.some((interval) => start < interval.end + bufferMs && end > interval.start - bufferMs);
      if (!clashes) slots.add(new Date(start).toISOString());
    }
  }

  return Array.from(slots).sort();
}

export const slotEnd = (start: Date) => new Date(start.getTime() + slotMs);
