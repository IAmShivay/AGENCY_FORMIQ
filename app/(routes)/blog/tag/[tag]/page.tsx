import React from 'react';
import Link from 'next/link';

import { Metadata } from 'next';
import { getBlogPostsByTag, getAllTags } from '@/lib/blog';
import PageHeader from '@/components/studio/PageHeader';
import { BTN_PRIMARY, CONTAINER } from '@/components/studio/ui';
import PostGrid from '../../components/PostGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export async function generateStaticParams(): Promise<{ tag: string }[]> {
  const tags = await getAllTags();

  return tags.map((tag: string) => ({
    tag: tag.toLowerCase().replace(/ /g, '-'),
  }));
}

export async function generateMetadata(props: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tag = params.tag;
  const formattedTag = tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const posts = await getBlogPostsByTag(tag);
  if (posts.length === 0) {
    notFound();
  }

  return {
    title: `${formattedTag} Articles | formiqstudio Blog`,
    description: `Explore our collection of articles tagged with ${formattedTag} - insights and expertise from the formiqstudio team.`,
    openGraph: {
      title: `${formattedTag} Articles | formiqstudio Blog`,
      description: `Explore our collection of articles tagged with ${formattedTag} - insights and expertise from the formiqstudio team.`,
      url: `https://formiqstudio.in/blog/tag/${tag}`,
      siteName: 'formiqstudio',
      images: [
        {
          url: '/images/blog/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${formattedTag} Articles`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params;
  const tag = params.tag;
  const formattedTag = tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const posts = await getBlogPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Journal / Tag"
        title={<>#{formattedTag}</>}
        intro={<>Explore our collection of articles tagged with {formattedTag.toLowerCase()}.</>}
      />

      <div className={`${CONTAINER} pb-20 sm:pb-28 lg:pb-32`}>
        <div className="border-t border-border pt-12 sm:pt-16">
          <PostGrid posts={posts} />
        </div>
        <div className="mt-16">
          <Link href="/blog" className={BTN_PRIMARY}>
            View all articles
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
