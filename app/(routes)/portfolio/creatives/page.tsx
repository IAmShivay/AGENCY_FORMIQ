import type { Metadata } from 'next';
import SectionIndex from '@/components/portfolio/SectionIndex';
import { SECTIONS } from '@/lib/portfolio-cases';
import { SEO_CONSTANTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Creative case studies',
  description: 'Social creatives, video, print and brand collateral by Formiq.',
  alternates: { canonical: `${SEO_CONSTANTS.SITE_URL}${SECTIONS['creatives'].route}` },
};

export default function Page() {
  return (
    <SectionIndex
      section="creatives"
      title={<>Creative <span className="text-primary">design</span></>}
      intro='Brand identity, social content, video and marketing collateral that keeps a brand consistent everywhere.'
      cta={{ title: 'Need stunning creatives for your brand?', subtitle: 'From brand identity to social media content, we design everything your business needs.', primary: 'Start a project' }}
    />
  );
}
