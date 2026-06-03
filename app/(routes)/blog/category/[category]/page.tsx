import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPostsByCategory, getBlogPosts, BlogPost, getAllCategories } from '@/lib/blog';

// Set dynamic rendering to ensure real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from 'next/navigation';

// Generate static params for all categories at build time
export async function generateStaticParams(): Promise<{ category: string }[]> {
  const categories = await getAllCategories();

  return categories.map((category: string) => ({
    category: category.toLowerCase().replace(/ /g, '-'),
  }));
}

// Generate metadata for SEO
export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = params.category;
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedCategory} Articles | formiqstudio Blog`,
    description: `Explore our collection of articles about ${formattedCategory.toLowerCase()} - tips, trends, and insights from the formiqstudio team.`,
    openGraph: {
      title: `${formattedCategory} Articles | formiqstudio Blog`,
      description: `Explore our collection of articles about ${formattedCategory.toLowerCase()} - tips, trends, and insights from the formiqstudio team.`,
      url: `https://formiqstudio.com/blog/category/${category}`,
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

  // Categories for filtering
  const categories = [
    { name: 'All', slug: 'all' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Design', slug: 'design' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Technology', slug: 'technology' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary">
            {formattedCategory} Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Explore our collection of articles about {formattedCategory.toLowerCase()}.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === 'all' ? '/blog' : `/blog/category/${cat.slug}`}
                className={`px-5 py-2 rounded-full ${
                  cat.slug === category
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-primary hover:text-white'
                } transition-colors shadow-sm`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
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

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 max-w-md mx-auto rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold mb-2">No articles found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We couldn't find any articles in this category. Check back soon!
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
