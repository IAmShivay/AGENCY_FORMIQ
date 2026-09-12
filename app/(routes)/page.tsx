import Hero from '@/components/Hero';
import Services from '@/components/Services';
import PricingSection from '@/components/landing/PricingSection';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Services />
      <PricingSection />
      <Testimonials />
      <About />
      <Portfolio />
    </div>
  );
}
