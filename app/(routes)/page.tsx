import Hero from '@/components/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/Testimonials';
import PricingSection from '@/components/landing/PricingSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import Services from '@/components/Services';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <ComparisonSection />
      <Services />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
