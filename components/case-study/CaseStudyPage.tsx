import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies';
import { BTN_EMBER, CONTAINER, EYEBROW, FOCUS_RING, H2, SECTION_Y, pad2 } from '@/components/studio/ui';
import OpenSheetButton from '@/components/OpenSheetButton';

export interface CaseStudyMedia {
  hero: ReactNode;
  identity?: ReactNode;
  packaging?: ReactNode;
  web?: ReactNode;
}

const PORTFOLIO_PATH = '/portfolio';
const SWATCH_TEXT = { light: '#FFFFFF', dark: '#111111' } as const;

const Label = ({ index, children }: { index: number; children: ReactNode }) => (
  <p className={EYEBROW}>({pad2(index)}) {children}</p>
);

const MediaBlock = ({ caption, children }: { caption: string; children: ReactNode }) => (
  <figure data-reveal className={`${CONTAINER} mt-16 sm:mt-24`}>
    {children}
    <figcaption className={`${EYEBROW} mt-4`}>{caption}</figcaption>
  </figure>
);

export default function CaseStudyPage({ study, media }: { study: CaseStudy; media: CaseStudyMedia }) {
  const metaRows = [
    { label: 'Client', value: study.client },
    { label: 'Sector', value: study.meta.sector },
    { label: 'Services', value: study.meta.services.join(', ') },
    { label: 'Year', value: study.meta.year },
    { label: 'Location', value: study.meta.location },
  ];

  return (
    <article className="bg-background text-foreground">
      <header className={`${CONTAINER} pt-28 sm:pt-32 lg:pt-36`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href={PORTFOLIO_PATH} className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground ${FOCUS_RING}`}>
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
          {study.example && (
            <span className={`${EYEBROW} rounded-full border border-primary/40 px-3 py-1 text-primary`}>Example case study · sample content</span>
          )}
        </div>

        <p className={`${EYEBROW} mt-12 sm:mt-16`}>Case study</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,16vw,13rem)] font-medium leading-[0.85] tracking-[-0.06em]">{study.client}</h1>
        <p className="mt-8 max-w-[22ch] font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.05] tracking-[-0.04em]">{study.title}</p>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 md:grid-cols-5">
          {metaRows.map((row) => (
            <div key={row.label}>
              <dt className={EYEBROW}>{row.label}</dt>
              <dd className="mt-2 text-[15px] leading-snug">{row.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div data-reveal className={`${CONTAINER} mt-12 sm:mt-16`}>{media.hero}</div>

      <section className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><Label index={1}>The brief</Label></div>
          <p data-reveal className="lg:col-span-8 font-display text-2xl sm:text-3xl font-medium leading-[1.25] tracking-[-0.03em]">{study.brief}</p>
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><Label index={2}>Our approach</Label></div>
          <ol className="lg:col-span-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {study.approach.map((step, i) => (
              <li key={step.title} data-reveal className="border-t border-border pt-5">
                <p className={EYEBROW}>{pad2(i + 1)}</p>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {media.identity && <MediaBlock caption="Identity system">{media.identity}</MediaBlock>}

      <section className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><Label index={3}>Colour & type</Label></div>
          <div className="lg:col-span-8 space-y-10">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {study.palette.map((sw) => (
                <li key={sw.hex} data-reveal className="flex aspect-[3/4] flex-col justify-end rounded-2xl border border-border p-4" style={{ background: sw.hex, color: sw.onDark ? SWATCH_TEXT.light : SWATCH_TEXT.dark }}>
                  <p className="font-display text-lg font-semibold">{sw.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] opacity-75">{sw.hex}</p>
                </li>
              ))}
            </ul>
            <ul className="grid gap-3 sm:grid-cols-2">
              {study.typefaces.map((t) => (
                <li key={t.name} data-reveal className="rounded-2xl border border-border p-6">
                  <p className={EYEBROW}>{t.role}</p>
                  <p className={`mt-6 text-5xl leading-none tracking-[-0.03em] ${t.className}`}>{t.sample}</p>
                  <p className="mt-6 text-sm text-muted-foreground">{t.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {media.packaging && <MediaBlock caption="Packaging">{media.packaging}</MediaBlock>}
      {media.web && <MediaBlock caption="Shopify store, desktop and mobile">{media.web}</MediaBlock>}

      <section className={`${CONTAINER} ${SECTION_Y}`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label index={4}>Results</Label>
            {study.example && <p className="mt-3 text-sm text-muted-foreground">Example figures for illustration.</p>}
          </div>
          <dl className="lg:col-span-8 grid gap-8 sm:grid-cols-3">
            {study.results.map((r) => (
              <div key={r.label} data-reveal className="border-t border-border pt-5">
                <dt className="sr-only">{r.label}</dt>
                <dd className="font-display text-6xl font-medium tracking-[-0.05em]">{r.value}</dd>
                <p className="mt-3 text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </dl>
        </div>

        {study.quote && (
          <figure data-reveal className="mt-24 border-t border-border pt-12">
            <blockquote className="max-w-[28ch] font-serif text-4xl sm:text-5xl lg:text-6xl italic leading-[1.05] tracking-[-0.02em]">
              &ldquo;{study.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-8">
              <p className="font-medium">{study.quote.name}</p>
              <p className={EYEBROW}>{study.quote.role}</p>
            </figcaption>
          </figure>
        )}
      </section>

      <section className="tone-ink">
        <div className={`${CONTAINER} ${SECTION_Y} grid gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <p className={EYEBROW}>Next step</p>
            <h2 className={`${H2} mt-4`}>Have a brand like this <span className="text-primary">in mind?</span></h2>
            <OpenSheetButton className={`${BTN_EMBER} mt-10`}>
              Start a project <ArrowRight className="h-4 w-4" />
            </OpenSheetButton>
          </div>
          <dl className="lg:col-span-5 space-y-4 self-end">
            {study.credits.map((c) => (
              <div key={c.role} className="flex justify-between gap-6 border-t border-border pt-4">
                <dt className={EYEBROW}>{c.role}</dt>
                <dd className="text-sm">{c.names}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </article>
  );
}
