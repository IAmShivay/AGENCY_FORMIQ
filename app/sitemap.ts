import { CAREERS_ROUTE, getOpenRoles, roleHref } from '@/lib/careers';
import { SECTIONS, caseHref, loadSection, type SectionKey } from '@/lib/portfolio-cases';
import { MetadataRoute } from 'next';
import { getBlogPosts, getAllTags, getAllCategories } from '@/lib/blog';
import { DEAD_PUBLIC_ROUTES, matchesPathPrefix } from '@/lib/route-config';
import { WORK, WORK_ROUTE } from '@/lib/work';

const STATIC_PAGES_LAST_MODIFIED = new Date('2026-11-05');


function isDeadRoute(url: string): boolean {
  return matchesPathPrefix(new URL(url).pathname, DEAD_PUBLIC_ROUTES);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://formiqstudio.in';
  
  // Static pages — priority tuned for local SEO & AI discovery
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...WORK.map((w) => ({
      url: `${baseUrl}${WORK_ROUTE}/${w.slug}`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}${CAREERS_ROUTE}`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    // Portfolio sub-hubs — high value for AI/tech keyword discovery
    {
      url: `${baseUrl}/portfolio/websites`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio/applications`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio/creatives`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/ads-seo`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio/design`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/web`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mobile`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/marketing`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shopify`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ecommerce-marketplace`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  let tagPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  
  try {
    const posts = await getBlogPosts();
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Blog tag pages
    const tags = await getAllTags();
    tagPages = tags.map((tag) => ({
      url: `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/ /g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Blog category pages
    const categories = await getAllCategories();
    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.toLowerCase().replace(/ /g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching blog data for sitemap:', error);
  }

  const [caseGroups, roles] = await Promise.all([
    Promise.all((Object.keys(SECTIONS) as SectionKey[]).map(loadSection)),
    getOpenRoles(),
  ]);
  const casePages: MetadataRoute.Sitemap = caseGroups.flat().map((item) => ({
    url: `${baseUrl}${caseHref(item)}`,
    lastModified: STATIC_PAGES_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  const rolePages: MetadataRoute.Sitemap = roles.map((role) => ({
    url: `${baseUrl}${roleHref(role)}`,
    lastModified: new Date(role.updated_at ?? role.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...casePages,
    ...rolePages,
    ...blogPages,
    ...tagPages,
    ...categoryPages,
  ].filter((entry) => !isDeadRoute(entry.url));
}
