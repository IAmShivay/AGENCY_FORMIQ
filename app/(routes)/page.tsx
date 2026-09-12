import Hero from '@/components/Hero';
import SocialProofBar from '@/components/landing/SocialProofBar';
import Services from '@/components/Services';
import HowItWorks from '@/components/landing/HowItWorks';
import ComparisonSection from '@/components/landing/ComparisonSection';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <Services />
      <ComparisonSection />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
