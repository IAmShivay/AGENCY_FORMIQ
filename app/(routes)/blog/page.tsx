import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPostsPaginated } from '@/lib/blog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/studio/PageHeader';
import { CONTAINER, EYEBROW, FOCUS_RING } from '@/components/studio/ui';

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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const pageHref = (p: number) => (p === 1 ? '/blog' : `/blog?page=${p}`);
  const PILL = `inline-flex min-h-11 items-center px-5 rounded-full border text-sm font-medium transition-colors duration-300 ${FOCUS_RING}`;

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Journal"
        title={<>Notes on building for <span className="text-primary">growth</span></>}
        intro="Insights, trends, and tips on web development, design, digital marketing, and technology."
      >
        <nav aria-label="Blog categories" className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.slug === 'all' ? '/blog' : `/blog/category/${category.slug}`}
              aria-current={category.slug === 'all' ? 'page' : undefined}
              className={`${PILL} ${category.slug === 'all' ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/40'}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className={`${CONTAINER} pb-20 sm:pb-28 lg:pb-32`}>
        {posts.length === 0 && (
          <p className="py-20 text-lg text-muted-foreground">No blog posts yet. Check back soon!</p>
        )}

        {featured && (
          <Link href={`/blog/${featured.slug}`} className={`group grid gap-6 lg:grid-cols-12 lg:gap-12 lg:items-center mb-16 sm:mb-24 rounded-[22px] ${FOCUS_RING}`}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-border bg-muted lg:col-span-7">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
              />
            </div>
            <div className="lg:col-span-5">
              <p className={EYEBROW}>
                {featured.category} <span aria-hidden="true">·</span> {formatDate(featured.date)}
              </p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.02] tracking-[-0.04em]">
                {featured.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              <p className="mt-6 text-sm text-muted-foreground">
                <span className="text-foreground font-medium">{featured.author.name}</span>
                {featured.author.role && <> · {featured.author.role}</>}
              </p>
            </div>
          </Link>
        )}

        {gridPosts.length > 0 && (
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 border-t border-border pt-12 sm:pt-16">
            {gridPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className={`group block rounded-[22px] ${FOCUS_RING}`}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-border bg-muted">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className={`${EYEBROW} mt-5`}>
                    {post.category} <span aria-hidden="true">·</span> {formatDate(post.date)}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.035em]">
                    <span className="link-draw">{post.title}</span>
                  </h3>
                  <p className="mt-3 text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{post.author.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav aria-label="Blog pagination" className="mt-16 sm:mt-20 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
            {currentPage > 1 ? (
              <Link href={pageHref(currentPage - 1)} className={`${PILL} gap-1 border-border hover:border-foreground/40`}>
                <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Previous
              </Link>
            ) : (
              <span className={`${PILL} gap-1 border-border text-muted-foreground opacity-50`} aria-disabled="true">
                <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Previous
              </span>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1]) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`e-${idx}`} className="px-2 text-muted-foreground">…</span>
                  ) : (
                    <Link
                      key={item}
                      href={pageHref(item)}
                      aria-current={item === currentPage ? 'page' : undefined}
                      className={`${PILL} min-w-11 justify-center px-3 ${
                        item === currentPage ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/40'
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}
            </div>

            {currentPage < totalPages ? (
              <Link href={pageHref(currentPage + 1)} className={`${PILL} gap-1 border-border hover:border-foreground/40`}>
                Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : (
              <span className={`${PILL} gap-1 border-border text-muted-foreground opacity-50`} aria-disabled="true">
                Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </span>
            )}
          </nav>
        )}

        {total > 0 && (
          <p className={`${EYEBROW} mt-6`}>
            Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)} of {total} posts
          </p>
        )}
      </div>
    </div>
  );
}
