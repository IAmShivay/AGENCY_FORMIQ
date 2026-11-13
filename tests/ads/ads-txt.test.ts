import { describe, expect, it } from 'vitest';
import { parseAdsTxt } from '@/lib/ads/ads-txt';

describe('parseAdsTxt', () => {
  it('returns null when unset or blank', () => {
    expect(parseAdsTxt(undefined)).toBeNull();
    expect(parseAdsTxt('  \n ')).toBeNull();
  });

  it('normalises real and escaped newlines', () => {
    expect(parseAdsTxt('a.com, 1, DIRECT\\nb.com, 2, RESELLER')).toBe('a.com, 1, DIRECT\nb.com, 2, RESELLER\n');
    expect(parseAdsTxt(' a.com, 1, DIRECT \r\n\r\n')).toBe('a.com, 1, DIRECT\n');
  });
});
