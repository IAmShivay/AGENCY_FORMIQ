import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyPage, { type CaseStudyMedia } from '@/components/case-study/CaseStudyPage';
import { OruHero, OruIdentity, OruPackaging, OruStore } from '@/components/case-study/example/OruVisuals';
import CaseBody from '@/components/work/CaseBody';
import { CASE_STUDIES, getCaseStudy, isPublished } from '@/lib/case-studies';
import { WORK, WORK_ROUTE, getWork } from '@/lib/work';
import { SEO_CONSTANTS } from '@/lib/seo';

const CASE_MEDIA: Record<string, CaseStudyMedia> = {
  'example-oru': { hero: <OruHero />, identity: <OruIdentity />, packaging: <OruPackaging />, web: <OruStore /> },
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...WORK.map((w) => ({ slug: w.slug })), ...CASE_STUDIES.filter(isPublished).map((c) => ({ slug: c.slug }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (work) {
    const url = `${SEO_CONSTANTS.SITE_URL}${WORK_ROUTE}/${work.slug}`;
    return {
      title: `${work.client}: ${work.headline} | Formiq`,
      description: work.summary,
      alternates: { canonical: url },
      openGraph: { title: `${work.client} — Case study`, description: work.summary, url, images: [{ url: work.desktop[0].src, alt: work.desktop[0].alt }] },
    };
  }
  const study = getCaseStudy(slug);
  if (!study || !isPublished(study)) return {};
  return {
    title: `${study.client} — Case study | Formiq`,
    description: study.summary,
    robots: study.example ? { index: false, follow: false } : undefined,
  };
}

export default async function CaseStudyRoute({ params }: Params) {
  const { slug } = await params;
  const work = getWork(slug);
  if (work) {
    return (
      <div className="pt-24 sm:pt-28">
        <CaseBody project={work} asPage />
      </div>
    );
  }
  const study = getCaseStudy(slug);
  const media = CASE_MEDIA[slug];
  if (!study || !media || !isPublished(study)) notFound();
  return <CaseStudyPage study={study} media={media} />;
}
