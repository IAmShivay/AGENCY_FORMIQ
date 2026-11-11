'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { WORK_QUERY_KEY, getWork } from '@/lib/work';
import CaseOverlay from './CaseOverlay';

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export function useCaseOverlay() {
  const [openCase, setOpenCase] = useState<{ slug: string; fromUrl: boolean } | null>(null);
  const covers = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get(WORK_QUERY_KEY);
    if (slug && getWork(slug)) setOpenCase({ slug, fromUrl: true });
  }, []);

  const coverRef = (slug: string) => (el: HTMLDivElement | null) => { covers.current[slug] = el; };

  const openFromCard = (e: MouseEvent, slug: string) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    setOpenCase({ slug, fromUrl: false });
  };

  const overlay = openCase && (
    <CaseOverlay
      key={openCase.slug}
      initialSlug={openCase.slug}
      fromUrl={openCase.fromUrl}
      getOrigin={(slug) => covers.current[slug] ?? null}
      onClosed={() => setOpenCase(null)}
    />
  );

  return { coverRef, openFromCard, overlay };
}
