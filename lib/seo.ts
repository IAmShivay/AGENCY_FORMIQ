// SEO utility functions and constants

export const SEO_CONSTANTS = {
  SITE_NAME: 'FormiqStudio',
  SITE_URL: 'https://formiqstudio.in',
  DEFAULT_TITLE: 'FormiqStudio - Website, Ads & Social Media for Local Businesses',
  DEFAULT_DESCRIPTION: 'FormiqStudio helps local businesses in Kolkata, Durgapur & Asansol get more customers with professional websites, Facebook & Instagram ads, and social media management. Starting Rs 6,999/month.',
  DEFAULT_OG_IMAGE: '/images/og-image.jpg',
  TWITTER_HANDLE: '@formiqstudio',
  LOGO_URL: '/images/logo.png',
  COMPANY_EMAIL: 'hello@formiqstudio.in',
  COMPANY_PHONE: '+91-8918349445',
};

export interface SEOData {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export function generatePageTitle(title: string, includeCompany = true): string {
  if (includeCompany && !title.includes('FormiqStudio')) {
    return `${title} | FormiqStudio`;
  }
  return title;
}

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONSTANTS.SITE_URL}${cleanPath}`;
}

export function generateOGImageUrl(imagePath?: string): string {
  if (!imagePath) return `${SEO_CONSTANTS.SITE_URL}${SEO_CONSTANTS.DEFAULT_OG_IMAGE}`;
  
  if (imagePath.startsWith('http')) return imagePath;
  
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SEO_CONSTANTS.SITE_URL}${cleanPath}`;
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateServiceStructuredData(service: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.SITE_NAME,
      url: SEO_CONSTANTS.SITE_URL,
    },
    areaServed: service.areaServed || 'Worldwide',
    serviceType: service.serviceType || 'Digital Marketing',
    url: service.url,
  };
}

export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SEO_CONSTANTS.SITE_NAME,
    url: SEO_CONSTANTS.SITE_URL,
    logo: `${SEO_CONSTANTS.SITE_URL}${SEO_CONSTANTS.LOGO_URL}`,
    description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
    telephone: SEO_CONSTANTS.COMPANY_PHONE,
    email: SEO_CONSTANTS.COMPANY_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Arrah Shree Pally',
      addressLocality: 'Durgapur',
      addressRegion: 'West Bengal',
      postalCode: '713212',
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Sa 10:00-19:00',
    priceRange: 'Rs 6,999 - Rs 14,999',
    sameAs: [
      'https://www.linkedin.com/company/formiqstudio',
      'https://twitter.com/formiqstudio',
      'https://www.facebook.com/formiqstudio',
      'https://www.instagram.com/formiqstudio',
    ],
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONSTANTS.SITE_NAME,
    url: SEO_CONSTANTS.SITE_URL,
    description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.SITE_NAME,
      url: SEO_CONSTANTS.SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONSTANTS.SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONSTANTS.SITE_NAME,
    url: SEO_CONSTANTS.SITE_URL,
    logo: `${SEO_CONSTANTS.SITE_URL}${SEO_CONSTANTS.LOGO_URL}`,
    description: SEO_CONSTANTS.DEFAULT_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_CONSTANTS.COMPANY_PHONE,
      contactType: 'customer service',
      email: SEO_CONSTANTS.COMPANY_EMAIL,
    },
    sameAs: [
      'https://www.linkedin.com/company/formiqstudio',
      'https://twitter.com/formiqstudio',
      'https://www.facebook.com/formiqstudio',
      'https://www.instagram.com/formiqstudio',
    ],
  };
}

export function cleanText(text: string, maxLength?: number): string {
  let cleaned = text.replace(/\s+/g, ' ').trim();
  
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3) + '...';
  }
  
  return cleaned;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractKeywords(text: string, maxKeywords = 10): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
