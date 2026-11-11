import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyTemplate from './CaseStudyTemplate';
import { SECTIONS, caseHref, loadCase, type SectionKey } from '@/lib/portfolio-cases';
import { SEO_CONSTANTS } from '@/lib/seo';

export type CaseParams = { params: Promise<{ id: string }> };

export async function caseMetadata(section: SectionKey, { params }: CaseParams): Promise<Metadata> {
  const found = await loadCase(section, (await params).id);
  if (!found) return {};
  const { item } = found;
  const url = `${SEO_CONSTANTS.SITE_URL}${caseHref(item)}`;
  const title = `${item.title} — ${SECTIONS[section].label} case study`;
  return {
    title,
    description: item.summary,
    alternates: { canonical: url },
    openGraph: { type: 'article', title, description: item.summary, url, images: item.image ? [{ url: item.image, alt: item.title }] : undefined },
    twitter: { card: 'summary_large_image', title, description: item.summary, images: item.image ? [item.image] : undefined },
  };
}

export default async function CaseRoute({ section, params }: { section: SectionKey } & CaseParams) {
  const found = await loadCase(section, (await params).id);
  if (!found) notFound();
  return <CaseStudyTemplate {...found} />;
}
