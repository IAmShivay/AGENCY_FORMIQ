import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, getBlogPost } from '@/lib/blog';
import { getWebsiteProjects, getAppProjects } from '@/lib/portfolio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const type = searchParams.get('type');

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    let seoData = {};

    switch (type) {
      case 'blog':
        if (path.startsWith('/blog/')) {
          const slug = path.replace('/blog/', '');
          const post = await getBlogPost(slug);
          
          if (post) {
            seoData = {
              title: `${post.title} | FormiqStudio Blog`,
              description: post.excerpt,
              canonical: `https://formiqstudio.com/blog/${post.slug}`,
              ogImage: post.coverImage,
              ogType: 'article',
              publishedTime: post.date,
              author: post.author.name,
              tags: post.tags,
              structuredData: {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                description: post.excerpt,
                image: post.coverImage,
                datePublished: post.date,
                dateModified: post.date,
                author: {
                  '@type': 'Person',
                  name: post.author.name,
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'FormiqStudio',
                  logo: 'https://formiqstudio.com/images/logo.png',
                },
              },
            };
          }
        }
        break;

      case 'portfolio':
        if (path.startsWith('/portfolio/websites/')) {
          const id = path.replace('/portfolio/websites/', '');
          const websites = await getWebsiteProjects();
          const website = websites.find(w => w.id === id);
          
          if (website) {
            seoData = {
              title: `${website.title} | FormiqStudio Portfolio`,
              description: website.description,
              canonical: `https://formiqstudio.com/portfolio/websites/${website.id}`,
              ogImage: website.image,
              ogType: 'website',
            };
          }
        } else if (path.startsWith('/portfolio/apps/')) {
          const id = path.replace('/portfolio/apps/', '');
          const apps = await getAppProjects();
          const app = apps.find(a => a.id === id);
          
          if (app) {
            seoData = {
              title: `${app.title} | FormiqStudio Portfolio`,
              description: app.description,
              canonical: `https://formiqstudio.com/portfolio/apps/${app.id}`,
              ogImage: app.image,
              ogType: 'website',
            };
          }
        }
        break;

      default:
        // Default SEO data for other pages
        const pageData = getDefaultSEOData(path);
        seoData = pageData;
    }

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('SEO API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO data' }, { status: 500 });
  }
}

function getDefaultSEOData(path: string) {
  const baseUrl = 'https://formiqstudio.com';
  const defaultData = {
    title: 'FormiqStudio - Digital Marketing & Development Agency',
    description: 'Transforming businesses through innovative software solutions, digital marketing, AI-driven automation, web development, mobile apps, and comprehensive digital marketing services.',
    canonical: `${baseUrl}${path}`,
    ogImage: `${baseUrl}/images/og-image.jpg`,
    ogType: 'website',
  };

  // Customize based on path
  switch (path) {
    case '/about':
      return {
        ...defaultData,
        title: 'About Us | FormiqStudio - Digital Marketing & Development Agency',
        description: 'Learn about FormiqStudio\'s mission to transform businesses through innovative software solutions, digital marketing, and AI-driven automation.',
      };
    
    case '/services':
      return {
        ...defaultData,
        title: 'Our Services | FormiqStudio - Web Development, Mobile Apps & Digital Marketing',
        description: 'Comprehensive digital services including web development, mobile app development, digital marketing, SEO, social media management, and AI automation solutions.',
      };
    
    case '/portfolio':
      return {
        ...defaultData,
        title: 'Portfolio | FormiqStudio - Our Work & Case Studies',
        description: 'Explore our portfolio of successful web development, mobile app, and digital marketing projects. See how we\'ve helped businesses grow and succeed.',
      };
    
    case '/contact':
      return {
        ...defaultData,
        title: 'Contact Us | FormiqStudio - Get Your Free Consultation',
        description: 'Ready to transform your business? Contact FormiqStudio for a free consultation on web development, mobile apps, digital marketing, and AI automation.',
      };
    
    default:
      return defaultData;
  }
}
