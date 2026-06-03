import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import { getBlogPost, getRelatedPosts, getBlogPosts, BlogPost } from '@/lib/blog';
import StructuredData from '@/components/seo/StructuredData';

// Set dynamic rendering to ensure real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import NewsletterForm from '../components/NewsletterForm';
import SidebarNewsletterForm from '../components/SidebarNewsletterForm';

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
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | formiqstudio Blog`,
    description: post.excerpt,
    metadataBase: new URL('https://formiqstudio.com'),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://formiqstudio.com/blog/${post.slug}`,
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
      canonical: `https://formiqstudio.com/blog/${post.slug}`,
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

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      {/* Article Structured Data */}
      <StructuredData
        type="article"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            name: post.author.name,
            url: `https://formiqstudio.com/team/${post.author.name.toLowerCase().replace(' ', '-')}`
          },
          publisher: {
            name: "FormiqStudio",
            logo: "https://formiqstudio.com/images/logo.png"
          },
          url: `https://formiqstudio.com/blog/${post.slug}`,
          tags: post.tags
        }}
      />

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
        {/* Back to Blog */}
        <div className="mb-8 max-w-7xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-primary hover:underline transition-colors">
            {/* <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog */}
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Article Header */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href={`/blog/category/${post.category.toLowerCase().replace(/ /g, '-')}`}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  {post.category}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formattedDate}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center mb-6 text-gray-500 dark:text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {post.readingTime} min read
              </div>

              {/* Social Share - Mobile Only */}
              <div className="lg:hidden mt-4 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="font-medium mb-3 flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share this article
                </p>
                <div className="flex space-x-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://formiqstudio.com/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=https://formiqstudio.com/blog/${post.slug}&text=${post.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary/70 text-white rounded-full hover:bg-primary/80 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=https://formiqstudio.com/blog/${post.slug}&title=${post.title}&summary=${post.excerpt}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary/80 text-white rounded-full hover:bg-primary/90 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Image */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-xl">
              <div className="relative w-full aspect-[16/9] lg:aspect-[3/2]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Sidebar - Social Share & TOC (Desktop) */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24">
                <div className="mb-8">
                  <p className="font-medium mb-4 text-gray-700 dark:text-gray-300">Share</p>
                  <div className="flex flex-col space-y-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=https://formiqstudio.com/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=https://formiqstudio.com/blog/${post.slug}&text=${post.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-primary/70 text-white rounded-full hover:bg-primary/80 transition-colors flex items-center justify-center"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=https://formiqstudio.com/blog/${post.slug}&title=${post.title}&summary=${post.excerpt}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-primary/80 text-white rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Article Content */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary prose-img:rounded-lg"
                     dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

                {/* Tags */}
                <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase().replace(/ /g, '-')}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mt-8">
                <h3 className="text-xl font-bold mb-4">About the Author</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-lg">{post.author.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-3">{post.author.role}</p>
                    <p className="text-gray-600 dark:text-gray-300">{post.author.bio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Related Content */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-primary">Subscribe to our Newsletter</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Stay updated with our latest insights on web development, design, and digital marketing.</p>
                  <SidebarNewsletterForm />
                </div>

                {relatedPosts.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
                    <h3 className="font-bold text-lg mb-4 text-primary">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.slice(0, 3).map((relatedPost) => (
                        <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group block">
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={relatedPost.coverImage}
                                alt={relatedPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                      <Link href="/blog" className="text-primary text-sm font-medium hover:underline mt-4 inline-block">
                        View more articles
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* More Related Posts - Bottom Section */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-16 lg:mt-24">
            <h2 className="text-2xl font-bold mb-8 text-center">Discover More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-primary/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={relatedPost.author.avatar}
                            alt="Testimonial"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{relatedPost.author.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
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

        {/* Newsletter CTA */}
        <div className="max-w-7xl mx-auto mt-16 lg:mt-24">
          <div className="bg-gradient-to-r from-primary/10 via-primary/10 to-primary/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community</h3>
                <p className="text-lg mb-6">Get weekly insights on web development, design trends, and digital marketing strategies.</p>
                <NewsletterForm />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20"></div>
                <div className="h-full flex items-center justify-center p-12">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full"></div>
                    <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/20 rounded-full"></div>
                    <div className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl transform rotate-3">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-primary">
                          <Image
                            src="https://res.cloudinary.com/dyiso4ohk/image/upload/v1747285939/1702157335138_mrwrun.jpg"
                            alt="Testimonial"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Shiv Kumar Sharma</p>
                          <p className="text-xs text-gray-500">Web Developer</p>
                        </div>
                      </div>
                      <p className="text-sm italic">&quot;The formiqstudio newsletter has been an incredible resource for staying up-to-date with the latest web development trends. Highly recommended!&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}