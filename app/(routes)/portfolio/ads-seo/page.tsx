"use client";

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Search, ExternalLink, X, BarChart3, Loader2 } from 'lucide-react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { AdsSeoProject, getAdsSeoProjects } from '@/lib/portfolio';

const AdsSeoPortfolio = () => {
  const categories = ['All', 'Meta Ads', 'Google Ads', 'SEO', 'Google Business', 'YouTube Ads'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<AdsSeoProject | null>(null);
  const [projects, setProjects] = useState<AdsSeoProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getAdsSeoProjects();
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

  const categoryIcon = (cat: string) => {
    if (cat === 'Meta Ads') return <FaFacebookF className="w-3 h-3" />;
    if (cat.startsWith('Google') || cat === 'YouTube Ads') return <FaGoogle className="w-3 h-3" />;
    return <Search className="w-3 h-3" />;
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent pt-28 md:pt-36 lg:pt-44">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Target className="w-10 h-10 text-primary mr-3" />
              <h1 className="text-5xl md:text-6xl font-bold premium-text-gradient">
                Ads & SEO
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Data-driven Meta ads, Google campaigns, and SEO strategies that deliver measurable ROI.
            </p>
          </div>
        </div>
        <div className="absolute top-20 left-12 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-12 right-16 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-background transform -skew-y-2" />
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: 'Rs 50L+', label: 'Ad Spend Managed' },
            { value: '4.5x', label: 'Avg ROAS' },
            { value: '10K+', label: 'Leads Generated' },
            { value: '30+', label: 'Brands Scaled' },
          ].map((stat, i) => (
            <div key={i} className="bg-card p-6 rounded-xl shadow-md text-center border border-border/20">
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                activeFilter === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              {cat !== 'All' && categoryIcon(cat)}
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
                className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/20 flex flex-row h-[200px] md:h-[220px]"
              >
                {/* Image */}
                <div className="w-[140px] md:w-[200px] shrink-0 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-muted flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: project.image ? `url(${project.image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    {!project.image && <BarChart3 className="w-8 h-8 text-muted-foreground/40" />}
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[11px] font-medium rounded-full flex items-center gap-1">
                    {categoryIcon(project.category)} {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col min-w-0 justify-between">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.description}</p>

                    {/* Key metrics */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(project.metrics as { label: string; value: string }[]).slice(0, 3).map((m, i) => (
                          <div key={i} className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded text-[11px]">
                            <TrendingUp className="w-3 h-3 text-accent" />
                            <span className="font-semibold text-accent">{m.value}</span>
                            <span className="text-muted-foreground">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">{project.platform}</span>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg transition-colors"
                    >
                      Details <ExternalLink className="w-3 h-3" />
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
          <div className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border" onClick={e => e.stopPropagation()}>
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
              <p className="text-muted-foreground mb-5">{selectedProject.description}</p>

              {/* Metrics grid */}
              {selectedProject.metrics && (selectedProject.metrics as { label: string; value: string }[]).length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {(selectedProject.metrics as { label: string; value: string }[]).map((m, i) => (
                    <div key={i} className="bg-accent/10 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-accent">{m.value}</p>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-foreground">Client</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.client}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-foreground">Platform</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.platform}</p>
                </div>
              </div>

              {selectedProject.results && selectedProject.results.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Key Results</h4>
                  <ul className="space-y-1">
                    {selectedProject.results.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5 text-accent shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
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
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Proof & Results</h4>
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

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary-foreground">Ready to scale your business with ads & SEO?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Get a free audit of your current campaigns and discover growth opportunities.
          </p>
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20need%20help%20with%20ads%20and%20SEO" target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-3 bg-background hover:bg-background/90 text-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Get Free Audit
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdsSeoPortfolio;
