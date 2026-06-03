'use client';

import {
  Smartphone, Apple, TabletSmartphone, Layers,
  Lightbulb, Palette, Code, Rocket,
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const data = {
  badge: 'Mobile Development',
  badgeIcon: Smartphone,
  title: 'For iOS & Android',
  titleAccent: 'Mobile App Development',
  subtitle:
    'We build high-performance, cross-platform mobile applications using React Native that deliver native-quality experiences on every device.',
  highlights: [
    {
      name: 'iOS',
      description: 'Native-quality apps for iPhone and iPad',
      features: ['App Store optimization', 'Apple Pay integration', 'Push notifications', 'Widgets & extensions'],
      color: 'from-gray-800 to-gray-600',
    },
    {
      name: 'Android',
      description: 'Optimized for the full Android ecosystem',
      features: ['Material Design', 'Google Play publishing', 'Background services', 'Deep linking'],
      color: 'from-green-600 to-green-400',
    },
    {
      name: 'Cross-Platform',
      description: 'Single codebase, native performance',
      features: ['React Native', 'Shared business logic', 'Platform-specific UI', 'OTA updates'],
      color: 'from-primary to-primary/70',
    },
  ],
  services: [
    {
      title: 'iOS Development',
      description: 'Polished, performant apps designed for the Apple ecosystem with seamless device integration.',
      icon: Apple,
      features: ['Swift & React Native', 'App Store submission', 'In-app purchases', 'HealthKit & ARKit support'],
    },
    {
      title: 'Android Development',
      description: 'Feature-rich Android applications optimized for diverse screen sizes and hardware.',
      icon: Smartphone,
      features: ['Kotlin & React Native', 'Google Play deployment', 'Material Design 3', 'Background processing'],
    },
    {
      title: 'Cross-Platform Apps',
      description: 'Efficient development with a single codebase that delivers native experiences on both platforms.',
      icon: TabletSmartphone,
      features: ['React Native & Expo', 'Shared components', 'Native module bridging', 'Over-the-air updates'],
    },
    {
      title: 'UI/UX for Mobile',
      description: 'Intuitive, gesture-driven interfaces that follow platform conventions and delight users.',
      icon: Layers,
      features: ['Platform-specific patterns', 'Gesture navigation', 'Micro-interactions', 'Accessibility support'],
    },
  ],
  servicesTitle: 'Our Mobile Services',
  servicesSubtitle:
    'From native iOS and Android to cross-platform solutions, we cover the full mobile development spectrum.',
  process: [
    {
      title: 'Strategy & Research',
      description: 'We define your app vision, target audience, and technical approach through collaborative discovery.',
      icon: Lightbulb,
      tools: ['User personas', 'Feature prioritization', 'Platform strategy', 'Competitive analysis'],
      benefits: 'Aligns the product roadmap with real user needs and business objectives from day one.',
    },
    {
      title: 'Design & Prototyping',
      description: 'Our designers create interactive prototypes that validate UX decisions before development begins.',
      icon: Palette,
      tools: ['Figma prototypes', 'User flow mapping', 'Design system creation', 'Usability testing'],
      benefits: 'Reduces rework by validating the user experience early with real feedback.',
    },
    {
      title: 'Development & Testing',
      description: 'We build iteratively with automated testing and continuous integration for rock-solid quality.',
      icon: Code,
      tools: ['React Native & TypeScript', 'Jest & Detox', 'CI/CD pipelines', 'Device farm testing'],
      benefits: 'Delivers reliable, performant apps that work flawlessly across all target devices.',
    },
    {
      title: 'Launch & Growth',
      description: 'We handle app store submissions, analytics setup, and post-launch optimization.',
      icon: Rocket,
      tools: ['App Store & Play Store', 'Crashlytics & Sentry', 'Push notification setup', 'Analytics integration'],
      benefits: 'Ensures a successful launch and provides the tools for continuous improvement.',
    },
  ],
  processTitle: 'Our Mobile Process',
  processSubtitle:
    'A streamlined workflow that takes your app from concept to the app stores with confidence.',
  ctaTitle: 'Ready to Build Your App?',
  ctaSubtitle:
    'Let us create a mobile experience your users will love. Get in touch to discuss your project today.',
  ctaIcon: Smartphone,
};

export default function MobileAppDevelopmentPage() {
  return <ServicePageLayout {...data} />;
}
