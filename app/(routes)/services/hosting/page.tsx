'use client';

import { Server, Check, ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceFeatures from '@/components/services/ServiceFeatures';
import ServicePricing from '@/components/services/ServicePricing';
import ServiceFAQ from '@/components/services/ServiceFAQ';
import ServiceCTA from '@/components/services/ServiceCTA';
import ServiceTestimonials from '@/components/services/ServiceTestimonials';

// Features data
const features = [
  {
    title: 'SSD Storage',
    description: 'All our hosting plans come with fast SSD storage for better performance and reliability.',
    icon: <Zap className="h-6 w-6 text-white" />
  },
  {
    title: 'Free SSL Certificates',
    description: 'Secure your website with free SSL certificates included with all hosting plans.',
    icon: <Shield className="h-6 w-6 text-white" />
  },
  {
    title: '99.9% Uptime Guarantee',
    description: 'We guarantee 99.9% uptime for your website with our reliable hosting infrastructure.',
    icon: <Clock className="h-6 w-6 text-white" />
  },
  {
    title: 'One-Click Installations',
    description: 'Install popular applications like WordPress, Joomla, and more with just one click.',
    icon: <ArrowRight className="h-6 w-6 text-white" />
  },
  {
    title: 'Daily Backups',
    description: 'Your data is automatically backed up daily to ensure you never lose your website content.',
    icon: <Server className="h-6 w-6 text-white" />
  },
  {
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you with any hosting issues.',
    icon: <Check className="h-6 w-6 text-white" />
  }
];

// Pricing tiers
const pricingTiers = [
  {
    name: 'Basic',
    price: '$5.99',
    description: 'Perfect for small websites and blogs.',
    features: [
      { name: '1 Website', included: true },
      { name: '10 GB SSD Storage', included: true },
      { name: 'Unmetered Bandwidth', included: true },
      { name: 'Free SSL Certificate', included: true },
      { name: '24/7 Support', included: true },
      { name: 'Daily Backups', included: false },
      { name: 'Free Domain', included: false },
      { name: 'Priority Support', included: false }
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    price: '$9.99',
    description: 'Great for growing businesses and e-commerce.',
    features: [
      { name: 'Unlimited Websites', included: true },
      { name: '50 GB SSD Storage', included: true },
      { name: 'Unmetered Bandwidth', included: true },
      { name: 'Free SSL Certificate', included: true },
      { name: '24/7 Priority Support', included: true },
      { name: 'Daily Backups', included: true },
      { name: 'Free Domain for 1 Year', included: true },
      { name: 'Priority Support', included: false }
    ],
    buttonText: 'Get Started',
    popular: true
  },
  {
    name: 'Business',
    price: '$19.99',
    description: 'Advanced features for high-traffic websites.',
    features: [
      { name: 'Unlimited Websites', included: true },
      { name: '100 GB SSD Storage', included: true },
      { name: 'Unmetered Bandwidth', included: true },
      { name: 'Free SSL Certificate', included: true },
      { name: '24/7 Premium Support', included: true },
      { name: 'Daily Backups', included: true },
      { name: 'Free Domain for 1 Year', included: true },
      { name: 'Priority Support', included: true }
    ],
    buttonText: 'Get Started',
    popular: false
  }
];

// FAQ data
const faqs = [
  {
    question: 'What is web hosting?',
    answer: 'Web hosting is a service that allows organizations and individuals to post a website or web page onto the Internet. A web host, or web hosting service provider, is a business that provides the technologies and services needed for the website or webpage to be viewed on the Internet.'
  },
  {
    question: 'What type of hosting do I need?',
    answer: 'The type of hosting you need depends on your website requirements. Shared hosting is good for small websites and blogs, VPS hosting is suitable for growing websites with moderate traffic, and dedicated hosting is ideal for large websites with high traffic volumes.'
  },
  {
    question: 'Can I upgrade my hosting plan later?',
    answer: 'Yes, you can easily upgrade your hosting plan as your website grows. Our scalable hosting solutions allow you to upgrade to a higher plan with more resources without any downtime.'
  },
  {
    question: 'Do you offer a money-back guarantee?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all our hosting plans. If you\'re not satisfied with our service within the first 30 days, you can request a full refund.'
  },
  {
    question: 'How do I migrate my existing website to your hosting?',
    answer: 'We offer free website migration services for all new customers. Our technical team will handle the entire migration process, ensuring your website is transferred without any data loss or downtime.'
  }
];

// Testimonials data
const testimonials = [
  {
    content: "I\'ve been using formiqstudio hosting for my e-commerce store for over a year now, and I\'m extremely impressed with their service. The website loads fast, and their customer support is exceptional.",
    author: {
      name: "David Wilson",
      role: "E-commerce Owner",
      company: "Fashion Trends",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
    }
  },
  {
    content: "After switching to formiqstudio hosting, my website\'s loading speed improved significantly. Their one-click WordPress installation made setting up my blog a breeze.",
    author: {
      name: "Jennifer Lee",
      role: "Blogger",
      company: "Travel Adventures",
      image: "https://randomuser.me/api/portraits/women/5.jpg"
    }
  },
  {
    content: "The uptime and reliability of formiqstudio hosting have been outstanding. In the past six months, my website has experienced zero downtime, which is crucial for my online business.",
    author: {
      name: "Robert Brown",
      role: "CEO",
      company: "Digital Solutions",
      image: "https://randomuser.me/api/portraits/men/6.jpg"
    }
  }
];

export default function HostingPage() {
  return (
    <div>
      {/* Hero Section */}
      <ServiceHero
        title="Web Hosting Solutions"
        description="Fast, reliable, and secure hosting for your website with 99.9% uptime guarantee. Get your website online today with our high-performance hosting services."
        imagePath="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        imageAlt="Web hosting servers illustration"
      />

      {/* Features Section */}
      <ServiceFeatures
        title="Everything You Need for Web Hosting"
        description="Our web hosting service comes with powerful features to help you build and manage your website."
        features={features}
      />

      {/* Pricing Section */}
      <ServicePricing
        title="Simple, Transparent Pricing"
        description="Choose the plan that's right for you."
        tiers={pricingTiers}
      />

      {/* Testimonials Section */}
      <ServiceTestimonials testimonials={testimonials} />

      {/* FAQ Section */}
      <ServiceFAQ faqs={faqs} />

      {/* CTA Section */}
      <ServiceCTA
        title="Ready to get your website online?"
        description="Get started today with our reliable hosting services."
        primaryButtonText="Get Started"
        primaryButtonLink="/services/checkout"
        secondaryButtonText="Contact Sales"
        secondaryButtonLink="/contact"
      />
    </div>
  );
}
