import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import ApplyForm from '@/components/careers/ApplyForm';
import { CAREERS_INTRO, HIRING_STEPS, NO_ROLES_COPY, PRINCIPLES } from '@/components/careers/careers-copy';
import { CONTAINER, EYEBROW, FOCUS_RING, H1, H2, SECTION_Y, pad2 } from '@/components/studio/ui';
import { CAREERS_ROUTE, getOpenRoles, roleHref, type JobOpening } from '@/lib/careers';
import { SEO_CONSTANTS } from '@/lib/seo';

export const revalidate = 0;

const APPLY_ANCHOR = 'apply';

export const metadata: Metadata = {
  title: 'Careers',
  description: CAREERS_INTRO,
  alternates: { canonical: `${SEO_CONSTANTS.SITE_URL}${CAREERS_ROUTE}` },
  openGraph: { title: 'Careers at Formiq', description: CAREERS_INTRO, url: `${SEO_CONSTANTS.SITE_URL}${CAREERS_ROUTE}` },
};

const groupByTeam = (roles: JobOpening[]) =>
  roles.reduce<Record<string, JobOpening[]>>((acc, r) => ({ ...acc, [r.team]: [...(acc[r.team] ?? []), r] }), {});

export default async function CareersPage() {
  const roles = await getOpenRoles();
  const teams = Object.entries(groupByTeam(roles));

  return (
    <div className="bg-background text-foreground">
      <header className="pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-20">
        <div className={CONTAINER}>
          <p className={`${EYEBROW} mb-6`}>(01) Careers</p>
          <h1 className={`${H1} max-w-5xl`}>Do the best work <span className="text-primary">of your career.</span></h1>
          <div className="mt-10 sm:mt-14 grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="lg:col-span-7 font-display text-xl sm:text-2xl lg:text-[1.75rem] font-medium leading-[1.35] tracking-[-0.02em] text-foreground/85">{CAREERS_INTRO}</p>
            <div className="lg:col-span-4 lg:col-start-9 flex flex-wrap gap-x-8 gap-y-3 lg:justify-end">
              <a href="#roles" className={`inline-flex min-h-11 items-center gap-2 font-semibold rounded-sm ${FOCUS_RING}`}>
                <span className="link-draw">Open roles</span> <span className={`${EYEBROW} tabular-nums`}>{pad2(roles.length)}</span>
              </a>
              <a href={`#${APPLY_ANCHOR}`} className={`inline-flex min-h-11 items-center gap-2 font-semibold rounded-sm ${FOCUS_RING}`}>
                <span className="link-draw">Apply</span> <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="principles-heading" className={`tone-sand ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <p className={`${EYEBROW} mb-5`}>(02) How we work</p>
          <h2 id="principles-heading" className={`${H2} max-w-3xl mb-12 sm:mb-16`}>A studio built around the work.</h2>
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="border-t border-foreground/20 pt-5">
                <span className={`${EYEBROW} tabular-nums`}>{pad2(i + 1)}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="roles" aria-labelledby="roles-heading" className={`${SECTION_Y} scroll-mt-24`}>
        <div className={CONTAINER}>
          <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <p className={`${EYEBROW} mb-5`}>(03) Open roles</p>
              <h2 id="roles-heading" className={H2}>Join the team</h2>
            </div>
            <span className={`${EYEBROW} tabular-nums`}>{pad2(roles.length)} open</span>
          </div>

          {teams.length === 0 ? (
            <div className="grid gap-6 border-y border-border py-10 sm:py-14 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em]">{NO_ROLES_COPY.title}</p>
                <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">{NO_ROLES_COPY.text}</p>
              </div>
              <div className="lg:col-span-4 flex lg:justify-end">
                <a href={`#${APPLY_ANCHOR}`} className={`inline-flex min-h-11 items-center gap-2 font-semibold rounded-sm ${FOCUS_RING}`}>
                  <span className="link-draw">Send an open application</span> <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-14">
              {teams.map(([team, list]) => (
                <div key={team}>
                  <h3 className={`${EYEBROW} pb-3 border-b border-foreground`}>{team} <span className="tabular-nums">· {pad2(list.length)}</span></h3>
                  <ul>
                    {list.map((r) => (
                      <li key={r.id}>
                        <Link href={roleHref(r)} className={`group grid grid-cols-[minmax(0,1fr)_2.75rem] sm:grid-cols-[minmax(0,1fr)_14rem_9rem_2.75rem] items-center gap-x-6 gap-y-1 py-6 sm:py-8 border-b border-border ${FOCUS_RING}`}>
                          <span className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight motion-safe:transition-transform motion-safe:duration-500 sm:group-hover:translate-x-2">{r.title}</span>
                          <span className="col-start-1 sm:col-start-auto text-sm text-muted-foreground">{r.location} · {r.work_mode}<span className="sm:hidden"> · {r.employment_type}</span></span>
                          <span className="hidden sm:block text-sm text-muted-foreground">{r.employment_type}</span>
                          <span aria-hidden="true" className="row-span-2 sm:row-span-1 col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="process-heading" className={`tone-ink ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <p className={`${EYEBROW} mb-5`}>(04) How we hire</p>
          <h2 id="process-heading" className={`${H2} max-w-3xl mb-12 sm:mb-16`}>Four steps, <span className="text-primary">no surprises.</span></h2>
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {HIRING_STEPS.map((s, i) => (
              <li key={s.title} className="border-t border-foreground/20 pt-5">
                <span className="font-display text-5xl font-bold tracking-[-0.05em] text-primary tabular-nums">{pad2(i + 1)}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id={APPLY_ANCHOR} aria-labelledby="apply-heading" className={`${SECTION_Y} scroll-mt-24`}>
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-4">
            <p className={`${EYEBROW} mb-5`}>(05) Open application</p>
            <h2 id="apply-heading" className={H2}>Show us your work.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-sm">Don&apos;t see your role? Tell us what you do best. We keep open applications on file and reach out when there&apos;s a fit.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ApplyForm />
          </div>
        </div>
      </section>
    </div>
  );
}
