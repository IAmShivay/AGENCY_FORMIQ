import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBlogPost, getRelatedPosts, getBlogPosts, BlogPost } from '@/lib/blog';
import { sanitizeHtml } from '@/lib/sanitize';
import StructuredData from '@/components/seo/StructuredData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import NewsletterForm from '../components/NewsletterForm';
import SidebarNewsletterForm from '../components/SidebarNewsletterForm';
import BlogAds from '../components/BlogAds';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getBlogPosts();
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return {
    title: `${post.title} | formiqstudio Blog`,
    description: post.excerpt,
    metadataBase: new URL('https://formiqstudio.in'),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://formiqstudio.in/blog/${post.slug}`,
      siteName: 'formiqstudio',
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `https://formiqstudio.in/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category);
  const safeContent = await sanitizeHtml(post.content);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <StructuredData
        type="blogPosting"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            name: post.author.name,
            url: `https://formiqstudio.in/team/${post.author.name.toLowerCase().replace(' ', '-')}`,
            image: post.author.avatar,
          },
          publisher: {
            name: "FormiqStudio",
            logo: "https://formiqstudio.in/images/logo.png"
          },
          url: `https://formiqstudio.in/blog/${post.slug}`,
          tags: post.tags,
          wordCount: post.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length,
          timeRequired: `PT${post.readingTime}M`,
        }}
      />
      <StructuredData
        type="breadcrumb"
        data={{
          items: [
            { name: "Home", url: "https://formiqstudio.in" },
            { name: "Blog", url: "https://formiqstudio.in/blog" },
            { name: post.category, url: `https://formiqstudio.in/blog/category/${post.category.toLowerCase().replace(/ /g, '-')}` },
            { name: post.title, url: `https://formiqstudio.in/blog/${post.slug}` },
          ]
        }}
      />

      <div className="bg-background text-foreground pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href={`/blog/category/${post.category.toLowerCase().replace(/ /g, '-')}`}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground rounded-sm link-draw focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {post.category}
                </Link>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formattedDate}
                </span>
              </div>

              <h1 className="font-display text-[2.4rem] leading-[1] sm:text-5xl lg:text-6xl font-bold tracking-[-0.045em] mb-6 text-foreground break-words">
                {post.title}
              </h1>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-border">
                  <Image
                    src={post.author.avatar || '/images/default-avatar.svg'}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center mb-6 text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {post.readingTime} min read
              </div>

              <div className="lg:hidden mt-4 mb-6 pt-4 border-t border-border">
                <p className="font-medium mb-3 flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share this article
                </p>
                <div className="flex space-x-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://formiqstudio.in/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=https://formiqstudio.in/blog/${post.slug}&text=${post.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=https://formiqstudio.in/blog/${post.slug}&title=${post.title}&summary=${post.excerpt}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-[22px] overflow-hidden border border-border bg-muted">
              <div className="relative w-full aspect-[16/9] lg:aspect-[3/2]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {post.coverImage.includes('unsplash.com') && (
                <p className="text-xs text-muted-foreground text-right px-3 py-1">
                  Photo from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">Unsplash</a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24">
                <div className="mb-8">
                  <p className="font-medium mb-4 text-foreground">Share</p>
                  <div className="flex flex-col space-y-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=https://formiqstudio.in/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=https://formiqstudio.in/blog/${post.slug}&text=${post.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=https://formiqstudio.in/blog/${post.slug}&title=${post.title}&summary=${post.excerpt}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground hover:border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="min-w-0">
                <div className="prose max-w-none"
                     dangerouslySetInnerHTML={{ __html: safeContent }} />


                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase().replace(/ /g, '-')}`}
                        className="inline-flex min-h-9 items-center px-4 rounded-full border border-border text-sm hover:border-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-border bg-card p-6 md:p-8 mt-12">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] mb-4">About the author</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-border">
                    <Image
                      src={post.author.avatar || '/images/default-avatar.svg'}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-lg">{post.author.name}</p>
                    <p className="text-muted-foreground mb-3">{post.author.role}</p>
                    <p className="text-muted-foreground">{post.author.bio}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="rounded-[22px] border border-border bg-card p-6">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.03em] mb-3">Subscribe to our newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4">Stay updated with our latest insights on web development, design, and digital marketing.</p>
                  <SidebarNewsletterForm />
                </div>


                {relatedPosts.length > 0 && (
                  <div className="rounded-[22px] border border-border bg-card p-6 mt-6">
                    <h3 className="font-display text-xl font-semibold tracking-[-0.03em] mb-4">Related articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.slice(0, 3).map((relatedPost) => (
                        <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group block">
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                              <Image
                                src={relatedPost.coverImage}
                                alt={relatedPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(relatedPost.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {relatedPosts.length > 3 && (
                      <Link href="/blog" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                        View more articles
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-16 lg:mt-24">
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] mb-10">Discover more</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                  <div className="h-full flex flex-col">
                    <div className="relative aspect-[16/10] rounded-[22px] overflow-hidden border border-border bg-muted">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-background text-foreground px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.12em]">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="pt-5 flex-grow flex flex-col">
                      <h3 className="font-display text-xl font-semibold tracking-[-0.03em] mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center mt-auto pt-4 border-t border-border">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={relatedPost.author.avatar || '/images/default-avatar.svg'}
                            alt="Testimonial"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{relatedPost.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(relatedPost.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto mt-16 lg:mt-24">
          <div className="tone-sand rounded-[22px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 md:p-12 lg:items-end">
              <div className="lg:col-span-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">The Formiq journal</p>
                <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-tight">New articles, <span className="text-primary">in your inbox</span></h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-[44ch]">What we learn building brands, websites and stores. No spam, unsubscribe any time.</p>
              </div>
              <div className="lg:col-span-6">
                <NewsletterForm />
                <p className="text-sm text-muted-foreground mt-4">
                  By subscribing you agree to our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <BlogAds />
    </>
  );
}