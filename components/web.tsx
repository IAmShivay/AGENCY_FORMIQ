'use client';

import {
  Globe, Code, Server, Cloud,
  Search, Palette, Wrench, Rocket,
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const data = {
  badge: 'Web Development',
  badgeIcon: Globe,
  title: 'That Drives Results',
  titleAccent: 'Web Development',
  subtitle:
    'We build fast, scalable, and SEO-friendly web applications using modern frameworks and best practices to help your business thrive online.',
  services: [
    {
      title: 'Frontend Development',
      description: 'Pixel-perfect, responsive interfaces built with React and Next.js for exceptional user experiences.',
      icon: Code,
      features: ['React & Next.js SPAs', 'Responsive design systems', 'Performance optimization', 'Accessibility compliance'],
    },
    {
      title: 'Backend Development',
      description: 'Robust server-side solutions with secure APIs, databases, and authentication systems.',
      icon: Server,
      features: ['RESTful & GraphQL APIs', 'Database architecture', 'Authentication & security', 'Third-party integrations'],
    },
    {
      title: 'Full-Stack Solutions',
      description: 'End-to-end application development from database design to polished user interfaces.',
      icon: Globe,
      features: ['End-to-end architecture', 'Real-time features', 'CMS integration', 'E-commerce platforms'],
    },
    {
      title: 'DevOps & Deployment',
      description: 'Automated CI/CD pipelines, containerization, and cloud infrastructure for reliable delivery.',
      icon: Cloud,
      features: ['CI/CD pipelines', 'Docker & Kubernetes', 'Cloud hosting (AWS/GCP)', 'Monitoring & logging'],
    },
  ],
  servicesTitle: 'Our Web Development Services',
  servicesSubtitle:
    'From interactive frontends to scalable backends, we deliver complete web solutions tailored to your business needs.',
  process: [
    {
      title: 'Discovery & Planning',
      description: 'We analyze your goals, audience, and technical requirements to define a clear project roadmap.',
      icon: Search,
      tools: ['Stakeholder interviews', 'User research', 'Technical audit', 'Competitive analysis'],
      benefits: 'Ensures every decision is grounded in real business objectives and user needs.',
    },
    {
      title: 'UI/UX Design',
      description: 'Our designers craft intuitive wireframes and high-fidelity prototypes that prioritize usability.',
      icon: Palette,
      tools: ['Figma prototyping', 'Design systems', 'Usability testing', 'Information architecture'],
      benefits: 'Delivers interfaces that delight users and drive higher engagement and conversions.',
    },
    {
      title: 'Agile Development',
      description: 'We build iteratively with sprint cycles, code reviews, and continuous integration for quality output.',
      icon: Wrench,
      tools: ['React & Next.js', 'TypeScript', 'Node.js & Express', 'PostgreSQL & MongoDB'],
      benefits: 'Produces clean, maintainable code that adapts to evolving requirements.',
    },
    {
      title: 'Launch & Support',
      description: 'We handle deployment, performance tuning, and provide ongoing maintenance after launch.',
      icon: Rocket,
      tools: ['Automated deployment', 'Performance monitoring', 'SEO optimization', 'Security patching'],
      benefits: 'Guarantees a smooth launch and long-term reliability with proactive support.',
    },
  ],
  processTitle: 'Our Development Process',
  processSubtitle:
    'A proven four-step workflow that turns your vision into a production-ready web application.',
  ctaTitle: 'Ready to Build Your Web App?',
  ctaSubtitle:
    'Partner with our expert team to create a high-performance web application that scales with your business.',
  ctaIcon: Rocket,
};

export default function WebDevelopmentPage() {
  return <ServicePageLayout {...data} />;
}
