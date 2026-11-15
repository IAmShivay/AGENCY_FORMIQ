import { useEffect, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/studio-motion';

const VISIBLE_RATIO = 0.4;

export function useInViewPlayback(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => undefined) : video.pause()),
      { threshold: VISIBLE_RATIO },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [ref, enabled]);
}
