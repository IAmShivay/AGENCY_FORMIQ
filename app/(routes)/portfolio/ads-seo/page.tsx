import type { Metadata } from 'next';
import SectionIndex from '@/components/portfolio/SectionIndex';
import { SECTIONS } from '@/lib/portfolio-cases';
import { SEO_CONSTANTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Ads & SEO case studies',
  description: 'Meta ads, Google ads and SEO results delivered by Formiq.',
  alternates: { canonical: `${SEO_CONSTANTS.SITE_URL}${SECTIONS['ads-seo'].route}` },
};

export default function Page() {
  return (
    <SectionIndex
      section="ads-seo"
      title={<>Ads &amp; <span className="text-primary">SEO</span></>}
      intro='Meta, Google and search campaigns, measured on the numbers that matter to the business.'
      cta={{ title: 'Ready to scale your business with ads & SEO?', subtitle: 'Get a free audit of your current campaigns and discover growth opportunities.', primary: 'Get free audit' }}
    />
  );
}
