import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import TrustBar from '@/components/landing/TrustBar';
import HowItWorks from '@/components/landing/HowItWorks';
import Services from '@/components/Services';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'FormiqStudio — Website & Digital Marketing Agency in Kolkata, Durgapur & Asansol | Rs 6,999/mo',
  description: 'Get more customers without confusion. Website + Facebook & Instagram ads + Google Ads & SEO + social media — all included for Rs 6,999/month. 50+ local businesses in Kolkata, Durgapur & Asansol trust us. Live in 15 days, no lock-in.',
  keywords: [
    'FormiqStudio',
    'website development Kolkata',
    'digital marketing Durgapur',
    'web design Asansol',
    'Facebook ads Kolkata',
    'SEO services West Bengal',
  ],
  alternates: { canonical: 'https://formiqstudio.in' },
  openGraph: {
    title: 'FormiqStudio — Get More Customers Without the Confusion',
    description: 'Website + Ads + Social Media for Kolkata, Durgapur & Asansol. Rs 6,999/mo, live in 15 days, no lock-in.',
    url: 'https://formiqstudio.in',
    siteName: 'FormiqStudio',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'FormiqStudio local agency' }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Services />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
