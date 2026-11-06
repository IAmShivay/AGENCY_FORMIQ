import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyPage, { type CaseStudyMedia } from '@/components/case-study/CaseStudyPage';
import { OruHero, OruIdentity, OruPackaging, OruStore } from '@/components/case-study/example/OruVisuals';
import { CASE_STUDIES, getCaseStudy, isPublished } from '@/lib/case-studies';

const CASE_MEDIA: Record<string, CaseStudyMedia> = {
  'example-oru': { hero: <OruHero />, identity: <OruIdentity />, packaging: <OruPackaging />, web: <OruStore /> },
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.filter(isPublished).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study || !isPublished(study)) return {};
  return {
    title: `${study.client} — Case study | Formiq`,
    description: study.summary,
    robots: study.example ? { index: false, follow: false } : undefined,
  };
}

export default async function CaseStudyRoute({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const media = CASE_MEDIA[slug];
  if (!study || !media || !isPublished(study)) notFound();
  return <CaseStudyPage study={study} media={media} />;
}
