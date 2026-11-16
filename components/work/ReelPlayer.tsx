'use client';

import { useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { FOCUS_RING } from '@/components/studio/ui';
import { useInViewPlayback } from './useInViewPlayback';

interface ReelPlayerProps {
  full: string;
  loop?: string;
  poster?: string;
  title: string;
  className?: string;
}

export default function ReelPlayer({ full, loop, poster, title, className = '' }: ReelPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(!loop);
  const [failed, setFailed] = useState(false);

  useInViewPlayback(ref, !withSound);

  if (failed) return null;

  const showLoop = !withSound && !!loop;

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        key={showLoop ? 'loop' : 'full'}
        ref={ref}
        src={showLoop ? loop : full}
        poster={poster}
        muted={showLoop}
        loop={showLoop}
        controls={!showLoop}
        autoPlay={!showLoop && !!loop}
        playsInline
        preload="metadata"
        aria-label={showLoop ? `${title}, silent preview` : title}
        onError={() => setFailed(true)}
        onEnded={() => loop && setWithSound(false)}
        className="block h-full w-full object-cover"
      />
      {showLoop ? (
        <button
          type="button"
          onClick={() => setWithSound(true)}
          className={`absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-black backdrop-blur motion-safe:transition-transform motion-safe:duration-300 hover:scale-[1.03] ${FOCUS_RING}`}
        >
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          Watch with sound
        </button>
      ) : (
        loop && (
          <button
            type="button"
            onClick={() => setWithSound(false)}
            aria-label="Close and return to preview"
            className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )
      )}
    </div>
  );
}
