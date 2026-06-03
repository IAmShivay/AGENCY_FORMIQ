'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogPosts, BlogPost } from '@/lib/blog';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LatestBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const allPosts = await getBlogPosts();
        // Get the latest 6 posts
        setPosts(allPosts.slice(0, 6));
      } catch (error) {
        console.error('Error fetching latest blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with our latest insights, tips, and industry trends
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-secondary"></div>
                <div className="p-6">
                  <div className="h-4 bg-secondary rounded mb-2"></div>
                  <div className="h-6 bg-secondary rounded mb-3"></div>
                  <div className="h-4 bg-secondary rounded mb-4"></div>
                  <div className="h-4 bg-secondary rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            No blog posts available at the moment. Check back soon!
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Visit Blog
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Stay updated with our latest insights, tips, and industry trends
          </p>
        </div>

        {/* Blog Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '.blog-swiper-button-prev',
              nextEl: '.blog-swiper-button-next',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {posts.map((post) => (
              <SwiperSlide key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col overflow-hidden">
                    {/* Blog Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-none"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Meta Info */}
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{post.readingTime} min read</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Author */}
                      <div className="flex items-center mt-auto pt-4 border-t border-border">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">{post.author.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="blog-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="blog-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            View All Posts
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
