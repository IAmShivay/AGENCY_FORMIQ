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

const TABLES = {
  websites: 'portfolio_websites',
  apps: 'portfolio_apps',
  designs: 'portfolio_designs',
  creatives: 'portfolio_creatives',
  adsSeo: 'portfolio_ads_seo',
} as const;

async function listTable<T>(table: string): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }
    return (data ?? []) as T[];
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
}

export const getWebsiteProjects = () => listTable<WebsiteProject>(TABLES.websites);
export const getAppProjects = () => listTable<AppProject>(TABLES.apps);
export const getDesignProjects = () => listTable<DesignProject>(TABLES.designs);
export const getCreativeProjects = () => listTable<CreativeProject>(TABLES.creatives);
export const getAdsSeoProjects = () => listTable<AdsSeoProject>(TABLES.adsSeo);
