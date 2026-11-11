'use client';

import {
  ShoppingCart, Users, Search, TrendingUp, BarChart3,
  Settings, Package, Target, Rocket,
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const data = {
  badge: 'E-commerce excellence',
  badgeIcon: ShoppingCart,
  title: 'management services',
  titleAccent: 'Marketplace',
  subtitle:
    'Dominate Amazon, Flipkart, and Meesho with our comprehensive marketplace management services. From account setup to advanced advertising strategies.',
  highlights: [
    {
      name: 'Amazon',
      description: "World's largest online marketplace",
      features: ['Product Listing', 'PPC Advertising', 'Brand Store', 'FBA Management'],
    },
    {
      name: 'Flipkart',
      description: "India's leading e-commerce platform",
      features: ['Seller Hub', 'Flipkart Ads', 'Plus Program', 'Fulfillment'],
    },
    {
      name: 'Meesho',
      description: 'Social commerce platform',
      features: ['Reseller Network', 'Social Selling', 'Zero Commission', 'Easy Returns'],
    },
  ],
  services: [
    {
      title: 'Account management',
      description: 'Complete marketplace account setup and ongoing management across all major platforms.',
      icon: Users,
      features: ['Profile setup', 'Verification process', 'Policy compliance', 'Account health monitoring'],
    },
    {
      title: 'Listing optimization',
      description: 'SEO-optimized product listings with professional images for maximum visibility and conversions.',
      icon: Search,
      features: ['Keyword research', 'Title optimization', 'Image enhancement', 'A+ content creation'],
    },
    {
      title: 'Advertising management',
      description: 'Strategic PPC campaigns and promotional activities that maximize your return on ad spend.',
      icon: TrendingUp,
      features: ['PPC campaigns', 'Sponsored product ads', 'Deal management', 'Budget optimization'],
    },
    {
      title: 'Performance analytics',
      description: 'Comprehensive reporting and data-driven optimization to continuously improve results.',
      icon: BarChart3,
      features: ['Sales reports', 'Traffic analysis', 'Competitor tracking', 'ROI metrics'],
    },
  ],
  servicesTitle: 'Complete marketplace solutions',
  servicesSubtitle:
    'From account setup to advanced optimization, we handle every aspect of your marketplace presence.',
  process: [
    {
      title: 'Account setup & optimization',
      description: 'We create and optimize your seller accounts across major marketplaces with complete profile setup and verification.',
      icon: Settings,
      tools: ['Account registration', 'Profile optimization', 'Verification process', 'Brand registry'],
      benefits: 'Establishes a professional presence across all major marketplaces with optimized seller profiles.',
    },
    {
      title: 'Product listing & catalog',
      description: 'Professional product listing creation with SEO-optimized titles, descriptions, and strategic keyword placement.',
      icon: Package,
      tools: ['SEO optimization', 'Image enhancement', 'Keyword research', 'Catalog management'],
      benefits: 'Increases product visibility and conversion rates through optimized, professional listings.',
    },
    {
      title: 'Advertising & campaigns',
      description: 'Strategic PPC campaigns and sponsored product ads across all platforms to maximize reach and drive sales.',
      icon: Target,
      tools: ['PPC campaigns', 'Sponsored ads', 'Keyword bidding', 'Campaign analytics'],
      benefits: 'Drives qualified traffic and increases sales through targeted, optimized advertising.',
    },
    {
      title: 'Analytics & optimization',
      description: 'Comprehensive performance tracking, competitor analysis, and continuous optimization for maximum profitability.',
      icon: BarChart3,
      tools: ['Sales analytics', 'Performance tracking', 'Competitor analysis', 'ROI optimization'],
      benefits: 'Provides data-driven insights for continuous improvement and maximized marketplace performance.',
    },
  ],
  processTitle: 'Our proven marketplace process',
  processSubtitle:
    'A systematic approach to marketplace success, from initial setup to ongoing optimization.',
  ctaTitle: 'Ready to dominate marketplaces?',
  ctaSubtitle:
    'Let us help you maximize your marketplace potential with our proven strategies and expert management.',
  ctaIcon: ShoppingCart,
};

export default function EcommerceMarketplacePage() {
  return <ServicePageLayout {...data} />;
}
