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

// Fallback data for static generation and error cases
const fallbackWebsites: WebsiteProject[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce solution with advanced filtering and payment integration.',
    image: '/images/portfolio/website-1.jpg',
    tags: ['Next.js', 'Tailwind CSS', 'Stripe'],
    link: '#',
    category: 'E-Commerce',
    completion_date: 'March 2024',
    features: ['Product Search', 'User Accounts', 'Secure Payments', 'Order Tracking'],
    live_link: 'https://example.com',
    repo_link: 'https://github.com',
    case_study_challenge: 'The client needed a modern e-commerce platform that could handle their large product catalog while providing a seamless shopping experience for customers.',
    case_study_solution: 'We developed a custom e-commerce solution using Next.js for the frontend and a headless CMS for content management, with Stripe integration for payments.',
    case_study_results: 'The new platform increased conversion rates by 35% and reduced cart abandonment by 25% within the first three months after launch.',
    case_study_testimonial: 'The team at formiqstudio delivered an exceptional e-commerce platform that exceeded our expectations. Our customers love the new shopping experience!',
    case_study_screens: ['/images/portfolio/ecom-screen-1.jpg', '/images/portfolio/ecom-screen-2.jpg']
  }
];

const fallbackApps: AppProject[] = [
  {
    id: '1',
    title: 'Health & Fitness App',
    description: 'A comprehensive fitness tracking application with personalized workout plans, nutrition guidance, and progress analytics.',
    image: '/images/portfolio/app-1.jpg',
    tags: ['React Native', 'Firebase', 'Redux', 'Health API'],
    platforms: ['iOS', 'Android'],
    link: '#',
    features: ['Activity Tracking', 'Meal Planning', 'Progress Analytics', 'Community Forums'],
    year: '2024'
  }
];

const fallbackDesigns: DesignProject[] = [
  {
    id: '1',
    title: 'Brand Identity System',
    description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
    image: '/images/portfolio/design-1.jpg',
    category: 'Branding',
    client: 'TechStart Solutions',
    link: '#',
    year: '2024',
    services: ['Logo Design', 'Brand Guidelines', 'Marketing Materials']
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
