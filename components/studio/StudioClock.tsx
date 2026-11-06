'use client';

import { useEffect, useState } from 'react';
import { STUDIO_ADDRESS, STUDIO_TIMEZONE, STUDIO_TIMEZONE_LABEL } from '@/lib/studio-facts';

const TICK_MS = 15_000;

const format = new Intl.DateTimeFormat('en-GB', { timeZone: STUDIO_TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false });

export default function StudioClock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className}>
      {STUDIO_ADDRESS.city}{' '}
      <time suppressHydrationWarning className="tabular-nums text-foreground">{now ? format.format(now) : '--:--'}</time>{' '}
      {STUDIO_TIMEZONE_LABEL}
    </span>
  );
}
