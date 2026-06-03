import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPosts } from '@/lib/blog';

// Set dynamic rendering to ensure real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog | formiqstudio - Insights on Web Development, Design & Digital Marketing',
  description: 'Explore the latest insights, trends, and tips on web development, design, digital marketing, and technology from the formiqstudio team.',
  openGraph: {
    title: 'Blog | formiqstudio - Insights on Web Development, Design & Digital Marketing',
    description: 'Explore the latest insights, trends, and tips on web development, design, digital marketing, and technology from the formiqstudio team.',
    url: 'https://formiqstudio.com/blog',
    siteName: 'formiqstudio',
    images: [
      {
        url: '/images/blog/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'formiqstudio Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Insights, trends, and tips on web development, design, digital marketing, and technology.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={category.slug === 'all' ? '/blog' : `/blog/category/${category.slug}`}
                className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-primary hover:text-white transition-colors shadow-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <Link href={`/blog/${posts[0].slug}`} className="block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={posts[0].coverImage}
                      alt={posts[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {posts[0].category}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(posts[0].date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {posts[0].excerpt}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <Image
                          src={posts[0].author.avatar}
                          alt={posts[0].author.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{posts[0].author.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{posts[0].author.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
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

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-white shadow-sm hover:bg-primary-dark transition-colors">
              1
            </button>
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              3
            </button>
            <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
