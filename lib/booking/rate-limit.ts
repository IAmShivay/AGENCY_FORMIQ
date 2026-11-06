// Simple per-instance, in-memory fixed-window limiter for the booking POST route.

import { BOOKING_RATE_LIMIT } from './constants';

const hits = new Map<string, { count: number; resetAt: number }>();

export function clientIp(headers: Headers): string {
  const forwarded = headers.get(BOOKING_RATE_LIMIT.FORWARDED_FOR_HEADER)?.split(',')[0]?.trim();
  return forwarded || headers.get(BOOKING_RATE_LIMIT.REAL_IP_HEADER)?.trim() || BOOKING_RATE_LIMIT.UNKNOWN_IP;
}

/** Returns true when the request is allowed. */
export function takeToken(ip: string, now = Date.now()): boolean {
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    if (hits.size >= BOOKING_RATE_LIMIT.MAX_TRACKED_IPS) {
      hits.forEach((value, key) => {
        if (value.resetAt <= now) hits.delete(key);
      });
    }
    hits.set(ip, { count: 1, resetAt: now + BOOKING_RATE_LIMIT.WINDOW_MS });
    return true;
  }
  if (entry.count >= BOOKING_RATE_LIMIT.MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}
