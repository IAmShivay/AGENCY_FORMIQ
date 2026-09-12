import Hero from '@/components/Hero';
import SocialProofBar from '@/components/landing/SocialProofBar';
import HowItWorks from '@/components/landing/HowItWorks';
import FounderSection from '@/components/landing/FounderSection';
import Services from '@/components/Services';
import ComparisonSection from '@/components/landing/ComparisonSection';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import ContactForm from '@/components/landing/ContactForm';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <FounderSection />
      <Services />
      <ComparisonSection />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <ContactForm />
      <FinalCTA />
    </div>
  );
}
