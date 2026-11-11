import { supabase } from './supabaseClient';

export const CAREERS_ROUTE = '/careers';
export const CAREERS_APPLY_ENDPOINT = '/api/careers/apply';
export const OPEN_APPLICATION = 'Open application';
export const CAREERS_TABLES = { roles: 'job_openings', applications: 'job_applications' } as const;

export const TEAMS = ['Design', 'Development', 'Marketing', 'Operations'] as const;
export const WORK_MODES = ['On-site', 'Hybrid', 'Remote'] as const;
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const;
export const APPLICATION_STATUSES = ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'] as const;

export type WorkMode = (typeof WORK_MODES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_RETENTION_MONTHS = 12;

export const retentionCutoff = (now = new Date()) => {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - APPLICATION_RETENTION_MONTHS);
  return cutoff;
};

export const APPLICATION_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  location: 120,
  url: 500,
  message: 4000,
} as const;

export const SCHEMA_EMPLOYMENT_TYPE: Record<EmploymentType, string> = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME',
  Contract: 'CONTRACTOR',
  Internship: 'INTERN',
};

export interface JobOpening {
  id: string;
  title: string;
  team: string;
  location: string;
  work_mode: WorkMode;
  employment_type: EmploymentType;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  salary: string;
  is_open: boolean;
  created_at: string;
  updated_at?: string;
}

export interface JobApplication {
  id: string;
  opening_id: string | null;
  role_title: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  cv_url: string | null;
  message: string | null;
  status: ApplicationStatus;
  consent: boolean;
  created_at: string;
}

export const roleHref = (role: Pick<JobOpening, 'id'>) => `${CAREERS_ROUTE}/${role.id}`;

export async function getOpenRoles(): Promise<JobOpening[]> {
  const { data, error } = await supabase
    .from(CAREERS_TABLES.roles)
    .select('*')
    .eq('is_open', true)
    .order('created_at', { ascending: false });
  return error || !data ? [] : (data as JobOpening[]);
}

export async function getOpenRole(id: string): Promise<JobOpening | null> {
  const { data, error } = await supabase.from(CAREERS_TABLES.roles).select('*').eq('id', id).eq('is_open', true).maybeSingle();
  return error || !data ? null : (data as JobOpening);
}
