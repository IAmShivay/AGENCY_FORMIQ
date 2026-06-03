import React from 'react';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
}

interface ServicePricingProps {
  title: string;
  description: string;
  tiers: PricingTier[];
}

const ServicePricing: React.FC<ServicePricingProps> = ({ title, description, tiers }) => {
  return (
    <div id="pricing" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary dark:text-primary/70 font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            {description}
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`relative p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col ${
                tier.popular ? 'border-2 border-primary dark:border-primary/70 lg:scale-105 z-10' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/mo</span>}
                </p>
                <p className="mt-6 text-gray-500 dark:text-gray-400">{tier.description}</p>

                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400" />
                      ) : (
                        <X className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      )}
                      <span className={`ml-3 text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/services/checkout"
                className={`mt-8 block w-full px-6 py-3 border border-transparent text-center rounded-md text-sm font-medium ${
                  tier.popular
                    ? 'text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg'
                    : 'text-primary bg-primary/10 hover:bg-primary/20 dark:text-primary/70 dark:bg-primary/10 dark:hover:bg-primary/20'
                } transition-all duration-200`}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicePricing;
