import { MetadataRoute } from 'next';
import { getBlogPosts, getAllTags, getAllCategories } from '@/lib/blog';
import { getWebsiteProjects, getAppProjects } from '@/lib/portfolio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://formiqstudio.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/web`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mobile`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shopify`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ecommerce-marketplace`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/software-tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
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

  // Portfolio pages
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const [websites, apps] = await Promise.all([
      getWebsiteProjects(),
      getAppProjects()
    ]);

    // Website portfolio pages
    const websitePages = websites.map((website) => ({
      url: `${baseUrl}/portfolio/websites/${website.id}`,
      lastModified: new Date(website.updated_at || website.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // App portfolio pages
    const appPages = apps.map((app) => ({
      url: `${baseUrl}/portfolio/apps/${app.id}`,
      lastModified: new Date(app.updated_at || app.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    portfolioPages = [...websitePages, ...appPages];
  } catch (error) {
    console.error('Error fetching portfolio data for sitemap:', error);
  }

  return [
    ...staticPages,
    ...blogPages,
    ...tagPages,
    ...categoryPages,
    ...portfolioPages,
  ];
}
