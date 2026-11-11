import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowLeft } from 'lucide-react';
import ApplyForm from '@/components/careers/ApplyForm';
import { CONTAINER, EYEBROW, FOCUS_RING, H1, H2, SECTION_Y, pad2 } from '@/components/studio/ui';
import { CAREERS_ROUTE, SCHEMA_EMPLOYMENT_TYPE, getOpenRole, roleHref, type JobOpening } from '@/lib/careers';
import { paragraphs } from '@/lib/portfolio-format';
import { SEO_CONSTANTS, generateBreadcrumbStructuredData } from '@/lib/seo';
import { STUDIO_ADDRESS } from '@/lib/studio-facts';

export const revalidate = 0;

const APPLY_ANCHOR = 'apply';
const VALIDITY_DAYS = 60;
const DAY_MS = 86_400_000;

type Params = { params: Promise<{ id: string }> };

const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const role = await getOpenRole((await params).id);
  if (!role) return {};
  const url = `${SEO_CONSTANTS.SITE_URL}${roleHref(role)}`;
  const title = `${role.title} — Careers`;
  const description = role.summary || `${role.title} at Formiq, ${role.location} (${role.work_mode}).`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

function List({ n, title, items }: { n: number; title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="border-t border-border pt-8 sm:pt-10">
      <h2 className={EYEBROW}>({pad2(n)}) {title}</h2>
      <ul className="mt-6 space-y-4">
        {items.map((item, i) => (
          <li key={`${item}-${i}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-base sm:text-lg leading-relaxed">
            <span className={`${EYEBROW} pt-1.5 tabular-nums`}>{pad2(i + 1)}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const jobPosting = (role: JobOpening) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: role.title,
  description: [role.summary, role.description, ...role.responsibilities, ...role.requirements].filter(Boolean).join('\n'),
  datePosted: role.created_at,
  validThrough: new Date(new Date(role.updated_at ?? role.created_at).getTime() + VALIDITY_DAYS * DAY_MS).toISOString(),
  employmentType: SCHEMA_EMPLOYMENT_TYPE[role.employment_type],
  hiringOrganization: { '@type': 'Organization', name: SEO_CONSTANTS.SITE_NAME, sameAs: SEO_CONSTANTS.SITE_URL },
  ...(role.work_mode === 'Remote'
    ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: STUDIO_ADDRESS.country } }
    : {
        jobLocation: {
          '@type': 'Place',
          address: { '@type': 'PostalAddress', streetAddress: STUDIO_ADDRESS.street, addressLocality: STUDIO_ADDRESS.city, addressRegion: STUDIO_ADDRESS.region, postalCode: STUDIO_ADDRESS.postalCode, addressCountry: STUDIO_ADDRESS.country },
        },
      }),
  directApply: true,
  url: `${SEO_CONSTANTS.SITE_URL}${roleHref(role)}`,
});

export default async function RolePage({ params }: Params) {
  const role = await getOpenRole((await params).id);
  if (!role) notFound();

  const meta = [
    { label: 'Team', value: role.team },
    { label: 'Location', value: role.location },
    { label: 'Work mode', value: role.work_mode },
    { label: 'Type', value: role.employment_type },
    { label: 'Salary', value: role.salary },
  ].filter((m) => m.value);
  const lists = [
    { title: 'What you will do', items: role.responsibilities },
    { title: 'What we are looking for', items: role.requirements },
    { title: 'Nice to have', items: role.nice_to_have },
  ].filter((l) => l.items.length);
  const about = paragraphs(role.description);

  return (
    <article className="bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(jobPosting(role))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(generateBreadcrumbStructuredData([
          { name: 'Careers', url: `${SEO_CONSTANTS.SITE_URL}${CAREERS_ROUTE}` },
          { name: role.title, url: `${SEO_CONSTANTS.SITE_URL}${roleHref(role)}` },
        ]))}
      />

      <header className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
        <div className={CONTAINER}>
          <Link href={CAREERS_ROUTE} className={`${EYEBROW} inline-flex min-h-11 items-center gap-2 hover:text-foreground transition-colors rounded-sm ${FOCUS_RING}`}>
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Careers / {role.team}
          </Link>
          <h1 className={`${H1} mt-6 max-w-5xl break-words`}>{role.title}</h1>
          {role.summary && <p className="mt-8 max-w-3xl font-display text-xl sm:text-2xl font-medium leading-[1.35] tracking-[-0.02em] text-foreground/85">{role.summary}</p>}
        </div>
      </header>

      <div className={`${CONTAINER} grid gap-12 pb-16 sm:pb-24 lg:grid-cols-12`}>
        <aside className="lg:col-span-4 lg:col-start-9 lg:row-start-1">
          <div className="lg:sticky lg:top-28 rounded-[22px] border border-border p-6 sm:p-7">
            <dl>
              {meta.map((m) => (
                <div key={m.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-border py-3.5 first:pt-0">
                  <dt className={`${EYEBROW} pt-0.5`}>{m.label}</dt>
                  <dd className="text-sm sm:text-base">{m.value}</dd>
                </div>
              ))}
            </dl>
            <a href={`#${APPLY_ANCHOR}`} className={`mt-6 btn-ink btn-ink-invert group/cta h-14 w-full px-7 bg-primary text-primary-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] ${FOCUS_RING}`}>
              Apply for this role <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </aside>

        <div className="lg:col-span-7 lg:row-start-1 space-y-10">
          {about.length > 0 && (
            <section>
              <h2 className={EYEBROW}>(01) About the role</h2>
              <div className="mt-6 space-y-5 text-base sm:text-lg leading-relaxed text-foreground/85">
                {about.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          )}
          {lists.map((l, i) => <List key={l.title} n={i + (about.length ? 2 : 1)} title={l.title} items={l.items} />)}
        </div>
      </div>

      <section id={APPLY_ANCHOR} aria-labelledby="apply-heading" className={`tone-sand ${SECTION_Y} scroll-mt-24`}>
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-4">
            <p className={`${EYEBROW} mb-5`}>Apply</p>
            <h2 id="apply-heading" className={H2}>{role.title}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-sm">A link to your work matters more than a long cover letter.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ApplyForm openingId={role.id} roleTitle={role.title} />
          </div>
        </div>
      </section>
    </article>
  );
}
