'use client';

import { Mail, Check, ArrowRight, Shield, Zap, Clock, Server, Lock } from 'lucide-react';
import Link from 'next/link';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceFeatures from '@/components/services/ServiceFeatures';
import ServiceCTA from '@/components/services/ServiceCTA';
import { openLeadSheet } from '@/lib/lead-sheet';

// Features data
const features = [
  {
    title: 'Professional Email Addresses',
    description: 'Create professional email addresses with your domain name (you@yourdomain.com).',
    icon: <Mail className="h-6 w-6 text-primary-foreground" />
  },
  {
    title: 'Advanced Spam Protection',
    description: 'Our advanced spam filtering keeps your inbox clean and protects you from phishing attempts.',
    icon: <Shield className="h-6 w-6 text-primary-foreground" />
  },
  {
    title: 'Large Mailbox Storage',
    description: 'Get generous mailbox storage with options to upgrade as your needs grow.',
    icon: <Server className="h-6 w-6 text-primary-foreground" />
  },
  {
    title: 'Secure Encryption',
    description: 'All emails are encrypted in transit and at rest for maximum security and privacy.',
    icon: <Lock className="h-6 w-6 text-primary-foreground" />
  },
  {
    title: 'Mobile Access',
    description: 'Access your email from anywhere with our mobile apps for iOS and Android.',
    icon: <Zap className="h-6 w-6 text-primary-foreground" />
  },
  {
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you with any email issues.',
    icon: <Check className="h-6 w-6 text-primary-foreground" />
  }
];

export default function EmailServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <ServiceHero
        title="Professional Email Services"
        description="Create professional email addresses with your domain name for a consistent brand identity. Communicate with confidence using our secure and reliable email services."
        imagePath="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        imageAlt="Email services illustration"
      />

      {/* Features Section */}
      <ServiceFeatures
        title="Enterprise-Grade Email Solutions"
        description="Our email services provide the reliability, security, and professional features your business needs."
        features={features}
      />

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-card rounded-xl shadow-xl p-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">Coming Soon</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            We're working hard to bring you our email services. Please check back soon or contact us for more information.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button" onClick={openLeadSheet}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              href="/services/domains"
              className="inline-flex items-center px-6 py-3 border border-border text-base font-medium rounded-md text-foreground bg-card hover:bg-muted"
            >
              Register a Domain First
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <ServiceCTA
        title="Interested in our email services?"
        description="Join our waitlist to be the first to know when our email services launch."
        primaryButtonText="Join Waitlist"
        primaryButtonLink="/contact"
        secondaryButtonText="Learn More"
        secondaryButtonLink="#"
      />
    </div>
  );
}
