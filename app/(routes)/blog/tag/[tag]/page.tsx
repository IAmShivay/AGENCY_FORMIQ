import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPostsByTag, getBlogPosts, BlogPost, getAllTags } from '@/lib/blog';

// Set dynamic rendering to ensure real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from 'next/navigation';
import { Tag } from 'lucide-react';

// This function is required for static site generation with Next.js when using output: 'export'
export async function generateStaticParams(): Promise<{ tag: string }[]> {
  const tags = await getAllTags();

  return tags.map((tag: string) => ({
    tag: tag.toLowerCase().replace(/ /g, '-'),
  }));
}

// Generate metadata for SEO
export async function generateMetadata(props: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tag = params.tag;
  const formattedTag = tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTag} Articles | formiqstudio Blog`,
    description: `Explore our collection of articles tagged with ${formattedTag} - insights and expertise from the formiqstudio team.`,
    openGraph: {
      title: `${formattedTag} Articles | formiqstudio Blog`,
      description: `Explore our collection of articles tagged with ${formattedTag} - insights and expertise from the formiqstudio team.`,
      url: `https://formiqstudio.com/blog/tag/${tag}`,
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <Tag className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary">
              #{formattedTag}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Explore our collection of articles tagged with {formattedTag.toLowerCase()}.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-56">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center mb-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Blog */}
        <div className="text-center mt-16">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
