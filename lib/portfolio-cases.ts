import {
  getAdsSeoProjects,
  getAppProjects,
  getCreativeProjects,
  getDesignProjects,
  getWebsiteProjects,
  type AdsSeoProject,
  type AppProject,
  type CreativeProject,
  type DesignProject,
  type WebsiteProject,
} from './portfolio';
import { NO_YEAR, PORTFOLIO_ROUTE, hostOf, paragraphs, validImage, validLink, yearOf } from './portfolio-format';

export type SectionKey = 'websites' | 'applications' | 'design' | 'creatives' | 'ads-seo';

export interface CaseMeta {
  label: string;
  value: string;
  href?: string;
}

export interface CaseItem {
  id: string;
  section: SectionKey;
  title: string;
  summary: string;
  client: string;
  discipline: string;
  year: string;
  image: string;
  live: string;
  tags: string[];
  meta: CaseMeta[];
  chapters: { title: string; text: string }[];
  highlights: { title: string; items: string[] } | null;
  metrics: { value: string; label: string }[];
  gallery: string[];
  quote: string;
}

export interface SectionConfig {
  key: SectionKey;
  route: string;
  label: string;
  singular: string;
  fallbackDiscipline: string;
  liveLabel: string;
}

export const SECTIONS: Record<SectionKey, SectionConfig> = {
  websites: { key: 'websites', route: `${PORTFOLIO_ROUTE}/websites`, label: 'Websites', singular: 'website', fallbackDiscipline: 'Website', liveLabel: 'Visit the live site' },
  applications: { key: 'applications', route: `${PORTFOLIO_ROUTE}/applications`, label: 'Applications', singular: 'application', fallbackDiscipline: 'Application', liveLabel: 'See the app' },
  design: { key: 'design', route: `${PORTFOLIO_ROUTE}/design`, label: 'Design', singular: 'design project', fallbackDiscipline: 'Design', liveLabel: 'View the design' },
  creatives: { key: 'creatives', route: `${PORTFOLIO_ROUTE}/creatives`, label: 'Creatives', singular: 'creative project', fallbackDiscipline: 'Creative', liveLabel: 'View the work' },
  'ads-seo': { key: 'ads-seo', route: `${PORTFOLIO_ROUTE}/ads-seo`, label: 'Ads & SEO', singular: 'campaign', fallbackDiscipline: 'Performance marketing', liveLabel: 'View the campaign' },
};

const list = (items: (string | undefined)[] | undefined) => (items ?? []).map((i) => i?.trim() ?? '').filter(Boolean);
const images = (items: (string | undefined)[] | undefined) => list(items).map(validImage).filter(Boolean);
const text = (value: string | undefined) => value?.trim() ?? '';

const withMeta = (rows: (CaseMeta | false)[]) => rows.filter((m): m is CaseMeta => !!m && !!m.value && m.value !== NO_YEAR);
const liveMeta = (live: string): CaseMeta | false => !!live && { label: 'Live', value: hostOf(live), href: live };

const METRIC = /^\s*([+\-−]?[\d.,]+\s*[%×xX+kKmM]*|[\d.,]+\s*(?:hrs?|days?|weeks?))\s+(.{3,60})$/;
const metricsFromResults = (results: string[]) =>
  results
    .map((r) => r.match(METRIC))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ value: m[1].trim(), label: m[2].trim() }));

function fromWebsite(w: WebsiteProject): CaseItem {
  const s = SECTIONS.websites;
  const live = validLink(w.live_link, w.link);
  const discipline = text(w.category) || s.fallbackDiscipline;
  const year = yearOf(w.completion_date);
  return {
    id: w.id, section: s.key, title: w.title, summary: text(w.description), client: '', discipline, year,
    image: validImage(w.image), live, tags: list(w.tags),
    meta: withMeta([{ label: 'Discipline', value: discipline }, { label: 'Year', value: year }, { label: 'Built with', value: list(w.tags).join(', ') }, liveMeta(live)]),
    chapters: [
      { title: 'The brief', text: text(w.case_study_challenge) },
      { title: 'Our approach', text: text(w.case_study_solution) },
      { title: 'The outcome', text: text(w.case_study_results) },
    ],
    highlights: list(w.features).length ? { title: 'What we built', items: list(w.features) } : null,
    metrics: [],
    gallery: images(w.case_study_screens),
    quote: text(w.case_study_testimonial),
  };
}

function fromApp(a: AppProject): CaseItem {
  const s = SECTIONS.applications;
  const live = validLink(a.live_link, a.link);
  const discipline = text(a.category) || s.fallbackDiscipline;
  const year = yearOf(a.year);
  return {
    id: a.id, section: s.key, title: a.title, summary: text(a.description), client: '', discipline, year,
    image: validImage(a.image), live, tags: list(a.tags),
    meta: withMeta([{ label: 'Platforms', value: list(a.platforms).join(', ') }, { label: 'Year', value: year }, { label: 'Built with', value: list(a.tags).join(', ') }, liveMeta(live)]),
    chapters: [],
    highlights: list(a.features).length ? { title: 'Key features', items: list(a.features) } : null,
    metrics: [], gallery: [], quote: '',
  };
}

function fromDesign(d: DesignProject): CaseItem {
  const s = SECTIONS.design;
  const live = validLink(d.live_link, d.link);
  const discipline = text(d.category) || s.fallbackDiscipline;
  const year = yearOf(d.year);
  return {
    id: d.id, section: s.key, title: d.title, summary: text(d.description), client: text(d.client), discipline, year,
    image: validImage(d.image), live, tags: [],
    meta: withMeta([{ label: 'Client', value: text(d.client) }, { label: 'Discipline', value: discipline }, { label: 'Year', value: year }, liveMeta(live)]),
    chapters: [],
    highlights: list(d.services).length ? { title: 'Services', items: list(d.services) } : null,
    metrics: [], gallery: [], quote: '',
  };
}

function fromCreative(c: CreativeProject): CaseItem {
  const s = SECTIONS.creatives;
  const discipline = text(c.category) || s.fallbackDiscipline;
  return {
    id: c.id, section: s.key, title: c.title, summary: text(c.description), client: text(c.client), discipline, year: '',
    image: validImage(c.image), live: '', tags: list(c.tags),
    meta: withMeta([{ label: 'Client', value: text(c.client) }, { label: 'Discipline', value: discipline }, { label: 'Tags', value: list(c.tags).join(', ') }]),
    chapters: [],
    highlights: list(c.deliverables).length ? { title: 'Deliverables', items: list(c.deliverables) } : null,
    metrics: [], gallery: images(c.media_urls), quote: '',
  };
}

function fromAdsSeo(a: AdsSeoProject): CaseItem {
  const s = SECTIONS['ads-seo'];
  const discipline = text(a.category) || s.fallbackDiscipline;
  const results = list(a.results);
  const stored = (Array.isArray(a.metrics) ? a.metrics : []).filter((m) => m?.value && m?.label).map((m) => ({ value: m.value.trim(), label: m.label.trim() }));
  const metrics = stored.length ? stored : metricsFromResults(results);
  return {
    id: a.id, section: s.key, title: a.title, summary: text(a.description), client: text(a.client), discipline, year: '',
    image: validImage(a.image), live: '', tags: list(a.tags),
    meta: withMeta([{ label: 'Client', value: text(a.client) }, { label: 'Channel', value: discipline }, { label: 'Platform', value: text(a.platform) }]),
    chapters: [],
    highlights: results.length ? { title: 'Results', items: results } : null,
    metrics, gallery: images(a.media_urls), quote: '',
  };
}

const LOADERS: Record<SectionKey, () => Promise<CaseItem[]>> = {
  websites: async () => (await getWebsiteProjects()).map(fromWebsite),
  applications: async () => (await getAppProjects()).map(fromApp),
  design: async () => (await getDesignProjects()).map(fromDesign),
  creatives: async () => (await getCreativeProjects()).map(fromCreative),
  'ads-seo': async () => (await getAdsSeoProjects()).map(fromAdsSeo),
};

const finalize = (item: CaseItem): CaseItem => ({ ...item, chapters: item.chapters.filter((c) => paragraphs(c.text).length) });

export async function loadSection(section: SectionKey): Promise<CaseItem[]> {
  try {
    return (await LOADERS[section]()).map(finalize);
  } catch {
    return [];
  }
}

export async function loadCase(section: SectionKey, id: string) {
  const all = await loadSection(section);
  const index = all.findIndex((c) => c.id === id);
  if (index < 0) return null;
  return { item: all[index], index, total: all.length, next: all.length > 1 ? all[(index + 1) % all.length] : null };
}

export const caseHref = (item: Pick<CaseItem, 'section' | 'id'>) => `${SECTIONS[item.section].route}/${item.id}`;
