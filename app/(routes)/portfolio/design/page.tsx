import type { Metadata } from 'next';
import SectionIndex from '@/components/portfolio/SectionIndex';
import { SECTIONS } from '@/lib/portfolio-cases';
import { SEO_CONSTANTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Design case studies',
  description: 'Brand identity, UI/UX and packaging design by Formiq.',
  alternates: { canonical: `${SEO_CONSTANTS.SITE_URL}${SECTIONS['design'].route}` },
};

export default function Page() {
  return (
    <SectionIndex
      section="design"
      title={<>Design <span className="text-primary">portfolio</span></>}
      intro='Brand identities, interfaces and packaging, made to be recognised at a glance.'
      cta={{ title: 'Ready to transform your brand?', subtitle: "Let's collaborate to create designs that elevate your business and connect with your audience.", primary: 'Start a project' }}
    />
  );
}
