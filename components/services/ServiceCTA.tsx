import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCTAProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}) => {
  return (
    <div className="bg-gradient-to-r from-primary to-accent">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
          <span className="block">{title}</span>
          <span className="block text-primary-foreground/80 mt-1">{description}</span>
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 gap-4">
          <Link
            href={primaryButtonLink}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-foreground bg-background hover:bg-background/90 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {primaryButtonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          {secondaryButtonText && secondaryButtonLink && (
            <Link
              href={secondaryButtonLink}
              className="inline-flex items-center justify-center px-5 py-3 border border-primary-foreground text-base font-medium rounded-md text-primary-foreground bg-transparent hover:bg-primary-foreground/10 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCTA;
