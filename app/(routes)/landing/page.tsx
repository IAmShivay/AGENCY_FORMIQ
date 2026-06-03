import LandingHero from '@/components/landing/LandingHero';
import ProblemSolution from '@/components/landing/ProblemSolution';
import BenefitsSection from '@/components/landing/BenefitsSection';
import SocialProof from '@/components/landing/SocialProof';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import PortfolioShowcase from '@/components/landing/PortfolioShowcase';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import ContactForm from '@/components/landing/ContactForm';

export const metadata = {
  title: 'Transform Your Business with Custom Software Solutions | FormiqStudio',
  description: 'Get custom software development, web applications, and digital solutions that drive real results. Trusted by 500+ businesses. Free consultation available.',
  keywords: 'custom software development, web development, digital transformation, business automation',
  openGraph: {
    title: 'Transform Your Business with Custom Software Solutions',
    description: 'Get custom software development, web applications, and digital solutions that drive real results. Trusted by 500+ businesses.',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <LandingHero />
      <SocialProof />
      <BenefitsSection />
      <FeaturesShowcase />
      <PortfolioShowcase />
      {/* <ProblemSolution /> */}
      {/* <PricingSection /> */}
      {/* <FAQSection /> */}
      {/* <ContactForm /> */}
      {/* <FinalCTA /> */}
    </div>
  );
}
