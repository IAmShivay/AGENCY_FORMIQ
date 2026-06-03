'use client';

import { Cloud, Check, ArrowRight, Shield, Zap, Clock, Server, Database } from 'lucide-react';
import Link from 'next/link';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceFeatures from '@/components/services/ServiceFeatures';
import ServiceCTA from '@/components/services/ServiceCTA';

// Features data
const features = [
  {
    title: 'Scalable Infrastructure',
    description: 'Scale your resources up or down based on demand with our flexible cloud infrastructure.',
    icon: <Cloud className="h-6 w-6 text-white" />
  },
  {
    title: 'High Availability',
    description: 'Our cloud services are designed for 99.99% uptime with redundant systems across multiple regions.',
    icon: <Check className="h-6 w-6 text-white" />
  },
  {
    title: 'Advanced Security',
    description: 'Enterprise-grade security with encryption, firewalls, and regular security audits.',
    icon: <Shield className="h-6 w-6 text-white" />
  },
  {
    title: 'Managed Databases',
    description: 'Fully managed database services with automatic backups, scaling, and high availability.',
    icon: <Database className="h-6 w-6 text-white" />
  },
  {
    title: 'Virtual Machines',
    description: 'Deploy virtual machines in seconds with your choice of operating system and configuration.',
    icon: <Server className="h-6 w-6 text-white" />
  },
  {
    title: 'Pay-as-you-go Pricing',
    description: 'Only pay for the resources you use with transparent pricing and no hidden fees.',
    icon: <Zap className="h-6 w-6 text-white" />
  }
];

export default function CloudServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <ServiceHero
        title="Cloud Services"
        description="Scalable cloud solutions for businesses of all sizes with flexible resources. Power your applications with our reliable cloud infrastructure."
        imagePath="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        imageAlt="Cloud computing illustration"
      />

      {/* Features Section */}
      <ServiceFeatures
        title="Enterprise-Grade Cloud Solutions"
        description="Our cloud services provide the reliability, performance, and security your business needs."
        features={features}
      />

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-card rounded-xl shadow-xl p-12 border border-border/20">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 neon-glow-primary">
            <Cloud className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">Coming Soon</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            We're working hard to bring you our cloud services. Please check back soon or contact us for more information.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/services/hosting"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Explore Hosting Options
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <ServiceCTA
        title="Interested in our cloud services?"
        description="Join our waitlist to be the first to know when our cloud services launch."
        primaryButtonText="Join Waitlist"
        primaryButtonLink="/contact"
        secondaryButtonText="Learn More"
        secondaryButtonLink="#"
      />
    </div>
  );
}
