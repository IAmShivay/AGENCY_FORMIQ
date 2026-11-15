'use client';

import { useRef, useState } from 'react';
import type { WorkReel } from '@/lib/work';
import { useInViewPlayback } from './useInViewPlayback';

export default function CardReel({ reel, accent }: { reel: WorkReel; accent: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useInViewPlayback(ref, !failed);

  if (failed) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: accent }}
      >
        <video
          ref={ref}
          src={reel.loop}
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setPlaying(true)}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full bg-primary ${playing ? 'motion-safe:animate-pulse' : ''}`} />
        Reel
      </span>
    </>
  );
}
