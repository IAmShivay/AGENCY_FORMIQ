'use client';

import { BarChart4, Check, ArrowRight, LineChart, PieChart, Share2, Users, Search, Mail } from 'lucide-react';
import Link from 'next/link';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceFeatures from '@/components/services/ServiceFeatures';
import ServiceCTA from '@/components/services/ServiceCTA';

// Features data
const features = [
  {
    title: 'SEO Tools',
    description: 'Optimize your website for search engines with our comprehensive SEO tools and analytics.',
    icon: <Search className="h-6 w-6 text-white" />
  },
  {
    title: 'Social Media Management',
    description: 'Manage all your social media accounts from one dashboard with scheduling and analytics.',
    icon: <Share2 className="h-6 w-6 text-white" />
  },
  {
    title: 'Email Marketing',
    description: 'Create and send professional email campaigns with templates, automation, and analytics.',
    icon: <Mail className="h-6 w-6 text-white" />
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your marketing performance with real-time analytics and customizable reports.',
    icon: <BarChart4 className="h-6 w-6 text-white" />
  },
  {
    title: 'Audience Insights',
    description: 'Understand your audience with demographic data, behavior analysis, and segmentation.',
    icon: <Users className="h-6 w-6 text-white" />
  },
  {
    title: 'Conversion Tracking',
    description: 'Track and optimize your conversion rates with our advanced tracking tools.',
    icon: <LineChart className="h-6 w-6 text-white" />
  }
];

export default function MarketingToolsPage() {
  return (
    <div>
      {/* Hero Section */}
      <ServiceHero
        title="Marketing Tools"
        description="Comprehensive marketing tools to grow your online presence and reach more customers. Boost your business with our all-in-one marketing platform."
        imagePath="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        imageAlt="Marketing analytics illustration"
      />

      {/* Features Section */}
      <ServiceFeatures
        title="All-in-One Marketing Platform"
        description="Our marketing tools provide everything you need to grow your business online."
        features={features}
      />

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 dark:bg-primary/10 rounded-full mb-6">
            <BarChart4 className="h-12 w-12 text-primary dark:text-primary/70" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Coming Soon</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We're working hard to bring you our marketing tools. Please check back soon or contact us for more information.
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
              href="/services/domains"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Explore Other Services
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <ServiceCTA
        title="Interested in our marketing tools?"
        description="Join our waitlist to be the first to know when our marketing platform launches."
        primaryButtonText="Join Waitlist"
        primaryButtonLink="/contact"
        secondaryButtonText="Learn More"
        secondaryButtonLink="#"
      />
    </div>
  );
}
