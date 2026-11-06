"use client";

import type { LucideIcon } from 'lucide-react';
import PageHeader from './studio/PageHeader';
import { CONTAINER, EYEBROW, FOCUS_RING, pad2 } from './studio/ui';
import { Linkedin, Twitter, Github } from 'lucide-react';

type SocialKey = 'linkedin' | 'twitter' | 'github';

interface TeamMember {
  name: string;
  role: string;
  social: Partial<Record<SocialKey, string>>;
}

const SOCIAL_ICONS: Record<SocialKey, { icon: LucideIcon; label: string }> = {
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  twitter: { icon: Twitter, label: 'X (Twitter)' },
  github: { icon: Github, label: 'GitHub' },
};

const team: TeamMember[] = [
  { name: 'Shivay Sharma', role: 'Founder and full-stack developer', social: {} },
  { name: 'Swagata Mahtree', role: 'Lead developer', social: {} },
  { name: 'Vishal Rajbhar', role: 'UX designer', social: {} },
  { name: 'K Chakraborty', role: 'Project manager', social: {} },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const Team = () => (
  <div className="bg-background text-foreground">
    <PageHeader
      eyebrow="(01) Team"
      title={<>Meet our <span className="text-primary">team</span></>}
      intro="Talented professionals dedicated to delivering exceptional results."
    />

    <section className={`pb-20 sm:pb-28 lg:pb-32`}>
      <div className={CONTAINER}>
        <ol className="border-t border-border">
          {team.map((member, i) => (
            <li
              key={member.name}
              className="grid grid-cols-[2.25rem_auto_minmax(0,1fr)] sm:grid-cols-[4rem_auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-x-3 sm:gap-x-6 gap-y-1 py-6 sm:py-8 border-b border-border"
            >
              <span className={EYEBROW}>{pad2(i + 1)}</span>
              <span
                aria-hidden="true"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-foreground/20 bg-card flex items-center justify-center font-display text-lg sm:text-xl font-semibold tracking-[-0.04em]"
              >
                {getInitials(member.name)}
              </span>
              <h2 className="min-w-0 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight">{member.name}</h2>
              <p className="col-start-3 sm:col-start-auto text-base text-muted-foreground">{member.role}</p>
              {Object.keys(member.social).length > 0 ? (
                <div className="col-start-3 sm:col-start-auto flex items-center gap-2">
                  {(Object.keys(SOCIAL_ICONS) as SocialKey[]).map((key) => {
                    const url = member.social[key];
                    if (!url) return null;
                    const { icon: Icon, label } = SOCIAL_ICONS[key];
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on ${label}`}
                        className={`w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors ${FOCUS_RING}`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <span className="hidden sm:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  </div>
);

export default Team;
