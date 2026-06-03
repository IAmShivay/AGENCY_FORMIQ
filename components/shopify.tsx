'use client';

import {
  ShoppingBag, Store, Palette, Puzzle, Zap,
  Search, Code, Wrench, Rocket,
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const data = {
  badge: 'Shopify Expert',
  badgeIcon: ShoppingBag,
  title: 'That Convert & Scale',
  titleAccent: 'Shopify Stores',
  subtitle:
    'We design and develop custom Shopify storefronts that combine stunning visuals with conversion-focused functionality to grow your e-commerce business.',
  services: [
    {
      title: 'Store Setup & Migration',
      description: 'Complete Shopify store setup or seamless migration from other platforms with zero downtime.',
      icon: Store,
      features: ['Full store configuration', 'Platform migration', 'Payment & shipping setup', 'Domain & DNS config'],
    },
    {
      title: 'Custom Theme Development',
      description: 'Bespoke Shopify themes built with Liquid and modern frontend tools for a unique brand experience.',
      icon: Palette,
      features: ['Custom Liquid themes', 'Responsive design', 'Speed optimization', 'Section-based editing'],
    },
    {
      title: 'App Integration',
      description: 'Strategic selection and integration of Shopify apps and custom solutions to extend store capabilities.',
      icon: Puzzle,
      features: ['Third-party app setup', 'Custom app development', 'API integrations', 'Workflow automation'],
    },
    {
      title: 'Performance Optimization',
      description: 'Speed, SEO, and conversion rate optimization to maximize your store revenue and visibility.',
      icon: Zap,
      features: ['Core Web Vitals tuning', 'SEO best practices', 'Conversion rate optimization', 'Analytics setup'],
    },
  ],
  servicesTitle: 'Our Shopify Services',
  servicesSubtitle:
    'End-to-end Shopify expertise from initial setup to ongoing optimization and growth.',
  process: [
    {
      title: 'Audit & Strategy',
      description: 'We evaluate your current store or business requirements and create a strategic development plan.',
      icon: Search,
      tools: ['Store audit', 'Competitor research', 'User journey mapping', 'Goal definition'],
      benefits: 'Identifies the highest-impact improvements to prioritize for maximum ROI.',
    },
    {
      title: 'Design & Branding',
      description: 'Our designers craft a conversion-focused storefront that reflects your brand identity.',
      icon: Palette,
      tools: ['Figma mockups', 'Brand guidelines', 'Mobile-first design', 'A/B test planning'],
      benefits: 'Creates a visually compelling store that builds trust and encourages purchases.',
    },
    {
      title: 'Build & Integrate',
      description: 'We develop your custom theme, configure apps, and connect all third-party systems.',
      icon: Code,
      tools: ['Shopify Liquid & CLI', 'JavaScript & TailwindCSS', 'Storefront API', 'Webhook integrations'],
      benefits: 'Delivers a fully functional, high-performance store ready for real-world traffic.',
    },
    {
      title: 'Launch & Optimize',
      description: 'We handle the launch checklist and provide ongoing support to continuously improve results.',
      icon: Rocket,
      tools: ['QA testing', 'Performance monitoring', 'SEO submission', 'Conversion tracking'],
      benefits: 'Ensures a flawless launch and sustained growth through data-driven optimization.',
    },
  ],
  processTitle: 'Our Shopify Process',
  processSubtitle:
    'A structured approach that takes your Shopify store from concept to launch and beyond.',
  ctaTitle: 'Ready to Launch Your Shopify Store?',
  ctaSubtitle:
    'Partner with our Shopify experts to build a store that looks great, performs fast, and converts visitors into customers.',
  ctaIcon: ShoppingBag,
};

export default function ShopifyDevelopmentPage() {
  return <ServicePageLayout {...data} />;
}
