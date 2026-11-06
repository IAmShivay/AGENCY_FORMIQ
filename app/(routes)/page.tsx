import type { Metadata } from 'next';
import { SEO_CONSTANTS } from '@/lib/seo';
import Hero from '@/components/Hero';
import ServicesBand from '@/components/studio/ServicesBand';
import HowItWorks from '@/components/landing/HowItWorks';
import Services from '@/components/Services';
import PortfolioShowcase from '@/components/landing/PortfolioShowcase';
import Testimonials from '@/components/Testimonials';
import LatestBlogPosts from '@/components/landing/LatestBlogPosts';
import PricingSection from '@/components/landing/PricingSection';
import AIBookingAgents from '@/components/landing/AIBookingAgents';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'FormiqStudio — Brand, website & Shopify studio',
  description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
  keywords: ['FormiqStudio', ...SEO_CONSTANTS.KEYWORDS],
  alternates: { canonical: 'https://formiqstudio.in' },
  openGraph: {
    title: 'FormiqStudio — Get More Customers Without the Confusion',
    description: 'Brand identity, websites and Shopify stores for growing brands. Fixed quotes, clear timelines.',
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
      <Services />
      <div className="tone-sand"><HowItWorks /></div>
      <Testimonials />
      <AIBookingAgents />
      <PricingSection />
      <FAQSection />
      <LatestBlogPosts />
      <div className="tone-ember"><FinalCTA /></div>
    </div>
  );
}
