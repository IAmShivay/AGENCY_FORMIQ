"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const SocialProof = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const testimonials = [
    {
      name: "Mitch Newby",
      position: "Owner",
      company: "LuckShack",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "From idea to market in 15 days. Their rapid development process helped us beat our competition to market and capture 40% market share.",
      result: "40% market share"
    }
  ];

  const teamImages = [
    {
      title: "Our Development Team",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop",
      description: "Expert developers working on your MVP"
    },
    {
      title: "Modern Office Space",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
      description: "State-of-the-art development environment"
    },
    {
      title: "Collaborative Workspace",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
      description: "Where innovation meets execution"
    }
  ];

  const clientLogos = [
    {
      name: "TechStart Inc.",
      logo: "https://via.placeholder.com/120x60/3B82F6/FFFFFF?text=TechStart"
    },
    {
      name: "Global Logistics",
      logo: "https://via.placeholder.com/120x60/10B981/FFFFFF?text=GlobalLog"
    },
    {
      name: "E-commerce Plus",
      logo: "https://via.placeholder.com/120x60/8B5CF6/FFFFFF?text=EcomPlus"
    },
    {
      name: "FinanceFlow",
      logo: "https://via.placeholder.com/120x60/F59E0B/FFFFFF?text=FinFlow"
    },
    {
      name: "HealthTech",
      logo: "https://via.placeholder.com/120x60/EF4444/FFFFFF?text=HealthTech"
    },
    {
      name: "EduSmart",
      logo: "https://via.placeholder.com/120x60/06B6D4/FFFFFF?text=EduSmart"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
            }}
          >
            <div className="w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 animated-gradient-text">
              What our clients say
            </h2>
            <p className="text-sm text-muted-foreground">
              Real results from real founders who chose our 15-day MVP process
            </p>
          </motion.div>

          {/* Team Images Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {teamImages.map((team, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Image
                    src={team.image}
                    alt={team.title}
                    width={400}
                    height={250}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="text-sm font-semibold">{team.title}</h4>
                    <p className="text-xs opacity-90">{team.description}</p>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                className="bg-gradient-to-br from-card via-card/95 to-primary/5 rounded-lg p-4 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg relative overflow-hidden flex flex-col h-full"
              >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-8 translate-x-8"></div>

                {/* Rating */}
                <div className="flex items-center mb-3 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-primary fill-current" />
                  ))}
                  <span className="ml-2 text-xs text-primary font-medium">5.0</span>
                </div>

                {/* Testimonial Text - Flexible height */}
                <div className="flex-1 mb-4 relative z-10">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Result Highlight - Fixed position */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-md p-2 mb-3 border border-primary/20 relative z-10">
                  <p className="text-primary font-semibold text-xs flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                    {testimonial.result}
                  </p>
                </div>

                {/* Author - Fixed at bottom */}
                <div className="flex items-center relative z-10 mt-auto">
                  <div className="relative">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-3 border-2 border-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.position}
                    </p>
                    <p className="text-xs text-primary font-medium truncate">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
