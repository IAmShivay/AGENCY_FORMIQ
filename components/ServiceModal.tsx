"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, Star, Users, Calendar, Target } from 'lucide-react';


interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    description: string;
    icon: React.ElementType;
    features?: string[];
    benefits?: string[];
    process?: string[];
    caseStudy?: {
      title: string;
      client: string;
      challenge: string;
      solution: string;
      results: string[];
      image: string;
      testimonial?: {
        quote: string;
        author: string;
        role: string;
      };
    };
    pricing?: {
      starting: string;
      timeline: string;
    };
  };
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
  const IconComponent = service.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              opacity: { duration: 0.3 }
            }}
            className="fixed top-4 left-4 right-4 bottom-4 md:top-8 md:left-8 md:right-8 md:bottom-8 lg:left-[12%] lg:right-[12%] xl:left-[18%] xl:right-[18%] bg-background rounded-2xl shadow-2xl z-50 flex flex-col max-h-[92vh] border border-border/20"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-3 md:p-6 border-b border-border/20 flex-shrink-0">
              <motion.button
                onClick={onClose}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--background))"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center group"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </motion.div>
              </motion.button>

              <div className="flex items-center gap-2 md:gap-4 pr-10 md:pr-12">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/20 rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 md:w-8 md:h-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base md:text-2xl font-bold text-foreground mb-0.5 md:mb-2 truncate">{service.title}</h2>
                  <p className="text-xs md:text-base text-muted-foreground line-clamp-2">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 min-h-0 scroll-smooth custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                
                {/* Features */}
                {service.features && (
                  <div>
                    <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-1.5 md:gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-primary/5 rounded-lg">
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" />
                          <span className="text-xs md:text-base text-foreground leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {service.benefits && (
                  <div>
                    <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      Benefits
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                      {service.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-1.5 md:gap-2 p-2 md:p-3 bg-card border border-border rounded-lg">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-1 md:mt-2 flex-shrink-0"></div>
                          <span className="text-xs md:text-base text-muted-foreground leading-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process */}
                {service.process && (
                  <div>
                    <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      Our Process
                    </h3>
                    <div className="space-y-2 md:space-y-4">
                      {service.process.map((step, index) => (
                        <div key={index} className="flex items-start gap-2 md:gap-4 p-2 md:p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-xs md:text-base text-foreground pt-0.5 md:pt-1 leading-tight md:leading-normal">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Study */}
                {service.caseStudy && (
                  <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 p-3 md:p-6 rounded-xl md:rounded-2xl border border-primary/10">
                    <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      Case Study: {service.caseStudy.title}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                      <div className="space-y-2 md:space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm md:text-base text-primary mb-0.5 md:mb-1">Client</h4>
                          <p className="text-xs md:text-base text-muted-foreground">{service.caseStudy.client}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm md:text-base text-primary mb-0.5 md:mb-1">Challenge</h4>
                          <p className="text-xs md:text-base text-muted-foreground leading-tight md:leading-normal">{service.caseStudy.challenge}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm md:text-base text-primary mb-0.5 md:mb-1">Solution</h4>
                          <p className="text-xs md:text-base text-muted-foreground leading-tight md:leading-normal">{service.caseStudy.solution}</p>
                        </div>
                      </div>

                      <div className="space-y-2 md:space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm md:text-base text-primary mb-0.5 md:mb-1">Results</h4>
                          <ul className="space-y-1">
                            {service.caseStudy.results.map((result, index) => (
                              <li key={index} className="flex items-start gap-1.5 md:gap-2">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-xs md:text-sm text-muted-foreground leading-tight">{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {service.caseStudy.testimonial && (
                          <div className="bg-background/50 p-2 md:p-3 rounded-lg border border-border/50">
                            <blockquote className="text-xs md:text-sm text-muted-foreground italic mb-1 md:mb-2 leading-tight">
                              "{service.caseStudy.testimonial.quote}"
                            </blockquote>
                            <div className="text-xs">
                              <div className="font-semibold text-foreground">{service.caseStudy.testimonial.author}</div>
                              <div className="text-muted-foreground">{service.caseStudy.testimonial.role}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing */}
                {service.pricing && (
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 md:p-6 rounded-xl md:rounded-2xl border border-primary/20">
                    <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      Investment & Timeline
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="text-center">
                        <div className="text-xl md:text-3xl font-bold text-primary mb-1 md:mb-2">{service.pricing.starting}</div>
                        <div className="text-xs md:text-base text-muted-foreground">Starting Investment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl md:text-3xl font-bold text-accent mb-1 md:mb-2">{service.pricing.timeline}</div>
                        <div className="text-xs md:text-base text-muted-foreground">Delivery Timeline</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="text-center pt-3 md:pt-4 border-t border-border/20">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Today
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                  <p className="text-muted-foreground text-xs mt-2">
                    Free consultation • No commitment required
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;