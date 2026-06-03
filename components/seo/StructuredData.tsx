import Script from 'next/script';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs?: string[];
}

interface ArticleData {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
  tags?: string[];
}

interface ServiceData {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  areaServed: string;
  serviceType: string;
  url: string;
}

interface WebsiteData {
  name: string;
  url: string;
  description: string;
  publisher: {
    name: string;
    url: string;
  };
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

interface StructuredDataProps {
  type: 'organization' | 'article' | 'service' | 'website';
  data: OrganizationData | ArticleData | ServiceData | WebsiteData;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'organization':
        const orgData = data as OrganizationData;
        return {
          ...baseData,
          '@type': 'Organization',
          name: orgData.name,
          url: orgData.url,
          logo: orgData.logo,
          description: orgData.description,
          address: orgData.address ? {
            '@type': 'PostalAddress',
            ...orgData.address,
          } : undefined,
          contactPoint: orgData.contactPoint ? {
            '@type': 'ContactPoint',
            ...orgData.contactPoint,
          } : undefined,
          sameAs: orgData.sameAs,
        };

      case 'article':
        const articleData = data as ArticleData;
        return {
          ...baseData,
          '@type': 'Article',
          headline: articleData.headline,
          description: articleData.description,
          image: articleData.image,
          datePublished: articleData.datePublished,
          dateModified: articleData.dateModified,
          author: {
            '@type': 'Person',
            name: articleData.author.name,
            url: articleData.author.url,
          },
          publisher: {
            '@type': 'Organization',
            name: articleData.publisher.name,
            logo: {
              '@type': 'ImageObject',
              url: articleData.publisher.logo,
            },
          },
          url: articleData.url,
          keywords: articleData.tags?.join(', '),
        };

      case 'service':
        const serviceData = data as ServiceData;
        return {
          ...baseData,
          '@type': 'Service',
          name: serviceData.name,
          description: serviceData.description,
          provider: {
            '@type': 'Organization',
            name: serviceData.provider.name,
            url: serviceData.provider.url,
          },
          areaServed: serviceData.areaServed,
          serviceType: serviceData.serviceType,
          url: serviceData.url,
        };

      case 'website':
        const websiteData = data as WebsiteData;
        return {
          ...baseData,
          '@type': 'WebSite',
          name: websiteData.name,
          url: websiteData.url,
          description: websiteData.description,
          publisher: {
            '@type': 'Organization',
            name: websiteData.publisher.name,
            url: websiteData.publisher.url,
          },
          potentialAction: websiteData.potentialAction ? {
            '@type': 'SearchAction',
            target: websiteData.potentialAction.target,
            'query-input': websiteData.potentialAction.queryInput,
          } : undefined,
        };

      default:
        return baseData;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
