import { supabase } from './supabaseClient';

// Types for portfolio data
export interface WebsiteProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  category: string;
  completion_date: string;
  features: string[];
  live_link: string;
  repo_link: string;
  case_study_challenge: string;
  case_study_solution: string;
  case_study_results: string;
  case_study_testimonial: string;
  case_study_screens: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AppProject {
  id: string;
  title: string;
  category?:string;
  live_link?:string;
  description: string;
  image: string;
  tags: string[];
  platforms: string[];
  link: string;
  features: string[];
  year: string;
  created_at?: string;
  updated_at?: string;
}

export interface DesignProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  live_link?:string;
  client: string;
  link: string;
  year: string;
  services: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreativeProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client: string;
  deliverables: string[];
  tags: string[];
  media_urls: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AdsSeoProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  client: string;
  platform: string;
  results: string[];
  tags: string[];
  metrics: { label: string; value: string }[];
  media_urls: string[];
  created_at?: string;
  updated_at?: string;
}

// Fallback data for static generation and error cases
const fallbackWebsites: WebsiteProject[] = [
  {
    id: '1',
    title: 'LuxeHouse - Premium Furniture E-commerce',
    description: 'Built a complete e-commerce platform for a premium furniture brand in Durgapur. Features custom product configurator, Cashfree payment integration, invoice generation with GST support, and admin dashboard.',
    image: '/images/portfolio/website-1.jpg',
    tags: ['React', 'Vite', 'TypeScript', 'Express', 'MongoDB', 'Cashfree', 'Cloudinary', 'PM2'],
    link: 'https://furniture.formiqstudio.in',
    category: 'E-Commerce',
    completion_date: '2025',
    features: ['Product Configurator', 'Admin Dashboard', 'Invoice Generator', 'Gallery Management', 'Cashfree Payments', 'WhatsApp Integration'],
    live_link: 'https://furniture.formiqstudio.in',
    repo_link: '',
    case_study_challenge: 'LuxeHouse needed a professional online presence to compete with national furniture brands while managing custom orders, invoices, and inventory from a single dashboard.',
    case_study_solution: 'We built a full-stack e-commerce platform with real-time product customization, automated invoice generation with GST calculations, and integrated WhatsApp for customer communication.',
    case_study_results: '40% increase in customer inquiries, 3x faster invoice processing, professional online presence matching national competitors',
    case_study_testimonial: '',
    case_study_screens: []
  },
  {
    id: '2',
    title: 'ClearCRM - SaaS CRM Platform',
    description: 'Enterprise-grade CRM with WhatsApp Business integration, AI-powered chatbot flows, visual workflow builder, lead management, and multi-tenant architecture.',
    image: '/images/portfolio/website-2.jpg',
    tags: ['Next.js', 'TypeScript', 'MongoDB', 'WhatsApp Cloud API', 'Claude AI', 'RTK Query'],
    link: 'https://crm.formiqstudio.in',
    category: 'SaaS',
    completion_date: '2025',
    features: ['WhatsApp Bot Builder', 'Lead Pipeline', 'Invoice Management', 'AI Auto-replies', 'Team Collaboration', 'Multi-workspace'],
    live_link: 'https://crm.formiqstudio.in',
    repo_link: '',
    case_study_challenge: 'Businesses needed an affordable CRM that natively integrates WhatsApp Business for Indian market communication patterns.',
    case_study_solution: 'Built a multi-tenant SaaS CRM with visual WhatsApp flow builder, AI-powered auto-replies, and complete lead-to-invoice pipeline.',
    case_study_results: 'Serving multiple businesses, 80% faster lead response time, automated follow-ups saving 15+ hours/week',
    case_study_testimonial: '',
    case_study_screens: []
  },
  {
    id: '3',
    title: 'ShivayDev - Developer Portfolio',
    description: 'Modern developer portfolio showcasing projects, skills, and experience with smooth animations and responsive design.',
    image: '/images/portfolio/website-3.jpg',
    tags: ['React', 'Vite', 'TailwindCSS', 'Framer Motion'],
    link: 'https://shivaydev.formiqstudio.in',
    category: 'Portfolio',
    completion_date: '2025',
    features: ['Project Showcase', 'Skills Matrix', 'Contact Form', 'Responsive Design'],
    live_link: 'https://shivaydev.formiqstudio.in',
    repo_link: '',
    case_study_challenge: '',
    case_study_solution: '',
    case_study_results: '',
    case_study_testimonial: '',
    case_study_screens: []
  }
];

const fallbackApps: AppProject[] = [
  {
    id: '1',
    title: 'JourneyLogs - Travel Blog Platform',
    description: 'A travel blogging platform where users can document their journeys with rich media, maps, and social features. Deployed on Cloudflare Workers for global edge performance.',
    image: '/images/portfolio/app-1.jpg',
    tags: ['TanStack Start', 'Supabase', 'Cloudflare Workers', 'TypeScript'],
    platforms: ['Web'],
    link: '#',
    features: ['Rich Text Editor', 'Media Uploads', 'Map Integration', 'Social Sharing'],
    year: '2025'
  }
];

const fallbackDesigns: DesignProject[] = [
  {
    id: '1',
    title: 'FormiqStudio Brand Identity',
    description: 'Complete brand identity system including logo design, color palette, typography guide, social media templates, and marketing collateral for the agency itself.',
    image: '/images/portfolio/design-1.jpg',
    category: 'Branding',
    client: 'FormiqStudio',
    link: '#',
    year: '2025',
    services: ['Logo Design', 'Brand Guidelines', 'Social Media Templates', 'Business Cards', 'Pitch Deck']
  },
  {
    id: '2',
    title: 'Annvaya - Superfoods Brand',
    description: 'Brand identity and packaging design for an organic superfoods and herbal products company. Earthy, premium aesthetic targeting health-conscious urban consumers.',
    image: '/images/portfolio/design-2.jpg',
    category: 'Branding & Packaging',
    client: 'Annvaya',
    link: '#',
    year: '2025',
    services: ['Logo Design', 'Packaging Design', 'Brand Guidelines', 'Social Media Creatives']
  }
];

// Function to get all website projects
export async function getWebsiteProjects(): Promise<WebsiteProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching website projects:', error);
      return fallbackWebsites;
    }

    return data as WebsiteProject[];
  } catch (error) {
    console.error('Error in getWebsiteProjects:', error);
    return fallbackWebsites;
  }
}

// Function to get a single website project by id
export async function getWebsiteProject(id: string): Promise<WebsiteProject | null> {
  try {
    const { data, error } = await supabase
      .from('portfolio_websites')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching website project:', error);
      return fallbackWebsites.find(project => project.id === id) || null;
    }

    return data as WebsiteProject;
  } catch (error) {
    console.error('Error in getWebsiteProject:', error);
    return fallbackWebsites.find(project => project.id === id) || null;
  }
}

// Function to get website projects by category
export async function getWebsiteProjectsByCategory(category: string): Promise<WebsiteProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_websites')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching website projects by category:', error);
      return fallbackWebsites.filter(project => project.category === category);
    }

    return data as WebsiteProject[];
  } catch (error) {
    console.error('Error in getWebsiteProjectsByCategory:', error);
    return fallbackWebsites.filter(project => project.category === category);
  }
}

// Function to get all app projects
export async function getAppProjects(): Promise<AppProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_apps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching app projects:', error);
      return fallbackApps;
    }

    return data as AppProject[];
  } catch (error) {
    console.error('Error in getAppProjects:', error);
    return fallbackApps;
  }
}

// Function to get a single app project by id
export async function getAppProject(id: string): Promise<AppProject | null> {
  try {
    const { data, error } = await supabase
      .from('portfolio_apps')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching app project:', error);
      return fallbackApps.find(project => project.id === id) || null;
    }

    return data as AppProject;
  } catch (error) {
    console.error('Error in getAppProject:', error);
    return fallbackApps.find(project => project.id === id) || null;
  }
}

// Function to get app projects by platform
export async function getAppProjectsByPlatform(platform: string): Promise<AppProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_apps')
      .select('*')
      .contains('platforms', [platform])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching app projects by platform:', error);
      return fallbackApps.filter(project => project.platforms.includes(platform));
    }

    return data as AppProject[];
  } catch (error) {
    console.error('Error in getAppProjectsByPlatform:', error);
    return fallbackApps.filter(project => project.platforms.includes(platform));
  }
}

// Function to get all design projects
export async function getDesignProjects(): Promise<DesignProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching design projects:', error);
      return fallbackDesigns;
    }

    return data as DesignProject[];
  } catch (error) {
    console.error('Error in getDesignProjects:', error);
    return fallbackDesigns;
  }
}

// Function to get design projects by category
export async function getDesignProjectsByCategory(category: string): Promise<DesignProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_designs')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching design projects by category:', error);
      return fallbackDesigns.filter(project => project.category === category);
    }

    return data as DesignProject[];
  } catch (error) {
    console.error('Error in getDesignProjectsByCategory:', error);
    return fallbackDesigns.filter(project => project.category === category);
  }
}

// Function to get a single design project by ID
export async function getDesignProject(id: string): Promise<DesignProject | null> {
  try {
    const { data, error } = await supabase
      .from('portfolio_designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching design project:', error);
      return fallbackDesigns.find(project => project.id === id) || null;
    }

    return data as DesignProject;
  } catch (error) {
    console.error('Error in getDesignProject:', error);
    return fallbackDesigns.find(project => project.id === id) || null;
  }
}

// Function to get app projects by year
export async function getAppProjectsByYear(year: string): Promise<AppProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_apps')
      .select('*')
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching app projects by year:', error);
      return fallbackApps.filter(project => project.year === year);
    }

    return data as AppProject[];
  } catch (error) {
    console.error('Error in getAppProjectsByYear:', error);
    return fallbackApps.filter(project => project.year === year);
  }
}

// Creative projects
export async function getCreativeProjects(): Promise<CreativeProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_creatives')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching creative projects:', error);
      return [];
    }

    return data as CreativeProject[];
  } catch (error) {
    console.error('Error in getCreativeProjects:', error);
    return [];
  }
}

// Ads & SEO projects
export async function getAdsSeoProjects(): Promise<AdsSeoProject[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_ads_seo')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ads/seo projects:', error);
      return [];
    }

    return data as AdsSeoProject[];
  } catch (error) {
    console.error('Error in getAdsSeoProjects:', error);
    return [];
  }
}
