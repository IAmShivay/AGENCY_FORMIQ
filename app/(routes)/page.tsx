import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Portfolio from '@/components/Portfolio';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Portfolio />
    </div>
  );
}
