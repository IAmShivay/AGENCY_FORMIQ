'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/studio-motion';
import { CONTAINER, EYEBROW, pad2 } from '@/components/studio/ui';
import StudioClock from '@/components/studio/StudioClock';
import { STUDIO_PHOTOS, type StudioPhoto } from '@/lib/studio-photos';

const PHONE_QUERY = '(max-width: 767px)';
const EASE_OUT = 'expo.out';

const APERTURE = {
  phone: { inset: '10% 8% 10% 8%', radius: 18, scale: 1.18 },
  desktop: { inset: '16% 24% 16% 24%', radius: 28, scale: 1.32 },
} as const;

const OPEN_RADIUS = 22;
const WIPE_DURATION = 1.4;
const WIPE_STAGGER = 0.12;
const DRIFT = { phone: [6, 10, 8], desktop: [10, 18, 14] } as const;

const DETAILS: { photo: StudioPhoto; frame: string; aspect: string }[] = [
  { photo: STUDIO_PHOTOS.overhead, frame: 'col-span-2 md:col-span-5', aspect: 'aspect-[4/3]' },
  { photo: STUDIO_PHOTOS.angle, frame: 'md:col-span-3 md:col-start-7 md:mt-40', aspect: 'aspect-[3/4]' },
  { photo: STUDIO_PHOTOS.desks, frame: 'mt-12 md:col-span-3 md:col-start-10 md:mt-12', aspect: 'aspect-[4/5]' },
];

export default function StudioGallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();

    mm.add({ phone: PHONE_QUERY, desktop: `not all and ${PHONE_QUERY}` }, (ctx) => {
      const phone = !!ctx.conditions?.phone;
      const aperture = phone ? APERTURE.phone : APERTURE.desktop;
      const drift = phone ? DRIFT.phone : DRIFT.desktop;
      const q = gsap.utils.selector(root);

      const lens = q('[data-aperture]')[0];
      const lensImg = q('[data-aperture] img')[0];
      const overlay = q('[data-aperture-overlay] > *');

      gsap.timeline({
        scrollTrigger: { trigger: lens, start: 'top 90%', end: phone ? 'bottom 75%' : 'center 50%', scrub: 0.6 },
      })
        .fromTo(lens,
          { clipPath: `inset(${aperture.inset} round ${aperture.radius}px)` },
          { clipPath: `inset(0% 0% 0% 0% round ${OPEN_RADIUS}px)`, ease: 'none' }, 0)
        .fromTo(lensImg, { scale: aperture.scale }, { scale: 1, ease: 'none' }, 0)
        .fromTo(overlay, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.08, ease: 'none', duration: 0.25 }, 0.75);

      q('[data-frame]').forEach((frame, i) => {
        const img = frame.querySelector('img');
        gsap.fromTo(frame,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)', duration: WIPE_DURATION, delay: (i % 2) * WIPE_STAGGER, ease: EASE_OUT,
            scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
          });
        if (img) {
          gsap.fromTo(img, { yPercent: -drift[i] / 2 }, {
            yPercent: drift[i] / 2, ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }
      });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} data-no-reveal className="pb-20 sm:pb-28 overflow-x-clip">
      <div className={CONTAINER}>
        <div
          data-aperture
          data-cursor
          className="relative overflow-hidden rounded-[22px] bg-muted aspect-[4/3] sm:aspect-[16/9] will-change-[clip-path]"
        >
          <img
            src={STUDIO_PHOTOS.wide.src}
            alt={STUDIO_PHOTOS.wide.alt}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            loading="lazy"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
          <div
            data-aperture-overlay
            className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/80"
          >
            <span className="hidden sm:inline">{STUDIO_PHOTOS.wide.caption}</span>
            <StudioClock className="whitespace-nowrap [&_time]:text-white" />
          </div>
        </div>

        <div className="mt-16 sm:mt-28 grid grid-cols-2 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-12">
          {DETAILS.map(({ photo, frame, aspect }, i) => (
            <figure key={photo.src} className={frame}>
              <div data-frame data-cursor className={`relative overflow-hidden rounded-[18px] sm:rounded-[22px] bg-muted ${aspect}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="absolute -inset-y-[12%] inset-x-0 h-[124%] w-full object-cover will-change-transform"
                  loading="lazy"
                />
              </div>
              <figcaption className={`${EYEBROW} mt-3 sm:mt-4 flex gap-3`}>
                <span className="text-foreground">{pad2(i + 1)}</span>
                <span>{photo.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
