"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ExternalLink, Github, Calendar, Users, Target, CheckCircle, ArrowRight, Code, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={project.heroImage || project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Project Title Overlay */}
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center mb-2">
                    <project.icon className="w-6 h-6 mr-2" />
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h2>
                  <p className="text-white/90 text-lg max-w-2xl">{project.description}</p>
                </div>
              </div>

              {/* Content */}
              <motion.div variants={contentVariants} className="p-6 md:p-8">
                {/* Project Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Timeline</div>
                    <div className="font-semibold">{project.timeline}</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Team Size</div>
                    <div className="font-semibold">{project.teamSize}</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Result</div>
                    <div className="font-semibold text-green-600">{project.results}</div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-primary" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Challenge */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-500" />
                    Challenge
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
                  </div>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    Our Solution
                  </h3>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                    <p className="text-muted-foreground leading-relaxed mb-4">{project.solution}</p>
                    
                    {/* Key Features */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {project.keyFeatures.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results & Impact */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    Results & Impact
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <p className="text-muted-foreground leading-relaxed mb-4">{project.impact}</p>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.metrics.map((metric: any, index: number) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                          <div className="text-sm text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Client Testimonial */}
                {project.testimonial && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Client Testimonial</h3>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                      <blockquote className="text-muted-foreground italic mb-4">
                        "{project.testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{project.testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">{project.testimonial.position}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  {project.liveUrl && (
                    <Button asChild className="flex-1">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Project
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const contactSection = document.getElementById('contact-form');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                        onClose();
                      }
                    }}
                    className="flex-1"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Similar Project
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
