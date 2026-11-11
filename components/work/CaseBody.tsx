import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import OpenSheetButton from '@/components/OpenSheetButton';
import { BTN_EMBER, CONTAINER, EYEBROW, FOCUS_RING, H2, SECTION_Y, pad2 } from '@/components/studio/ui';
import { WORK_ROUTE, hostOf, nextWork, workIndex, type WorkProject } from '@/lib/work';
import { BrowserFrame, PhoneFrame, WorkCover } from './Frames';

const COVER_SIZES = { desktop: '(min-width: 1280px) 980px, 76vw', mobile: '(min-width: 1280px) 290px, 22vw' };
const NEXT_SIZES = { desktop: '(min-width: 768px) 380px, 70vw', mobile: '(min-width: 768px) 110px, 20vw' };
const FULL_SIZES = '(min-width: 1280px) 1216px, 100vw';
const PHONE_SIZES = '(min-width: 1024px) 260px, 30vw';
const PHONE_OFFSET = ['', 'translate-y-6 sm:translate-y-16', ''];

interface CaseBodyProps {
  project: WorkProject;
  titleId?: string;
  asPage?: boolean;
  onNext?: (slug: string) => void;
  onStart?: () => void;
}

const Label = ({ index, children }: { index: number; children: string }) => (
  <p className={`${EYEBROW} lg:col-span-4`}>({pad2(index)}) {children}</p>
);

export default function CaseBody({ project, titleId, asPage = false, onNext, onStart }: CaseBodyProps) {
  const Title = asPage ? 'h1' : 'h2';
  const next = nextWork(project.slug);
  const host = hostOf(project.liveUrl);
  const meta = [
    { label: 'Services', value: project.services.join(', ') },
    { label: 'Timeline', value: project.timeline },
    { label: 'Location', value: project.location },
    { label: 'Built with', value: project.stack.join(', ') },
  ];

  const nextInner = (
    <>
      <span className="md:col-span-7">
        <span className={`${EYEBROW} block`}>Next case</span>
        <span className="mt-4 flex items-end gap-4 font-display text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.85] tracking-[-0.05em]">
          {next.client}
          <ArrowRight className="mb-[0.12em] h-[0.4em] w-[0.4em] flex-shrink-0 motion-safe:transition-transform motion-safe:duration-500 group-hover:translate-x-2" aria-hidden="true" />
        </span>
        <span className="mt-4 block max-w-md text-muted-foreground">{next.headline}</span>
      </span>
      <WorkCover project={next} sizes={NEXT_SIZES} className="md:col-span-5 aspect-[16/10] rounded-[18px]" />
    </>
  );
  const nextClass = `group grid w-full gap-8 text-left md:grid-cols-12 md:items-end rounded-[22px] ${FOCUS_RING}`;

  return (
    <article className="bg-background text-foreground">
      <div data-case-anim className={CONTAINER}>
        <WorkCover project={project} sizes={COVER_SIZES} priority className="aspect-[4/3] sm:aspect-[16/9] rounded-[22px]" />
      </div>

      <header className={`${CONTAINER} mt-10 sm:mt-16 grid gap-8 lg:grid-cols-12 lg:items-end`}>
        <div className="lg:col-span-8">
          <p data-case-anim className={EYEBROW}>({pad2(workIndex(project.slug))}) {project.discipline}</p>
          <Title id={titleId} data-case-anim className="mt-4 font-display text-[clamp(3.25rem,12vw,10rem)] font-semibold leading-[0.85] tracking-[-0.06em]">
            {project.client}
          </Title>
          <p data-case-anim className="mt-6 max-w-[22ch] font-display text-2xl sm:text-4xl font-medium leading-[1.08] tracking-[-0.035em]">
            {project.headline}
          </p>
        </div>
        <div data-case-anim className="lg:col-span-4 lg:pb-2">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{project.summary}</p>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-[15px] font-semibold ${FOCUS_RING}`}
            >
              <span className="link-draw">Visit {host}</span>
              <ArrowUpRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      <dl data-case-anim className={`${CONTAINER} mt-12 sm:mt-16 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4`}>
        {meta.map((row) => (
          <div key={row.label} className="border-t border-border pt-4">
            <dt className={EYEBROW}>{row.label}</dt>
            <dd className="mt-2 text-[15px] leading-snug">{row.value}</dd>
          </div>
        ))}
      </dl>

      <section className={`${CONTAINER} ${SECTION_Y} grid gap-6 lg:grid-cols-12`}>
        <Label index={1}>The brief</Label>
        <p className="lg:col-span-8 font-display text-2xl sm:text-3xl lg:text-4xl font-medium leading-[1.2] tracking-[-0.03em]">{project.brief}</p>
      </section>

      <figure className={CONTAINER}>
        <BrowserFrame shot={project.desktop[1]} host={host} sizes={FULL_SIZES} />
        <figcaption className={`${EYEBROW} mt-4`}>{project.desktop[1].label}</figcaption>
      </figure>

      <figure className={`${CONTAINER} mt-10 sm:mt-16`}>
        <div className="rounded-[22px] px-5 pt-8 pb-14 sm:px-14 sm:pt-16 sm:pb-28" style={{ background: project.accent }}>
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:gap-10">
            {project.mobile.map((shot, i) => (
              <PhoneFrame key={shot.src} shot={shot} sizes={PHONE_SIZES} className={PHONE_OFFSET[i]} />
            ))}
          </div>
        </div>
        <figcaption className={`${EYEBROW} mt-4`}>Designed for the phone first</figcaption>
      </figure>

      <section className={`${CONTAINER} ${SECTION_Y} grid gap-6 lg:grid-cols-12`}>
        <Label index={2}>The approach</Label>
        <ol className="lg:col-span-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {project.approach.map((step, i) => (
            <li key={step.title} className="border-t border-border pt-5">
              <p className={EYEBROW}>{pad2(i + 1)}</p>
              <h3 className="mt-3 font-display text-xl sm:text-2xl font-semibold tracking-[-0.03em]">{step.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <figure className={CONTAINER}>
        <BrowserFrame shot={project.desktop[2]} host={host} sizes={FULL_SIZES} />
        <figcaption className={`${EYEBROW} mt-4`}>{project.desktop[2].label}</figcaption>
      </figure>

      <section className={`${CONTAINER} ${SECTION_Y} grid gap-6 lg:grid-cols-12`}>
        <Label index={3}>The outcome</Label>
        <dl className="lg:col-span-8 grid gap-10 sm:grid-cols-2">
          {project.outcomes.map((o) => (
            <div key={o.label} className="border-t border-border pt-5">
              <dt className="sr-only">{o.label}</dt>
              <dd className="font-display text-6xl sm:text-7xl font-medium tracking-[-0.05em]">{o.value}</dd>
              <p className="mt-3 text-muted-foreground">{o.label}</p>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-border">
        <div className={`${CONTAINER} py-14 sm:py-24`}>
          {onNext ? (
            <button type="button" onClick={() => onNext(next.slug)} className={nextClass}>{nextInner}</button>
          ) : (
            <Link href={`${WORK_ROUTE}/${next.slug}`} className={nextClass}>{nextInner}</Link>
          )}
        </div>
      </section>

      <section className="tone-ink">
        <div className={`${CONTAINER} ${SECTION_Y} grid gap-8 lg:grid-cols-12 lg:items-end`}>
          <h2 className={`${H2} lg:col-span-8`}>Have something like this <span className="text-primary">in mind?</span></h2>
          <div className="lg:col-span-4 lg:justify-self-end">
            {onStart ? (
              <button type="button" onClick={onStart} className={BTN_EMBER}>
                Start a project <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <OpenSheetButton className={BTN_EMBER}>
                Start a project <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </OpenSheetButton>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
