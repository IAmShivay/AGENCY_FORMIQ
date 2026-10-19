import Hero from '@/components/Hero';
import TrustBar from '@/components/landing/TrustBar';
import HowItWorks from '@/components/landing/HowItWorks';
import Services from '@/components/Services';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';

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
