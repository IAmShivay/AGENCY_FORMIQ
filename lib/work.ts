export interface WorkShot {
  src: string;
  alt: string;
  label: string;
}

export type WorkStatus = 'client' | 'concept' | 'studio';

export const WORK_STATUS_LABEL: Record<WorkStatus, string> = {
  client: 'Client project',
  concept: 'Concept project',
  studio: 'Studio project',
};

export const WORK_STATUS_NOTE: Record<WorkStatus, string> = {
  client: '',
  concept: 'A self-initiated concept, designed and built end to end to show how we would approach the category. Not a client commission.',
  studio: 'Our own brand, designed, built and run by the studio.',
};

export interface WorkReel {
  full: string;
  loop: string;
  poster: string;
  label: string;
}

export interface WorkProject {
  slug: string;
  client: string;
  status: WorkStatus;
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
  reel?: WorkReel;
  accent: string;
  desktop: [WorkShot, WorkShot, WorkShot];
  mobile: [WorkShot, WorkShot, WorkShot];
}

export const WORK_ROUTE = '/work';
const CLOUDINARY_URL = 'https://res.cloudinary.com/dyiso4ohk';
const REELS_FOLDER = 'formiq/work';
const REELS_VIDEO_URL = `${CLOUDINARY_URL}/video/upload/${REELS_FOLDER}`;
const REELS_POSTER_URL = `${CLOUDINARY_URL}/image/upload/f_auto,q_auto/${REELS_FOLDER}`;
export const WORK_QUERY_KEY = 'work';

const shots = (slug: string, client: string, desktop: string[], mobile: string[]) => ({
  desktop: desktop.map((label, i) => ({ src: `/images/work/${slug}/desktop-${i + 1}.webp`, alt: `${client} website on desktop, ${label}`, label })) as WorkProject['desktop'],
  mobile: mobile.map((label, i) => ({ src: `/images/work/${slug}/mobile-${i + 1}.webp`, alt: `${client} website on mobile, ${label}`, label })) as WorkProject['mobile'],
});

const reel = (slug: string, label: string): WorkReel => ({
  full: `${REELS_VIDEO_URL}/${slug}-reel.mp4`,
  loop: `${REELS_VIDEO_URL}/${slug}-loop.mp4`,
  poster: `${REELS_POSTER_URL}/${slug}-poster.jpg`,
  label,
});

export const WORK: WorkProject[] = [
  {
    slug: 'nullforge',
    client: 'NULLFORGE',
    status: 'studio',
    headline: 'Desk gear you design yourself, proofed before it is made.',
    discipline: 'E-commerce',
    summary: 'Our own made-to-order brand for desk mats, keyboards, mice and full setups, with a live design studio and an AR preview.',
    services: ['Brand', 'E-commerce build', '3D & AR'],
    timeline: '',
    location: 'India · ships abroad',
    stack: ['Next.js', 'TypeScript', 'Three.js', 'model-viewer', 'GSAP', 'Zustand'],
    brief:
      'Custom desk gear usually means a vague form, a long email thread and a print you only see when it arrives. We wanted a store where people design the piece themselves, see it on their own desk and sign off a proof before anything is made.',
    approach: [
      { title: 'A live studio', text: 'Artwork, size and finish change the preview as you go, so what you design is what gets made.' },
      { title: 'On your desk, in AR', text: 'A true-size 3D mat to rotate on desktop, and to place on your real desk from your phone.' },
      { title: 'Proof before production', text: 'Nothing is made until the customer approves a proof, one piece at a time.' },
      { title: 'Priced where you are', text: 'Prices in rupees, with US dollars and pounds for orders from abroad.' },
    ],
    outcomes: [],
    reel: reel('nullforge', 'The NULLFORGE launch reel: storefront, studio and setups'),
    accent: '#1F0A0A',
    ...shots('nullforge', 'NULLFORGE', ['homepage hero', 'desk mat studio', 'AR desk preview'], ['homepage hero', 'desk mat studio', 'full setup']),
  },
  {
    slug: 'luxehouse',
    client: 'LuxeHouse',
    status: 'concept',
    headline: 'A furniture store that sells like a showroom.',
    discipline: 'E-commerce',
    summary: 'A concept storefront, product configurator and back office for a premium furniture brand.',
    services: ['Web design', 'E-commerce build', 'Admin & invoicing'],
    timeline: '8 weeks',
    location: 'Self-initiated',
    stack: ['React', 'TypeScript', 'Express', 'MongoDB', 'Cashfree', 'Cloudinary'],
    brief:
      'Premium furniture makers often sell beautifully in the showroom and badly online: custom orders live in WhatsApp threads, invoices are typed by hand and the catalogue is a folder of photos. LuxeHouse is our answer to what that store should be.',
    approach: [
      { title: 'Showroom first', text: 'Room photography, full-bleed, so every piece is seen where it will live, not cut out on white.' },
      { title: 'Configure before you call', text: 'Fabric, finish and size change the preview and the price live, so enquiries arrive already specified.' },
      { title: 'One back office', text: 'Orders, stock, gallery and GST invoices in a single dashboard, with invoices generated automatically.' },
      { title: 'Made for the phone', text: 'Mobile-first browsing, with a one-tap WhatsApp handoff for customers who would rather talk.' },
    ],
    outcomes: [],
    liveUrl: 'https://furniture.formiqstudio.in',
    reel: reel('luxehouse', 'A recorded walk through the LuxeHouse site'),
    accent: '#2B1A12',
    ...shots('luxehouse', 'LuxeHouse', ['homepage hero', 'shop by room', 'featured pieces'], ['homepage hero', 'product cards', 'featured pieces']),
  },
  {
    slug: 'clearcrm',
    client: 'ClearCRM',
    status: 'client',
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
