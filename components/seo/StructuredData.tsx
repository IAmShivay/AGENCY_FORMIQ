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

interface LocalBusinessData {
  name: string;
  url: string;
  logo: string;
  description: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: { latitude: string; longitude: string };
  areaServed?: string[];
  openingHours?: string;
  priceRange?: string;
  sameAs?: string[];
}

interface FAQData {
  mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
}

interface BreadcrumbData {
  items: Array<{ name: string; url: string }>;
}

interface BlogPostingData {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url?: string; image?: string };
  publisher: { name: string; logo: string };
  url: string;
  tags?: string[];
  wordCount?: number;
  timeRequired?: string;
}

interface StructuredDataProps {
  type: 'organization' | 'article' | 'service' | 'website' | 'localBusiness' | 'faqPage' | 'breadcrumb' | 'blogPosting';
  data: OrganizationData | ArticleData | ServiceData | WebsiteData | LocalBusinessData | FAQData | BreadcrumbData | BlogPostingData;
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

      case 'localBusiness':
        const lbData = data as LocalBusinessData;
        return {
          ...baseData,
          '@type': 'LocalBusiness',
          '@id': `${lbData.url}#localbusiness`,
          name: lbData.name,
          url: lbData.url,
          logo: lbData.logo,
          image: lbData.logo,
          description: lbData.description,
          telephone: lbData.telephone,
          email: lbData.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: lbData.address.streetAddress,
            addressLocality: lbData.address.addressLocality,
            addressRegion: lbData.address.addressRegion,
            postalCode: lbData.address.postalCode,
            addressCountry: lbData.address.addressCountry,
          },
          geo: lbData.geo ? { '@type': 'GeoCoordinates', latitude: lbData.geo.latitude, longitude: lbData.geo.longitude } : undefined,
          areaServed: lbData.areaServed?.map(area => ({ '@type': 'City', name: area })),
          openingHours: lbData.openingHours,
          priceRange: lbData.priceRange,
          sameAs: lbData.sameAs,
        };

      case 'faqPage':
        const faqData = data as FAQData;
        return {
          ...baseData,
          '@type': 'FAQPage',
          mainEntity: faqData.mainEntity.map(item => ({
            '@type': 'Question',
            name: item.name,
            acceptedAnswer: { '@type': 'Answer', text: item.acceptedAnswer.text },
          })),
        };

      case 'breadcrumb':
        const bcData = data as BreadcrumbData;
        return {
          ...baseData,
          '@type': 'BreadcrumbList',
          itemListElement: bcData.items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url,
          })),
        };

      case 'blogPosting':
        const bp = data as BlogPostingData;
        return {
          ...baseData,
          '@type': 'BlogPosting',
          headline: bp.headline,
          description: bp.description,
          image: bp.image,
          datePublished: bp.datePublished,
          dateModified: bp.dateModified,
          author: { '@type': 'Person', name: bp.author.name, url: bp.author.url, image: bp.author.image },
          publisher: {
            '@type': 'Organization',
            name: bp.publisher.name,
            logo: { '@type': 'ImageObject', url: bp.publisher.logo },
          },
          url: bp.url,
          keywords: bp.tags?.join(', '),
          wordCount: bp.wordCount,
          timeRequired: bp.timeRequired,
          mainEntityOfPage: { '@type': 'WebPage', '@id': bp.url },
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
