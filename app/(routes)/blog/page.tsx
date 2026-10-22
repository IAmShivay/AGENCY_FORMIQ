import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPostsPaginated } from '@/lib/blog';
import BlogAdUnit from '@/components/ads/BlogAdUnit';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | formiqstudio - Insights on Web Development, Design & Digital Marketing',
  description: 'Explore the latest insights, trends, and tips on web development, design, digital marketing, and technology from the formiqstudio team.',
  openGraph: {
    title: 'Blog | formiqstudio - Insights on Web Development, Design & Digital Marketing',
    description: 'Explore the latest insights, trends, and tips on web development, design, digital marketing, and technology from the formiqstudio team.',
    url: 'https://formiqstudio.in/blog',
    siteName: 'formiqstudio',
    images: [
      {
        url: '/images/blog/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'formiqstudio Blog',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  alternates: { canonical: 'https://formiqstudio.in/blog' },
};

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { posts, total, perPage } = await getBlogPostsPaginated(currentPage);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const categories = [
    { name: 'All', slug: 'all' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Design', slug: 'design' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Technology', slug: 'technology' },
  ];

  const featured = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const gridPosts = currentPage === 1 ? posts.slice(1) : posts;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Insights, trends, and tips on web development, design, digital marketing, and technology.
          </p>

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

        <BlogAdUnit slot="8265366891" label="Advertisement" className="max-w-4xl mx-auto" />

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">No blog posts yet. Check back soon!</p>
          </div>
        )}

        {featured && (
          <div className="mb-16">
            <Link href={`/blog/${featured.slug}`} className="block group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {featured.category}
                      </span>
                      <span className="mx-2 text-gray-400">&bull;</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(featured.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <Image
                          src={featured.author.avatar || '/images/default-avatar.svg'}
                          alt={featured.author.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{featured.author.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{featured.author.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {gridPosts.length > 0 && (
          <BlogAdUnit slot="2206263374" label="Advertisement" className="mb-12" />
        )}

        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
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
                          src={post.author.avatar || '/images/default-avatar.svg'}
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
        )}

        {totalPages > 1 && (
          <nav aria-label="Blog pagination" className="flex justify-center mt-16">
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 text-sm font-medium cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1]) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`e-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <Link
                      key={item}
                      href={item === 1 ? '/blog' : `/blog?page=${item}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                        item === currentPage
                          ? 'bg-primary text-white'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}

              {currentPage < totalPages ? (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 text-sm font-medium cursor-not-allowed">
                  Next <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </nav>
        )}

        {total > 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, total)} of {total} posts
          </p>
        )}
      </div>
    </div>
  );
}
