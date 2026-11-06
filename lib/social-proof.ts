export type LogoStyle = 'display' | 'serif' | 'mono' | 'light' | 'wide';

export interface ClientLogo {
  name: string;
  logoSrc?: string;
  style?: LogoStyle;
  example?: boolean;
}

export interface VideoTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  videoSrc?: string;
  posterSrc?: string;
  captionsSrc?: string;
  duration?: string;
  caseStudyHref?: string;
  example?: boolean;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Northfold', style: 'display', example: true },
  { name: 'Kova', style: 'serif', example: true },
  { name: 'Meridian & Co', style: 'mono', example: true },
  { name: 'atelier lune', style: 'light', example: true },
  { name: 'Halden', style: 'display', example: true },
  { name: 'Solace', style: 'wide', example: true },
  { name: 'Oru', style: 'serif', example: true },
  { name: 'Vantage Labs', style: 'mono', example: true },
];

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    name: 'Example founder',
    role: 'Co-founder',
    company: 'Oru',
    quote: 'Our packaging finally looks like the product inside.',
    duration: '0:48',
    caseStudyHref: '/work/example-oru',
    example: true,
  },
  {
    name: 'Example client',
    role: 'Managing director',
    company: 'Northfold',
    quote: 'They understood the brief faster than our last two agencies.',
    duration: '1:05',
    example: true,
  },
  {
    name: 'Example client',
    role: 'Head of marketing',
    company: 'Meridian & Co',
    quote: 'The new site paid for itself in the first quarter.',
    duration: '0:52',
    example: true,
  },
];

export const SHOW_EXAMPLES = process.env.NODE_ENV !== 'production';

export const visibleItems = <T extends { example?: boolean }>(items: T[]) =>
  items.filter((i) => !i.example || SHOW_EXAMPLES);

export const hasExamples = <T extends { example?: boolean }>(items: T[]) => items.some((i) => i.example);
