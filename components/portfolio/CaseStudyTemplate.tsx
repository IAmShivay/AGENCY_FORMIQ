import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import PageCTA from '@/components/studio/PageCTA';
import RevealImage from './RevealImage';
import ReadProgress from './ReadProgress';
import { CONTAINER, EYEBROW, FOCUS_RING, H1, H2, SECTION_Y, pad2 } from '@/components/studio/ui';
import { SECTIONS, caseHref, type CaseItem } from '@/lib/portfolio-cases';
import { PORTFOLIO_ROUTE, hostOf, isNamedClient, initials, isShort, paragraphs, splitQuote } from '@/lib/portfolio-format';
import { SEO_CONSTANTS, generateBreadcrumbStructuredData } from '@/lib/seo';

const HERO_SIZES = '(min-width: 1600px) 1568px, 100vw';
const HALF_SIZES = '(min-width: 768px) 46vw, 92vw';
const NEXT_SIZES = '(min-width: 1024px) 40vw, 92vw';
const HERO_WRAP = 'max-w-[1600px] mx-auto px-2 sm:px-4';

interface CaseStudyTemplateProps {
  item: CaseItem;
  index: number;
  total: number;
  next: CaseItem | null;
}

const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

function SectionLabel({ n, children }: { n: number; children: string }) {
  return <p className={`${EYEBROW} lg:sticky lg:top-28`}>({pad2(n)}) {children}</p>;
}

function Chapter({ n, title, text }: { n: number; title: string; text: string }) {
  const body = paragraphs(text);
  return (
    <section className={`${SECTION_Y} border-t border-border`}>
      <div className={`${CONTAINER} grid gap-6 lg:grid-cols-12`}>
        <div className="lg:col-span-3"><SectionLabel n={n}>{title}</SectionLabel></div>
        <div className="lg:col-span-8 lg:col-start-5 space-y-5">
          {body.map((p, i) => (
            <p key={i} className={i === 0 && isShort(p) ? 'font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.15] tracking-[-0.03em]' : 'text-base sm:text-lg text-foreground/80 leading-relaxed max-w-3xl'}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CaseStudyTemplate({ item, index, total, next }: CaseStudyTemplateProps) {
  const section = SECTIONS[item.section];
  const url = `${SEO_CONSTANTS.SITE_URL}${caseHref(item)}`;
  const quote = item.quote ? splitQuote(item.quote) : null;
  const [lead, ...rest] = item.gallery;
  const namedClient = isNamedClient(item.client);
  let n = 0;

  const structured = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: item.title,
      description: item.summary,
      url,
      image: item.image || undefined,
      genre: item.discipline,
      dateCreated: /^\d{4}$/.test(item.year) ? item.year : undefined,
      creator: { '@type': 'Organization', name: SEO_CONSTANTS.SITE_NAME, url: SEO_CONSTANTS.SITE_URL },
      ...(item.client ? { sourceOrganization: { '@type': 'Organization', name: item.client } } : {}),
    },
    generateBreadcrumbStructuredData([
      { name: 'Work', url: `${SEO_CONSTANTS.SITE_URL}${PORTFOLIO_ROUTE}` },
      { name: section.label, url: `${SEO_CONSTANTS.SITE_URL}${section.route}` },
      { name: item.title, url },
    ]),
  ];

  return (
    <article className="bg-background text-foreground">
      <ReadProgress />
      {structured.map((data, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />)}

      <header className="pt-28 sm:pt-32 md:pt-40 pb-10 sm:pb-16">
        <div className={CONTAINER}>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-4">
            <Link href={section.route} className={`${EYEBROW} inline-flex min-h-11 items-center gap-2 hover:text-foreground transition-colors rounded-sm ${FOCUS_RING}`}>
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Work / {section.label}
            </Link>
            <span className={`${EYEBROW} tabular-nums`}>Case {pad2(index + 1)} / {pad2(total)}</span>
          </nav>
          {namedClient && <p className={`${EYEBROW} mt-8 text-foreground`}>{item.client}</p>}
          <h1 className={`${H1} ${namedClient ? 'mt-3' : 'mt-6'} max-w-5xl break-words`}>{item.title}</h1>
          <div className="mt-10 sm:mt-14 grid gap-10 lg:grid-cols-12">
            <p className={`lg:col-span-7 ${isShort(item.summary) ? 'font-display text-xl sm:text-2xl lg:text-[1.75rem] font-medium leading-[1.35] tracking-[-0.02em] text-foreground/85' : 'text-base sm:text-lg leading-relaxed text-foreground/80'}`}>
              {item.summary}
            </p>
            {item.meta.length > 0 && (
              <dl className="lg:col-span-4 lg:col-start-9 border-t border-foreground">
                {item.meta.map((m) => (
                  <div key={m.label} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-border py-4">
                    <dt className={`${EYEBROW} pt-0.5`}>{m.label}</dt>
                    <dd className="text-sm sm:text-base break-words">
                      {m.href ? (
                        <a href={m.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-semibold rounded-sm ${FOCUS_RING}`}>
                          <span className="link-draw">{m.value}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </header>

      {item.image && (
      <div className={`${HERO_WRAP} pb-14 sm:pb-24`}>
        <RevealImage
          hideOnError
          src={item.image}
          alt={`${item.title}, ${section.singular}`}
          sizes={HERO_SIZES}
          fallback={initials(item.title)}
          priority
          className="aspect-[4/3] sm:aspect-[16/9] rounded-[18px] sm:rounded-[28px]"
        />
      </div>
      )}

      {item.metrics.length > 0 && (
        <section aria-label="Results" className="tone-ink py-14 sm:py-20">
          <dl className={`${CONTAINER} grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10`}>
            {item.metrics.map((m) => (
              <div key={m.label} className="border-t border-foreground/20 pt-5">
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.05em] leading-none text-primary">{m.value}</dd>
                <dd className="mt-3 text-sm sm:text-base text-muted-foreground max-w-[16rem]">{m.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {item.chapters.map((c) => <Chapter key={c.title} n={++n} title={c.title} text={c.text} />)}

      {item.highlights && (
        <section className={`${SECTION_Y} border-t border-border`}>
          <div className={`${CONTAINER} grid gap-6 lg:grid-cols-12`}>
            <div className="lg:col-span-3"><SectionLabel n={++n}>{item.highlights.title}</SectionLabel></div>
            <ul className="lg:col-span-8 lg:col-start-5 grid sm:grid-cols-2 gap-x-8">
              {item.highlights.items.map((h, i) => (
                <li key={`${h}-${i}`} className="flex items-baseline gap-4 border-b border-border py-4">
                  <span className={`${EYEBROW} tabular-nums`}>{pad2(i + 1)}</span>
                  <span className="font-display text-lg sm:text-xl font-semibold tracking-[-0.02em]">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {lead && (
        <section aria-label="Gallery" className="pb-14 sm:pb-24 pt-2">
          <div className={`${CONTAINER} grid gap-4 sm:gap-6 md:grid-cols-2`}>
            <RevealImage src={lead} alt={`${item.title}, image 1`} sizes={HERO_SIZES} fallback={initials(item.title)} variant="natural" hideOnError className="md:col-span-2 rounded-[14px] sm:rounded-[18px]" />
            {rest.map((src, i) => {
              const solo = rest.length % 2 === 1 && i === rest.length - 1;
              return (
                <RevealImage
                  key={src}
                  src={src}
                  alt={`${item.title}, image ${i + 2}`}
                  sizes={solo ? HERO_SIZES : HALF_SIZES}
                  fallback={initials(item.title)}
                  variant="natural"
                  hideOnError
                  className={`self-start rounded-[14px] sm:rounded-[18px] ${solo ? 'md:col-span-2' : ''}`}
                />
              );
            })}
          </div>
        </section>
      )}

      {quote && (
        <section className={`tone-sand ${SECTION_Y}`}>
          <figure className={`${CONTAINER} max-w-5xl`}>
            <p className={`${EYEBROW} mb-8`}>In their words</p>
            <blockquote className={`font-display font-semibold tracking-[-0.03em] ${isShort(quote.quote) ? 'text-3xl sm:text-4xl lg:text-5xl leading-[1.1]' : 'text-2xl sm:text-3xl leading-[1.25]'}`}>
              &ldquo;{quote.quote}&rdquo;
            </blockquote>
            {quote.by && <figcaption className={`${EYEBROW} mt-8`}>{quote.by}</figcaption>}
          </figure>
        </section>
      )}

      {item.live && (
        <section className="border-t border-border">
          <a href={item.live} target="_blank" rel="noopener noreferrer" className={`group block ${FOCUS_RING}`}>
            <div className={`${CONTAINER} py-10 sm:py-14 flex items-center justify-between gap-6`}>
              <div className="min-w-0">
                <p className={`${EYEBROW} mb-2`}>{section.liveLabel}</p>
                <p className="font-display text-2xl sm:text-4xl font-semibold tracking-[-0.035em] break-words">{hostOf(item.live)}</p>
              </div>
              <span aria-hidden="true" className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground motion-safe:transition-transform motion-safe:duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </div>
          </a>
        </section>
      )}

      {next && (
        <section className="border-t border-border">
          <Link href={caseHref(next)} className={`group block ${FOCUS_RING}`}>
            <div className={`${CONTAINER} py-14 sm:py-24 grid gap-8 lg:grid-cols-12 lg:items-center`}>
              <div className="lg:col-span-6 min-w-0">
                <p className={`${EYEBROW} mb-4`}>Next case</p>
                <p className={`${H2} break-words motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:translate-x-3`}>{next.title}</p>
                <p className="mt-4 text-muted-foreground">{next.discipline}</p>
                <span aria-hidden="true" className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-full border border-border motion-safe:transition-colors group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                  <ArrowRight className="h-5 w-5 motion-safe:transition-transform motion-safe:duration-500 group-hover:translate-x-1" />
                </span>
              </div>
              <RevealImage
                src={next.image}
                alt=""
                sizes={NEXT_SIZES}
                fallback={initials(next.title)}
                className="lg:col-span-6 aspect-[16/10] rounded-[22px] group-hover:[&_[data-frame]]:-translate-y-2"
              />
            </div>
          </Link>
        </section>
      )}

      <PageCTA
        title="Want results like these?"
        subtitle="Tell us what you're making. We'll come back with a clear scope, timeline and fixed price."
        primary={{ label: 'Start a project' }}
        secondary={{ label: 'View all work', href: PORTFOLIO_ROUTE }}
      />
    </article>
  );
}
