import React from 'react';
import Image from 'next/image';

interface ServiceHeroProps {
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ title, description, imagePath, imageAlt }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl shadow-lg mb-16 premium-card mt-28 md:mt-36 lg:mt-44">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">{title}</span>
              <span className="block text-primary mt-2 premium-text-gradient">by FormiqStudio</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-xl text-muted-foreground">
              {description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a
                href="#features"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-lg transition-all duration-200 neon-glow-primary"
              >
                Explore Features
              </a>
              <a
                href="#pricing"
                className="px-8 py-3 border border-border text-base font-medium rounded-md text-foreground bg-card hover:bg-muted md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-lg transition-all duration-200"
              >
                View Pricing
              </a>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 rounded-xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform -rotate-3 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={imagePath}
                  alt={imageAlt}
                  width={500}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider - with padding to prevent text cutoff */}
      <div className="relative mt-16 text-card">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ServiceHero;
