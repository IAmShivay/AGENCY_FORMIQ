'use client';

import { useState, useRef } from 'react';
import { Play, Star, Quote, X, Linkedin, Mail, MessageCircle, ChevronLeft, ChevronRight, ExternalLink, Youtube } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import SectionHeader from './ui/SectionHeader';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface VideoReview {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  thumbnail: string;
  videoUrl: string;
  youtubeUrl: string;
  quote: string;
  projectType: string;
  projectValue: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const videoReviews: VideoReview[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Solutions',
    rating: 5,
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    quote: 'FormiqStudio delivered our MVP in exactly 15 days. The quality exceeded our expectations.',
    projectType: 'SaaS Platform',
    projectValue: '$50K',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen',
      email: 'sarah@techflow.com'
    }
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Founder',
    company: 'StartupX',
    rating: 5,
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    quote: 'Professional team, clean code, and delivered on time. Highly recommend FormiqStudio!',
    projectType: 'E-commerce App',
    projectValue: '$75K',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/marcusrodriguez',
      twitter: 'https://twitter.com/marcusr',
      email: 'marcus@startupx.com'
    }
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'Product Manager',
    company: 'InnovateCorp',
    rating: 5,
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    quote: 'The best development agency we\'ve worked with. Exceptional communication throughout.',
    projectType: 'Mobile App',
    projectValue: '$100K',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/emilywatson',
      email: 'emily@innovatecorp.com'
    }
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'CEO',
    company: 'DataVision',
    rating: 5,
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    quote: 'FormiqStudio transformed our vision into a scalable, robust platform that handles millions of users.',
    projectType: 'Analytics Platform',
    projectValue: '$150K',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/davidkim',
      twitter: 'https://twitter.com/davidkim',
      email: 'david@datavision.com'
    }
  },
  {
    id: '5',
    name: 'Lisa Johnson',
    role: 'VP of Technology',
    company: 'FutureTech',
    rating: 5,
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    quote: 'Outstanding work quality and timely delivery. They understood our requirements perfectly.',
    projectType: 'Web Platform',
    projectValue: '$80K',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/lisajohnson',
      twitter: 'https://twitter.com/lisaj',
      email: 'lisa@futuretech.com'
    }
  },
  {
    id: '6',
    name: 'Robert Chen',
    role: 'Founder',
    company: 'InnovateNow',
    rating: 5,
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    quote: 'Incredible attention to detail and user experience. FormiqStudio exceeded all our expectations.',
    projectType: 'Mobile App',
    projectValue: '$120K',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/robertchen',
      email: 'robert@innovatenow.com'
    }
  }
];

export default function VideoReviews() {
  const [playingInline, setPlayingInline] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-background to-background/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MessageCircle className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary">Client Testimonials</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 agency-text-gradient">
            Success Stories
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear directly from our clients about their transformative experience working with our expert team
          </p>
        </motion.div>

        {/* Video Reviews Section with External Navigation */}
        <div className="relative max-w-7xl mx-auto">
          {/* Custom Navigation Buttons - Outside Container */}
          <div className="swiper-button-prev-custom absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-background transition-colors duration-200 shadow-lg border border-border/20">
            <ChevronLeft className="w-6 h-6 text-primary" />
          </div>
          <div className="swiper-button-next-custom absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-background transition-colors duration-200 shadow-lg border border-border/20">
            <ChevronRight className="w-6 h-6 text-primary" />
          </div>

          {/* Video Reviews Slider */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              speed={500}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="video-reviews-swiper !pb-12"
              style={{
                '--swiper-pagination-color': 'hsl(var(--primary))',
                '--swiper-pagination-bullet-inactive-color': 'hsl(var(--primary))',
                '--swiper-pagination-bullet-inactive-opacity': '0.3',
              } as React.CSSProperties}
            >
              {videoReviews.map((review, index) => {
                const isCenter = index === activeSlide;
                return (
                  <SwiperSlide key={review.id}>
                    <div
                      className="premium-card premium-card-hover group h-full transition-shadow duration-300"
                    >
                    {/* Video Thumbnail */}
                    <div className="relative overflow-hidden rounded-t-xl">
                      {playingInline === review.id ? (
                        <div className="aspect-video">
                          <iframe
                            src={review.videoUrl}
                            className="w-full h-full"
                            style={{ border: 'none' }}
                            allowFullScreen
                            title={`${review.name} Review Video`}
                          />
                        </div>
                      ) : (
                        <>
                          <img
                            src={review.thumbnail}
                            alt={`${review.name} video review`}
                            className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/50">
                            <button
                              onClick={() => setPlayingInline(review.id)}
                              className="w-16 h-16 bg-background/95 rounded-full flex items-center justify-center hover:bg-background transition-colors duration-200 shadow-lg border border-border/20"
                              title="Play video"
                            >
                              <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                            </button>
                          </div>
                          {/* Small YouTube Icon */}
                          <div className="absolute bottom-4 right-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(review.youtubeUrl, '_blank');
                              }}
                              className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg"
                              title="Watch on YouTube"
                            >
                              <Youtube className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                      {playingInline !== review.id && (
                        <>
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                              {review.projectType}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                              {review.projectValue}
                            </span>
                          </div>
                        </>
                      )}
                      {playingInline === review.id && (
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => setPlayingInline(null)}
                            className="w-8 h-8 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors duration-200 shadow-lg border border-border/20"
                            title="Close video"
                          >
                            <X className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="p-6 flex flex-col h-full">
                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({review.rating}.0)</span>
                      </div>

                      {/* Quote */}
                      <div className="mb-6 flex-grow">
                        <Quote className="w-6 h-6 text-primary mb-3" />
                        <p className="text-foreground leading-relaxed italic line-clamp-3">"{review.quote}"</p>
                      </div>

                      {/* Client Info */}
                      <div className="border-t border-border pt-4 mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-foreground truncate">{review.name}</h4>
                            <p className="text-muted-foreground text-sm truncate">{review.role} at {review.company}</p>
                          </div>
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                            <span className="text-primary font-bold text-sm">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground mr-2">Connect:</span>
                          {review.socialMedia.linkedin && (
                            <a
                              href={review.socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {review.socialMedia.twitter && (
                            <a
                              href={review.socialMedia.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors shadow-sm"
                              title="X (Twitter)"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </a>
                          )}
                          {review.socialMedia.email && (
                            <a
                              href={`mailto:${review.socialMedia.email}`}
                              className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-sm"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors ml-1 shadow-sm"
                            title="Contact via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                );
              })}
            </Swiper>
          </motion.div>
        </div>



        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="premium-card-gradient p-8 rounded-xl max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to become our next success story?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="premium-button">
                Start Your Project Today
              </button>
              <button className="premium-button-outline">
                Schedule a Call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}