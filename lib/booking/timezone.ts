import { GOOGLE_API } from './constants';

export interface ZonedDate {
  year: number;
  monthIndex: number;
  day: number;
  weekday: number;
}

const SECOND_MS = 1000;
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string) {
  const existing = formatters.get(timeZone);
  if (existing) return existing;
  const formatter = new Intl.DateTimeFormat(GOOGLE_API.DATE_PARTS_LOCALE, {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  formatters.set(timeZone, formatter);
  return formatter;
}

function zonedParts(date: Date, timeZone: string) {
  const parts = formatterFor(timeZone).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: read('year'),
    monthIndex: read('month') - 1,
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
}

function offsetMs(date: Date, timeZone: string) {
  const parts = zonedParts(date, timeZone);
  const asUtc = Date.UTC(parts.year, parts.monthIndex, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - Math.floor(date.getTime() / SECOND_MS) * SECOND_MS;
}

export function zonedDate(date: Date, timeZone: string): ZonedDate {
  const parts = zonedParts(date, timeZone);
  return {
    year: parts.year,
    monthIndex: parts.monthIndex,
    day: parts.day,
    weekday: new Date(Date.UTC(parts.year, parts.monthIndex, parts.day)).getUTCDay(),
  };
}

export function zonedTimeToUtc(date: ZonedDate, minutesOfDay: number, timeZone: string): Date {
  const wallClock = Date.UTC(date.year, date.monthIndex, date.day, 0, minutesOfDay);
  const firstPass = wallClock - offsetMs(new Date(wallClock), timeZone);
  return new Date(wallClock - offsetMs(new Date(firstPass), timeZone));
}
