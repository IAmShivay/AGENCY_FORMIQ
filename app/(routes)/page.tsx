import type { Metadata } from 'next';
import { SEO_CONSTANTS } from '@/lib/seo';
import Hero from '@/components/Hero';
import ServicesBand from '@/components/studio/ServicesBand';
import HowItWorks from '@/components/landing/HowItWorks';
import Services from '@/components/Services';
import PortfolioShowcase from '@/components/landing/PortfolioShowcase';
import ClientLogos from '@/components/ClientLogos';
import VideoTestimonials from '@/components/VideoTestimonials';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'FormiqStudio — Brand, website & Shopify studio',
  description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
  keywords: ['FormiqStudio', ...SEO_CONSTANTS.KEYWORDS],
  alternates: { canonical: 'https://formiqstudio.in' },
  openGraph: {
    title: 'Formiq — Brand, website & Shopify studio',
    description: 'Independent design studio for brand identity, websites and Shopify stores. Fixed quotes, clear timelines.',
    url: 'https://formiqstudio.in',
    siteName: 'FormiqStudio',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'FormiqStudio design and development studio' }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <ServicesBand />
      <div className="tone-ink"><PortfolioShowcase /></div>
      <ClientLogos />
      <Services />
      <div className="tone-sand"><HowItWorks /></div>
      <VideoTestimonials />
      <PricingSection />
      <FAQSection />
      <div className="tone-ember"><FinalCTA /></div>
    </div>
  );
}
