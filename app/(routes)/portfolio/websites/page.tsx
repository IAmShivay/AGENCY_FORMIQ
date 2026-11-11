import type { Metadata } from 'next';
import SectionIndex from '@/components/portfolio/SectionIndex';
import { SECTIONS } from '@/lib/portfolio-cases';
import { SEO_CONSTANTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Website case studies',
  description: 'Websites, storefronts and web platforms designed and built by Formiq.',
  alternates: { canonical: `${SEO_CONSTANTS.SITE_URL}${SECTIONS['websites'].route}` },
};

export default function Page() {
  return (
    <SectionIndex
      section="websites"
      title={<>Website <span className="text-primary">development</span></>}
      intro='Sites and web platforms we have designed and built, each written up as a case study.'
      cta={{ title: 'Ready to elevate your web presence?', subtitle: "Let's create a website that drives results and provides exceptional user experiences.", primary: 'Start a project' }}
    />
  );
}
