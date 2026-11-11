export interface CaseStudySwatch {
  name: string;
  hex: string;
  onDark: boolean;
}

export interface CaseStudyTypeface {
  role: string;
  name: string;
  sample: string;
  className: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  title: string;
  summary: string;
  meta: { sector: string; services: string[]; year: string; location: string };
  brief: string;
  approach: { title: string; text: string }[];
  palette: CaseStudySwatch[];
  typefaces: CaseStudyTypeface[];
  results: { value: string; label: string }[];
  quote?: { text: string; name: string; role: string };
  credits: { role: string; names: string }[];
  example?: boolean;
}

export const CASE_STUDY_ROUTE = '/work';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'example-oru',
    example: true,
    client: 'Oru',
    title: 'A superfood brand that looks as honest as it tastes.',
    summary:
      'Identity, packaging and a Shopify store for a small-batch superfood company that sources moringa, turmeric and millet from family farms in South India.',
    meta: {
      sector: 'Food & wellness, D2C',
      services: ['Brand identity', 'Packaging', 'Shopify store'],
      year: '2026',
      location: 'Bengaluru · ships to UK & UAE',
    },
    brief:
      'Oru had a great product and a shelf full of look-alikes. Every competitor used the same green leaves, the same stock photos and the same promise. Oru needed a brand that felt premium enough for London and Dubai, without losing the warmth of where it comes from.',
    approach: [
      { title: 'One idea, everywhere', text: 'The sun-dried circle: a single mark that works on a pouch, a jar lid, a favicon and a shipping box.' },
      { title: 'Colour from the source', text: 'A palette taken from the ingredients themselves: forest moringa, turmeric, clay and rice paper.' },
      { title: 'Packaging that sells online', text: 'Pouches designed to read at thumbnail size first, so they win on the product grid before the shelf.' },
      { title: 'A store built to reorder', text: 'Subscriptions, bundles and a two-tap reorder flow on Shopify, with the brand carried into every screen.' },
    ],
    palette: [
      { name: 'Forest', hex: '#1F3B2D', onDark: true },
      { name: 'Turmeric', hex: '#E3A23B', onDark: false },
      { name: 'Clay', hex: '#B4532F', onDark: true },
      { name: 'Rice', hex: '#F3EDE0', onDark: false },
    ],
    typefaces: [
      { role: 'Display', name: 'Instrument Serif Italic', sample: 'Grown slowly.', className: 'font-serif italic font-normal' },
      { role: 'Text & interface', name: 'Bricolage Grotesque', sample: 'Moringa, 200 g', className: 'font-display font-medium' },
    ],
    results: [
      { value: '3.1×', label: 'Repeat purchase rate in the first six months' },
      { value: '42%', label: 'Orders on subscription' },
      { value: '5 wks', label: 'From brief to launch' },
    ],
    quote: {
      text: 'For the first time our packaging looks like the product inside: calm, honest and a little bit special.',
      name: 'Example founder',
      role: 'Co-founder, Oru',
    },
    credits: [
      { role: 'Strategy & identity', names: 'Formiq' },
      { role: 'Packaging', names: 'Formiq' },
      { role: 'Shopify development', names: 'Formiq' },
    ],
  },
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);

export const isPublished = (c: CaseStudy) => !c.example || process.env.NODE_ENV !== 'production';
