'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_LABEL } from './admin-ui';

export const PORTFOLIO_SECTIONS = [
  { key: 'websites', label: 'Websites', href: '/admin/portfolio/websites' },
  { key: 'apps', label: 'Applications', href: '/admin/portfolio/apps' },
  { key: 'designs', label: 'Design work', href: '/admin/portfolio/designs' },
  { key: 'creatives', label: 'Creatives', href: '/admin/portfolio/creatives' },
  { key: 'ads-seo', label: 'Ads & SEO', href: '/admin/portfolio/ads-seo' },
] as const;

export type PortfolioSectionKey = (typeof PORTFOLIO_SECTIONS)[number]['key'];

const NEW_ITEM_PARAM = 'new';

/** Opens the add form when the page was reached from another section's picker. */
export function useOpenFormFromPicker(open: () => void) {
  const openRef = useRef(open);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(NEW_ITEM_PARAM)) return;
    openRef.current();
    url.searchParams.delete(NEW_ITEM_PARAM);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
  }, []);
}

export default function PortfolioSectionPicker({ current }: { current: PortfolioSectionKey }) {
  const router = useRouter();
  return (
    <fieldset className="mb-6">
      <legend className={`${ADMIN_LABEL} mb-2 block`}>Show this project under</legend>
      <div className="flex flex-wrap gap-2">
        {PORTFOLIO_SECTIONS.map((s) => {
          const active = s.key === current;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={active}
              onClick={() => !active && router.push(`${s.href}?${NEW_ITEM_PARAM}=1`)}
              className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                active ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Each section has its own fields, so switching opens that section&apos;s form.</p>
    </fieldset>
  );
}
