import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceFeaturesProps {
  title: string;
  description: string;
  features: Feature[];
}

const ServiceFeatures: React.FC<ServiceFeaturesProps> = ({ title, description, features }) => {
  return (
    <div id="features" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            {title}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
            {description}
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <div key={index} className="relative bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/20">
                <div className="absolute -top-4 -left-4 bg-primary rounded-xl p-3 shadow-lg neon-glow-primary">
                  {feature.icon}
                </div>
                <div className="ml-4 mt-4">
                  <h3 className="text-lg font-medium text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatures;
