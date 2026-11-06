"use client";

import PageHeader from '@/components/studio/PageHeader';
import PageCTA from '@/components/studio/PageCTA';
import React, { useState, useEffect } from 'react';
import { PaintBucket, X, Sparkles, Loader2 } from 'lucide-react';
import { CreativeProject, getCreativeProjects } from '@/lib/portfolio';

const CreativesPortfolio = () => {
  const categories = ['All', 'Brand Identity', 'Social Media', 'Photography', 'Print Design', 'Presentation', 'Video', 'Packaging'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<CreativeProject | null>(null);
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getCreativeProjects();
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Portfolio / Creatives"
        title={<>Creative <span className="text-primary">design</span></>}
        intro="Branding, social media creatives, video editing, and marketing collateral that makes your brand unforgettable."
      />


      {/* Filter + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`min-h-11 px-5 rounded-full border text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                activeFilter === cat
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-foreground hover:border-foreground/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        )}

        {/* Compact horizontal cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {filtered.map(project => (
              <div
                key={project.id}
                className="group bg-card rounded-[22px] overflow-hidden transition-all duration-300 border border-border flex flex-row h-[180px] md:h-[200px] hover:border-foreground/30"
              >
                {/* Image */}
                <div className="w-[140px] md:w-[200px] shrink-0 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: project.image ? `url(${project.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    {!project.image && <PaintBucket className="w-8 h-8 text-muted-foreground/40" />}
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[11px] font-medium rounded-full">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col min-w-0 justify-between">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(project.tags || []).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full border border-primary/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">{project.client}</span>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg transition-colors"
                    >
                      Details <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-xl text-muted-foreground py-16">No projects in this category yet.</p>
        )}
      </div>

      {/* Detail Popup with Media Gallery */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border" data-lenis-prevent onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card p-5 border-b border-border flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-foreground">{selectedProject.title}</h2>
              <button onClick={() => setSelectedProject(null)} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="p-6">
              {selectedProject.image && (
                <div className="w-full h-48 bg-muted rounded-xl mb-5" style={{ backgroundImage: `url(${selectedProject.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <p className="text-muted-foreground mb-4">{selectedProject.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-foreground">Client</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.client}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-foreground">Category</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.category}</p>
                </div>
              </div>

              {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Deliverables</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.deliverables.map((d, i) => (
                      <span key={i} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Gallery */}
              {selectedProject.media_urls && selectedProject.media_urls.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Work Samples & Proof</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedProject.media_urls.map((url, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-border">
                        {url.match(/\.(mp4|webm|mov)$/i) ? (
                          <video src={url} controls className="w-full h-40 object-cover" />
                        ) : (
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <div className="w-full h-40 bg-muted hover:opacity-90 transition-opacity" style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PageCTA
        title="Need stunning creatives for your brand?"
        subtitle="From brand identity to social media content, we design everything your business needs."
        primary={{"label":"Start a project","href":"https://wa.me/919832078313?text=Hi%2C%20I%20need%20creative%20design%20services","external":true}}
      />
    </div>
  );
};

export default CreativesPortfolio;
