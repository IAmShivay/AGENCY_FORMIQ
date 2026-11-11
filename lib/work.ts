export interface WorkShot {
  src: string;
  alt: string;
  label: string;
}

export interface WorkProject {
  slug: string;
  client: string;
  headline: string;
  discipline: string;
  summary: string;
  services: string[];
  timeline: string;
  location: string;
  stack: string[];
  brief: string;
  approach: { title: string; text: string }[];
  outcomes: { value: string; label: string }[];
  liveUrl?: string;
  accent: string;
  desktop: [WorkShot, WorkShot, WorkShot];
  mobile: [WorkShot, WorkShot, WorkShot];
}

export const WORK_ROUTE = '/work';
export const WORK_QUERY_KEY = 'work';

const shots = (slug: string, client: string, desktop: string[], mobile: string[]) => ({
  desktop: desktop.map((label, i) => ({ src: `/images/work/${slug}/desktop-${i + 1}.webp`, alt: `${client} website on desktop, ${label}`, label })) as WorkProject['desktop'],
  mobile: mobile.map((label, i) => ({ src: `/images/work/${slug}/mobile-${i + 1}.webp`, alt: `${client} website on mobile, ${label}`, label })) as WorkProject['mobile'],
});

export const WORK: WorkProject[] = [
  {
    slug: 'luxehouse',
    client: 'LuxeHouse',
    headline: 'A furniture store that sells like a showroom.',
    discipline: 'E-commerce',
    summary: 'Storefront, product configurator and back office for a premium furniture brand taking on the national chains.',
    services: ['Web design', 'E-commerce build', 'Admin & invoicing'],
    timeline: '8 weeks',
    location: 'Durgapur, India',
    stack: ['React', 'TypeScript', 'Express', 'MongoDB', 'Cashfree', 'Cloudinary'],
    brief:
      'LuxeHouse makes furniture that holds its own against the big national brands, but online it looked like a local shop. Custom orders lived in WhatsApp threads, invoices were typed by hand and the catalogue was a folder of photos.',
    approach: [
      { title: 'Showroom first', text: 'Room photography, full-bleed, so every piece is seen where it will live, not cut out on white.' },
      { title: 'Configure before you call', text: 'Fabric, finish and size change the preview and the price live, so enquiries arrive already specified.' },
      { title: 'One back office', text: 'Orders, stock, gallery and GST invoices in a single dashboard, with invoices generated automatically.' },
      { title: 'Made for the phone', text: 'Mobile-first browsing, with a one-tap WhatsApp handoff for customers who would rather talk.' },
    ],
    outcomes: [
      { value: '40%', label: 'More enquiries in the first month' },
      { value: '3×', label: 'Faster invoicing with automated GST' },
    ],
    liveUrl: 'https://furniture.formiqstudio.in',
    accent: '#2B1A12',
    ...shots('luxehouse', 'LuxeHouse', ['homepage hero', 'shop by room', 'featured pieces'], ['homepage hero', 'product cards', 'featured pieces']),
  },
  {
    slug: 'clearcrm',
    client: 'ClearCRM',
    headline: 'One CRM for the way small teams really sell: on WhatsApp.',
    discipline: 'SaaS product',
    summary: 'A multi-workspace CRM with a visual WhatsApp flow builder, AI replies and a pipeline that runs from first message to invoice.',
    services: ['Product design', 'Full-stack build', 'AI automation'],
    timeline: '12 weeks',
    location: 'India · worldwide',
    stack: ['Next.js', 'TypeScript', 'MongoDB', 'WhatsApp Cloud API', 'Claude', 'RTK Query'],
    brief:
      'Small businesses were paying for six tools to do one job, and none of them spoke WhatsApp, where their customers actually are. ClearCRM needed to replace that stack with one product that felt simple on day one.',
    approach: [
      { title: 'Flows you can see', text: 'A drag-and-drop builder for WhatsApp conversations, so teams design automations without writing code.' },
      { title: 'Message to invoice', text: 'One pipeline from first reply to paid invoice, with GST handled and nothing re-typed between tools.' },
      { title: 'AI that drafts, people decide', text: 'Claude drafts replies and scores leads; the team approves, edits or overrides in one tap.' },
      { title: 'A workspace per team', text: 'Multi-tenant from the start, with roles and permissions, priced per workspace instead of per seat.' },
    ],
    outcomes: [
      { value: '80%', label: 'Faster first response to new leads' },
      { value: '15+ hrs', label: 'Saved per team, every week' },
    ],
    liveUrl: 'https://crm.formiqstudio.in',
    accent: '#0F1E3D',
    ...shots('clearcrm', 'ClearCRM', ['homepage hero', 'feature overview', 'comparison table'], ['homepage hero', 'feature cards', 'customer stories']),
  },
];

export const getWork = (slug: string | null | undefined) => WORK.find((w) => w.slug === slug);

export const nextWork = (slug: string) => {
  const i = WORK.findIndex((w) => w.slug === slug);
  return WORK[(i + 1) % WORK.length];
};

export const workIndex = (slug: string) => WORK.findIndex((w) => w.slug === slug) + 1;

export const hostOf = (url?: string) => (url ? new URL(url).host : '');

export const CASE_OVERLAY_OPEN_CLASS = 'case-overlay-open';
