import type { Metadata } from 'next';
import SectionIndex from '@/components/portfolio/SectionIndex';
import { SECTIONS } from '@/lib/portfolio-cases';
import { SEO_CONSTANTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Application case studies',
  description: 'Web and mobile applications designed and built by Formiq.',
  alternates: { canonical: `${SEO_CONSTANTS.SITE_URL}${SECTIONS['applications'].route}` },
};

export default function Page() {
  return (
    <SectionIndex
      section="applications"
      title={<>Application <span className="text-primary">portfolio</span></>}
      intro='Web and mobile products we have designed, built and shipped, from first prototype to launch.'
      cta={{ title: 'Have an application idea?', subtitle: "Let's turn your vision into a powerful digital solution that users will love.", primary: 'Start your project' }}
    />
  );
}
