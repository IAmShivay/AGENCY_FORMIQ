import Image from 'next/image';
import type { WorkProject, WorkShot } from '@/lib/work';

const DESKTOP_RATIO = 'aspect-[16/10]';
const MOBILE_RATIO = 'aspect-[390/844]';

export function BrowserFrame({ shot, host, sizes, priority = false, className = '' }: { shot: WorkShot; host?: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[10px] sm:rounded-[14px] bg-[#1b1b1b] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10 ${className}`}>
      <div aria-hidden="true" className="flex h-5 sm:h-8 items-center gap-1 sm:gap-1.5 px-2 sm:px-3">
        <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-white/20" />
        {host && <span className="mx-auto hidden sm:block font-mono text-[10px] tracking-[0.08em] text-white/45">{host}</span>}
      </div>
      <div className={`relative ${DESKTOP_RATIO} bg-white`}>
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}

export function PhoneFrame({ shot, sizes, className = '' }: { shot: WorkShot; sizes: string; className?: string }) {
  return (
    <div className={`rounded-[18%/8.5%] bg-[#111] p-[3.5%] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)] ring-1 ring-white/10 ${className}`}>
      <div className={`relative ${MOBILE_RATIO} overflow-hidden rounded-[15%/7%] bg-white`}>
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** Browser + phone composed on the project's accent panel. */
export function WorkCover({ project, sizes, priority = false, className = '' }: { project: WorkProject; sizes: { desktop: string; mobile: string }; priority?: boolean; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={{ background: project.accent }}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.14),transparent_60%)]" />
      <div data-cover-desktop className="absolute left-[7%] top-[12%] w-[76%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:-translate-y-[2%]">
        <BrowserFrame shot={project.desktop[0]} sizes={sizes.desktop} priority={priority} />
      </div>
      <div data-cover-phone className="absolute right-[6%] top-[30%] w-[22%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:-translate-y-[4%]">
        <PhoneFrame shot={project.mobile[0]} sizes={sizes.mobile} />
      </div>
    </div>
  );
}
