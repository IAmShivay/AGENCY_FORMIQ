import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getBlogPostsByCategory, getAllCategories } from '@/lib/blog';
import PageHeader from '@/components/studio/PageHeader';
import { CONTAINER, FOCUS_RING } from '@/components/studio/ui';
import PostGrid from '../../components/PostGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from 'next/navigation';

export async function generateStaticParams(): Promise<{ category: string }[]> {
  const categories = await getAllCategories();

  return categories.map((category: string) => ({
    category: category.toLowerCase().replace(/ /g, '-'),
  }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = params.category;
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const posts = await getBlogPostsByCategory(category);
  if (posts.length === 0) {
    notFound();
  }

  return {
    title: `${formattedCategory} Articles | formiqstudio Blog`,
    description: `Explore our collection of articles about ${formattedCategory.toLowerCase()} - tips, trends, and insights from the formiqstudio team.`,
    openGraph: {
      title: `${formattedCategory} Articles | formiqstudio Blog`,
      description: `Explore our collection of articles about ${formattedCategory.toLowerCase()} - tips, trends, and insights from the formiqstudio team.`,
      url: `https://formiqstudio.in/blog/category/${category}`,
      siteName: 'formiqstudio',
      images: [
        {
          url: '/images/blog/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${formattedCategory} Articles`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const category = params.category;
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const posts = await getBlogPostsByCategory(category);

  if (posts.length === 0) {
    notFound();
  }

  const categories = [
    { name: 'All', slug: 'all' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Design', slug: 'design' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Technology', slug: 'technology' },
  ];

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Journal / Category"
        title={<>{formattedCategory} <span className="text-primary">articles</span></>}
        intro={<>Explore our collection of articles about {formattedCategory.toLowerCase()}.</>}
      >
        <nav aria-label="Blog categories" className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === 'all' ? '/blog' : `/blog/category/${cat.slug}`}
              aria-current={cat.slug === category ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center px-5 rounded-full border text-sm font-medium transition-colors duration-300 ${FOCUS_RING} ${
                cat.slug === category ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/40'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className={`${CONTAINER} pb-20 sm:pb-28 lg:pb-32`}>
        <div className="border-t border-border pt-12 sm:pt-16">
          <PostGrid posts={posts} />
        </div>
      </div>
    </div>
  );
}
