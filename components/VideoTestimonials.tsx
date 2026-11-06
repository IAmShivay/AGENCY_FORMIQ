'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { VIDEO_TESTIMONIALS, hasExamples, visibleItems, type VideoTestimonial } from '@/lib/social-proof';
import { CONTAINER, EYEBROW, FOCUS_RING, H2, RAIL_ITEM, RAIL_TO_SM, SECTION_Y, pad2 } from '@/components/studio/ui';

const POSTER_TONES = ['tone-ink', 'tone-sage', 'tone-sand'] as const;
const CAPTIONS_LANG = 'en';
const CARD = 'relative aspect-[9/16] w-full overflow-hidden rounded-[22px]';

const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function Poster({ t, index, onPlay }: { t: VideoTestimonial; index: number; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play testimonial from ${t.name}, ${t.company}`}
      className={`group block text-left ${CARD} ${FOCUS_RING} ${t.posterSrc ? 'bg-muted' : POSTER_TONES[index % POSTER_TONES.length]}`}
    >
      {t.posterSrc ? (
        <Image src={t.posterSrc} alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-[7rem] font-medium tracking-[-0.06em] text-foreground/10">
          {initials(t.company)}
        </span>
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">
        ({pad2(index + 1)}) {t.duration}
      </span>
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black transition-transform duration-500 group-hover:scale-110">
        <Play className="ml-0.5 h-5 w-5 fill-current" />
      </span>
      <span className="absolute inset-x-5 bottom-5 text-white">
        <span className="block font-serif text-2xl italic leading-[1.1]">&ldquo;{t.quote}&rdquo;</span>
        <span className="mt-4 block text-sm font-semibold">{t.name}</span>
        <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">{t.role}, {t.company}</span>
      </span>
    </button>
  );
}

function Player({ t, onStop }: { t: VideoTestimonial; onStop: () => void }) {
  return (
    <div className={`${CARD} bg-black`}>
      {t.videoSrc ? (
        <video src={t.videoSrc} poster={t.posterSrc} controls autoPlay playsInline onEnded={onStop} className="absolute inset-0 h-full w-full object-cover">
          {t.captionsSrc && <track kind="captions" src={t.captionsSrc} srcLang={CAPTIONS_LANG} label="English" default />}
        </video>
      ) : (
        <div className="tone-ink absolute inset-0 flex flex-col justify-end gap-3 p-6">
          <p className={EYEBROW}>Sample reel</p>
          <p className="font-display text-2xl font-semibold tracking-[-0.03em]">No video yet</p>
          <p className="text-sm text-muted-foreground">Add a real client video (and captions) to this entry in lib/social-proof.ts and it plays right here.</p>
        </div>
      )}
      <button
        type="button"
        onClick={onStop}
        aria-label="Close video"
        className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black ${FOCUS_RING}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function VideoTestimonials() {
  const reels = visibleItems(VIDEO_TESTIMONIALS);
  const [playing, setPlaying] = useState<number | null>(null);
  if (!reels.length) return null;

  return (
    <section className={`bg-background text-foreground ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <div className="mb-12 grid gap-6 sm:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={`${EYEBROW} mb-5`}>(04) In their words</p>
            <h2 className={H2}>In their <span className="text-primary">words</span>.</h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            {hasExamples(reels) && (
              <span className={`${EYEBROW} rounded-full border border-primary/40 px-3 py-1 text-primary`}>Sample reels · development only</span>
            )}
          </div>
        </div>

        <ul aria-label="Video testimonials" className={`${RAIL_TO_SM} sm:grid sm:gap-5 sm:grid-cols-2 lg:grid-cols-3`}>
          {reels.map((t, i) => (
            <li key={`${t.company}-${i}`} data-reveal className={`${RAIL_ITEM} max-w-[300px] sm:w-auto sm:max-w-none`} data-native-cursor={playing === i ? '' : undefined}>
              {playing === i ? <Player t={t} onStop={() => setPlaying(null)} /> : <Poster t={t} index={i} onPlay={() => setPlaying(i)} />}
              {t.caseStudyHref && (
                <Link href={t.caseStudyHref} className={`mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold ${FOCUS_RING}`}>
                  <span className="link-draw">Read the case study</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
