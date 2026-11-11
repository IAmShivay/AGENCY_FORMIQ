'use client';

import {
  Megaphone, Search, Share2, Mail, PenTool,
  BarChart, Target, Rocket,
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const data = {
  badge: 'Digital marketing',
  badgeIcon: Megaphone,
  title: 'that delivers results',
  titleAccent: 'Digital marketing',
  subtitle:
    'We combine SEO, social media, email marketing, and content strategy into a data-driven approach that attracts qualified traffic and converts visitors into loyal customers.',
  services: [
    {
      title: 'SEO optimization',
      description: 'Technical and on-page SEO strategies that improve your search rankings and drive organic traffic.',
      icon: Search,
      features: ['Technical SEO audits', 'Keyword research & targeting', 'On-page optimization', 'Link building strategy'],
    },
    {
      title: 'Social media marketing',
      description: 'Strategic social media management that builds brand awareness and engages your target audience.',
      icon: Share2,
      features: ['Content calendar planning', 'Community management', 'Paid social campaigns', 'Performance analytics'],
    },
    {
      title: 'Email marketing',
      description: 'Automated email campaigns that nurture leads, retain customers, and drive repeat revenue.',
      icon: Mail,
      features: ['Campaign automation', 'Audience segmentation', 'A/B testing', 'Deliverability optimization'],
    },
    {
      title: 'Content strategy',
      description: 'High-quality, SEO-optimized content that establishes authority and supports the buyer journey.',
      icon: PenTool,
      features: ['Content planning', 'Blog & article writing', 'Landing page copy', 'Brand voice development'],
    },
  ],
  servicesTitle: 'Our marketing services',
  servicesSubtitle:
    'A full suite of digital marketing services designed to increase visibility, engagement, and conversions.',
  process: [
    {
      title: 'Audit & research',
      description: 'We analyze your current digital presence, competitors, and market opportunities to establish a baseline.',
      icon: BarChart,
      tools: ['Google Analytics review', 'SEO site audit', 'Competitor benchmarking', 'Audience analysis'],
      benefits: 'Reveals exactly where your marketing stands and where the biggest opportunities lie.',
    },
    {
      title: 'Strategy development',
      description: 'We craft a customized marketing plan with clear channels, messaging, and KPIs for each goal.',
      icon: Target,
      tools: ['Channel selection', 'Content roadmap', 'Budget allocation', 'KPI framework'],
      benefits: 'Provides a focused, actionable plan that maximizes impact within your budget.',
    },
    {
      title: 'Execute & create',
      description: 'Our team produces content, launches campaigns, and manages day-to-day marketing activities.',
      icon: PenTool,
      tools: ['Content production', 'Campaign management', 'Social scheduling', 'Email automation'],
      benefits: 'Delivers consistent, high-quality marketing execution across all chosen channels.',
    },
    {
      title: 'Optimize & scale',
      description: 'We continuously measure performance and refine strategies to improve results over time.',
      icon: Rocket,
      tools: ['Performance dashboards', 'A/B testing', 'Conversion tracking', 'Monthly reporting'],
      benefits: 'Ensures your marketing ROI improves month over month through data-driven optimization.',
    },
  ],
  processTitle: 'Our marketing process',
  processSubtitle:
    'A proven four-phase approach that turns marketing spend into measurable business growth.',
  ctaTitle: 'Ready to grow your brand?',
  ctaSubtitle:
    'Partner with our marketing experts to build a strategy that drives traffic, generates leads, and grows your revenue.',
  ctaIcon: Megaphone,
};

export default function DigitalMarketingPage() {
  return <ServicePageLayout {...data} />;
}
