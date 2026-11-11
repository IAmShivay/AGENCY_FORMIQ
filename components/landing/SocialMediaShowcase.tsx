"use client";

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { ExternalLink, Users, ThumbsUp, Play, Briefcase } from 'lucide-react';

const platforms = [
  {
    name: 'Instagram',
    handle: '@formiqstudio',
    href: 'https://www.instagram.com/formiqstudio_/',
    icon: <FaInstagram className="w-6 h-6" />,
    color: 'from-[#833AB4] via-[#E1306C] to-[#F77737]',
    iconColor: 'text-[#E1306C]',
    bgColor: 'bg-[#E1306C]/10',
    stat: '5K+',
    statLabel: 'Followers',
    statIcon: <Users className="w-3.5 h-3.5" />,
    description: 'Reels, client work, design tips & behind-the-scenes',
  },
  {
    name: 'Facebook',
    handle: 'FormiqStudio',
    href: 'https://www.facebook.com/formiqstudio',
    icon: <FaFacebookF className="w-6 h-6" />,
    color: 'from-[#1877F2] to-[#4267B2]',
    iconColor: 'text-[#1877F2]',
    bgColor: 'bg-[#1877F2]/10',
    stat: '2K+',
    statLabel: 'Page Likes',
    statIcon: <ThumbsUp className="w-3.5 h-3.5" />,
    description: 'Updates, case studies, client success stories & offers',
  },
  {
    name: 'YouTube',
    handle: '@formiqstudio',
    href: 'https://www.youtube.com/@formiq-studio',
    icon: <FaYoutube className="w-6 h-6" />,
    color: 'from-[#FF0000] to-[#CC0000]',
    iconColor: 'text-[#FF0000]',
    bgColor: 'bg-[#FF0000]/10',
    stat: '50+',
    statLabel: 'Videos',
    statIcon: <Play className="w-3.5 h-3.5" />,
    description: 'Tutorials, client testimonials & marketing tips',
  },
  {
    name: 'LinkedIn',
    handle: 'FormiqStudio',
    href: 'https://www.linkedin.com/company/formiqstudio',
    icon: <FaLinkedinIn className="w-6 h-6" />,
    color: 'from-[#0A66C2] to-[#004182]',
    iconColor: 'text-[#0A66C2]',
    bgColor: 'bg-[#0A66C2]/10',
    stat: '1K+',
    statLabel: 'Connections',
    statIcon: <Briefcase className="w-3.5 h-3.5" />,
    description: 'Industry insights, company updates & B2B partnerships',
  },
];

const SocialMediaShowcase = () => {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-3 text-foreground">
            Follow Us on Social Media
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Stay updated with our latest work, tips, and behind-the-scenes content.
          </p>
        </div>

        {/* Mobile: 2-col compact grid */}
        <div className="grid grid-cols-2 sm:hidden gap-2.5">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-card border border-border hover:shadow-md transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg ${p.bgColor} flex items-center justify-center mb-2.5`}>
                <span className={p.iconColor}>{p.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">{p.name}</h3>
              <p className="text-[11px] text-muted-foreground mb-2">{p.handle}</p>
              <div className="flex items-center gap-1 text-[11px]">
                <span className={p.iconColor}>{p.statIcon}</span>
                <span className="font-semibold text-foreground">{p.stat}</span>
                <span className="text-muted-foreground">{p.statLabel}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Desktop: 4-col cards */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${p.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${p.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className={p.iconColor}>{p.icon}</span>
              </div>

              {/* Name & handle */}
              <h3 className="text-lg font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{p.handle}</p>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {p.description}
              </p>

              {/* Stat + Follow */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className={p.iconColor}>{p.statIcon}</span>
                  <span className="font-semibold text-foreground">{p.stat}</span>
                  <span className="text-muted-foreground">{p.statLabel}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Follow <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaShowcase;
