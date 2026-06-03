'use client';

import { useState } from 'react';
import { Search, Check, X, ArrowRight, Globe, Server, Cloud, Mail, BarChart4, Shield, Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceFeatures from '@/components/services/ServiceFeatures';
import ServicePricing from '@/components/services/ServicePricing';
import ServiceFAQ from '@/components/services/ServiceFAQ';
import ServiceCTA from '@/components/services/ServiceCTA';
import ServiceTestimonials from '@/components/services/ServiceTestimonials';

// Domain extension options
const domainExtensions = [
  { name: '.com', price: 12.99, popular: true },
  { name: '.net', price: 14.99, popular: true },
  { name: '.org', price: 13.99, popular: true },
  { name: '.io', price: 39.99, popular: false },
  { name: '.co', price: 29.99, popular: false },
  { name: '.dev', price: 19.99, popular: false },
  { name: '.app', price: 17.99, popular: false },
  { name: '.ai', price: 79.99, popular: false },
  { name: '.tech', price: 49.99, popular: false },
  { name: '.store', price: 24.99, popular: false },
];

// Domain search results (integrate with actual domain API)
const searchDomainAvailability = async (domain: string) => {
  // TODO: Integrate with actual domain availability API
  // For now, return a realistic response structure
  return domainExtensions.map(ext => ({
    domain: `${domain}${ext.name}`,
    available: true, // In production, this would come from domain API
    price: ext.price,
    popular: ext.popular
  }));
};

// Features data
const features = [
  {
    title: 'Domain Privacy Protection',
    description: 'Keep your personal information private and protect yourself from spam, identity theft, and other online threats.',
    icon: <Shield className="h-6 w-6 text-white" />
  },
  {
    title: 'Auto-Renewal',
    description: 'Never worry about losing your domain. Our auto-renewal service ensures your domain stays registered.',
    icon: <Clock className="h-6 w-6 text-white" />
  },
  {
    title: 'Easy DNS Management',
    description: 'User-friendly DNS management interface to configure your domain settings with just a few clicks.',
    icon: <Zap className="h-6 w-6 text-white" />
  },
  {
    title: 'Domain Forwarding',
    description: 'Redirect visitors from one domain to another seamlessly with our domain forwarding service.',
    icon: <ArrowRight className="h-6 w-6 text-white" />
  },
  {
    title: 'Email Forwarding',
    description: 'Create professional email addresses with your domain and forward messages to your existing email.',
    icon: <Mail className="h-6 w-6 text-white" />
  },
  {
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you with any domain-related issues.',
    icon: <Globe className="h-6 w-6 text-white" />
  }
];

// Pricing tiers
const pricingTiers = [
  {
    name: 'Basic',
    price: '$12.99',
    description: 'Everything you need to register a single domain name.',
    features: [
      { name: 'Domain Registration (.com)', included: true },
      { name: 'DNS Management', included: true },
      { name: 'Email Forwarding', included: true },
      { name: 'Domain Forwarding', included: true },
      { name: 'Auto-Renewal', included: true },
      { name: 'Domain Privacy Protection', included: false },
      { name: 'Premium DNS', included: false },
      { name: 'Priority Support', included: false }
    ],
    buttonText: 'Register Domain',
    popular: false
  },
  {
    name: 'Premium',
    price: '$16.99',
    description: 'Enhanced protection and premium features for your domain.',
    features: [
      { name: 'Domain Registration (.com)', included: true },
      { name: 'DNS Management', included: true },
      { name: 'Email Forwarding', included: true },
      { name: 'Domain Forwarding', included: true },
      { name: 'Auto-Renewal', included: true },
      { name: 'Domain Privacy Protection', included: true },
      { name: 'Premium DNS', included: true },
      { name: 'Priority Support', included: false }
    ],
    buttonText: 'Register Domain',
    popular: true
  },
  {
    name: 'Business',
    price: '$24.99',
    description: 'Complete solution for businesses with multiple domains.',
    features: [
      { name: 'Domain Registration (.com)', included: true },
      { name: 'DNS Management', included: true },
      { name: 'Email Forwarding', included: true },
      { name: 'Domain Forwarding', included: true },
      { name: 'Auto-Renewal', included: true },
      { name: 'Domain Privacy Protection', included: true },
      { name: 'Premium DNS', included: true },
      { name: 'Priority Support', included: true }
    ],
    buttonText: 'Register Domain',
    popular: false
  }
];

// FAQ data
const faqs = [
  {
    question: 'How do I transfer my domain to formiqstudio?',
    answer: 'Transferring your domain is simple. You\'ll need to unlock your domain with your current registrar, obtain an authorization code, and then initiate the transfer process with us. Our support team can guide you through each step.'
  },
  {
    question: 'What is domain privacy protection?',
    answer: 'Domain privacy protection shields your personal information from being publicly visible in the WHOIS database. This helps prevent spam, identity theft, and unwanted solicitations.'
  },
  {
    question: 'How long does it take to register a domain?',
    answer: 'Most domain registrations are processed instantly. Once payment is confirmed, your domain will be active within minutes. However, some country-specific domains may take longer due to additional verification requirements.'
  },
  {
    question: 'Can I host my website with you after registering a domain?',
    answer: 'Absolutely! We offer comprehensive hosting solutions that integrate seamlessly with your domain. Our hosting packages include features like one-click WordPress installation, email accounts, and 24/7 support.'
  },
  {
    question: 'What happens if I don\'t renew my domain?',
    answer: 'If you don\'t renew your domain before it expires, it will enter a grace period where you can still renew it at the standard rate. After the grace period, there\'s a redemption period where you can recover the domain for an additional fee. If not renewed during this time, the domain will become available for anyone to register.'
  }
];

// Testimonials data
const testimonials = [
  {
    content: "I\'ve registered over 20 domains with formiqstudio for my various projects. Their domain management interface is intuitive and their customer support is exceptional.",
    author: {
      name: "Sarah Johnson",
      role: "Entrepreneur",
      company: "Digital Ventures",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    }
  },
  {
    content: "The domain privacy protection service has been invaluable for our business. We no longer receive spam calls and emails related to our domain registration.",
    author: {
      name: "Michael Chen",
      role: "CTO",
      company: "TechStart Inc.",
      image: "https://randomuser.me/api/portraits/men/2.jpg"
    }
  },
  {
    content: "Transferring our domains to formiqstudio was seamless. Their support team guided us through the entire process and answered all our questions promptly.",
    author: {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "Brand Solutions",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  }
];

export default function DomainSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    // Search domain availability
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const results = await searchDomainAvailability(searchTerm.trim().toLowerCase());
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching domains:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleDomainSelection = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <ServiceHero
        title="Find Your Perfect Domain Name"
        description="Secure your online identity with our premium domain registration service. Get the perfect domain name for your business, blog, or personal website."
        imagePath="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        imageAlt="Domain registration illustration"
      />

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Search for your domain name
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary focus:border-primary block w-full rounded-md pl-10 sm:text-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white py-3"
                placeholder="Enter your domain name"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {domainExtensions.filter(ext => ext.popular).map((ext) => (
              <button
                key={ext.name}
                onClick={() => {
                  setSearchTerm(searchTerm || 'example');
                  handleSearch({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {ext.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search Results</h2>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {searchResults.map((result) => (
                <li key={result.domain} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {result.available ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-3" />
                      )}
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {result.domain}
                      </span>
                      {result.popular && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary/70 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {result.available ? (
                        <>
                          <span className="text-lg font-medium text-gray-900 dark:text-white mr-4">
                            ${result.price}/year
                          </span>
                          <button
                            onClick={() => toggleDomainSelection(result.domain)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                              selectedDomains.includes(result.domain)
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-primary text-white hover:bg-primary/90'
                            } transition-colors`}
                          >
                            {selectedDomains.includes(result.domain) ? 'Selected' : 'Select'}
                          </button>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-red-500">
                          Not Available
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Domains Summary */}
          {selectedDomains.length > 0 && (
            <div className="mt-8 bg-primary/10 dark:bg-primary/10 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-primary dark:text-primary/70 mb-4">
                Selected Domains ({selectedDomains.length})
              </h3>
              <ul className="mb-6 space-y-2">
                {selectedDomains.map(domain => {
                  const domainInfo = searchResults.find(r => r.domain === domain);
                  return (
                    <li key={domain} className="flex justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{domain}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${domainInfo?.price}/year</span>
                    </li>
                  );
                })}
                <li className="flex justify-between pt-4 border-t border-primary/20 dark:border-primary/20">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${selectedDomains.reduce((sum, domain) => {
                      const domainInfo = searchResults.find(r => r.domain === domain);
                      return sum + (domainInfo?.price || 0);
                    }, 0).toFixed(2)}/year
                  </span>
                </li>
              </ul>
              <div className="flex justify-end">
                <Link href="/services/checkout" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      <ServiceFeatures
        title="Everything You Need for Domain Management"
        description="Our domain registration service comes with powerful features to help you manage your online presence."
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
        title="Ready to secure your domain name?"
        description="Get started today and establish your online presence."
        primaryButtonText="Search Domains"
        primaryButtonLink="#"
        secondaryButtonText="Contact Sales"
        secondaryButtonLink="/contact"
      />

      {/* Related Services */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary dark:text-primary/70 font-semibold tracking-wide uppercase">More Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Complete Your Online Presence
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Explore our other services to enhance your website and reach more customers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Web Hosting */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-primary dark:text-primary/70" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Web Hosting</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Fast and reliable hosting solutions for your website with 99.9% uptime guarantee.
                </p>
                <Link href="/services/hosting" className="text-primary dark:text-primary/70 font-medium hover:text-primary/80 inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Cloud Services */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-primary dark:text-primary/70" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cloud Services</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Scalable cloud solutions for businesses of all sizes with flexible resources.
                </p>
                <Link href="/services/cloud" className="text-primary dark:text-primary/70 font-medium hover:text-primary/80 inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Email Services */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary dark:text-primary/70" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Services</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Professional email solutions with your domain name for a consistent brand identity.
                </p>
                <Link href="/services/email" className="text-primary dark:text-primary/70 font-medium hover:text-primary/80 inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Marketing Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-primary dark:text-primary/70" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Marketing Tools</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive marketing tools to grow your online presence and reach more customers.
                </p>
                <Link href="/services/marketing" className="text-primary dark:text-primary/70 font-medium hover:text-primary/80 inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
