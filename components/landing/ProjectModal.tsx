"use client";

import { useEffect, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { openLeadSheet } from '@/lib/lead-sheet';

export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  image: string;
  heroImage?: string;
  category: string;
  tags: string[];
  type: string;
  results: string;
  timeline: string;
  teamSize: string;
  technologies: string[];
  challenge: string;
  solution: string;
  keyFeatures: string[];
  impact: string;
  metrics: { value: string; label: string }[];
  testimonial?: { quote: string; author: string; position: string };
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card';
const LABEL = 'font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground';

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!project) return null;

  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
        exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90"
          onClick={onClose}
        >
          <motion.div
            {...panelMotion}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-4xl max-h-[90vh] bg-card text-card-foreground border border-border rounded-[22px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className={`absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-card text-foreground border border-border hover:bg-muted transition-colors ${FOCUS_RING}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto max-h-[90vh]" data-lenis-prevent>
              <div className="relative h-56 md:h-80 overflow-hidden bg-muted">
                <Image
                  src={project.heroImage || project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 896px) 896px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-10">
                <p className={LABEL}>{project.category}</p>
                <h2 id={titleId} className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.02]">
                  {project.title}
                </h2>
                <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">{project.description}</p>

                <dl className="mt-8 grid grid-cols-3 border-y border-border">
                  {[
                    { label: 'Timeline', value: project.timeline },
                    { label: 'Team size', value: project.teamSize },
                    { label: 'Result', value: project.results },
                  ].map((item) => (
                    <div key={item.label} className="py-4 pr-3 [&:not(:first-child)]:pl-3 [&:not(:first-child)]:border-l border-border">
                      <dt className={LABEL}>{item.label}</dt>
                      <dd className="mt-1 font-semibold text-sm md:text-base">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 grid gap-10 md:grid-cols-2">
                  <section>
                    <h3 className={LABEL}>Challenge</h3>
                    <p className="mt-3 text-foreground/85 leading-relaxed">{project.challenge}</p>
                  </section>
                  <section>
                    <h3 className={LABEL}>Our solution</h3>
                    <p className="mt-3 text-foreground/85 leading-relaxed">{project.solution}</p>
                  </section>
                </div>

                <section className="mt-10">
                  <h3 className={LABEL}>Key features</h3>
                  <ul className="mt-3 grid md:grid-cols-2 border-t border-border">
                    {project.keyFeatures.map((feature) => (
                      <li key={feature} className="py-3 border-b border-border text-sm md:pr-4">{feature}</li>
                    ))}
                  </ul>
                </section>

                <section className="mt-10">
                  <h3 className={LABEL}>Results &amp; impact</h3>
                  <p className="mt-3 text-foreground/85 leading-relaxed">{project.impact}</p>
                </section>

                <section className="mt-10">
                  <h3 className={LABEL}>Technologies used</h3>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] leading-relaxed">{project.technologies.join(' / ')}</p>
                </section>

                {project.testimonial && (
                  <figure className="mt-10 pt-8 border-t border-border">
                    <blockquote className="font-display text-xl md:text-2xl tracking-[-0.03em] leading-snug">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-semibold">{project.testimonial.author}</span>
                      <span className="text-muted-foreground"> · {project.testimonial.position}</span>
                    </figcaption>
                  </figure>
                )}

                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-ink btn-ink-invert h-14 px-7 bg-primary text-primary-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] ${FOCUS_RING}`}
                    >
                      View live project <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-ink h-14 px-7 border border-foreground/20 rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] ${FOCUS_RING}`}
                    >
                      View code
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => { onClose(); openLeadSheet(); }}
                    className={`btn-ink h-14 px-7 border border-foreground/20 rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] ${FOCUS_RING}`}
                  >
                    Start similar project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
