'use client';

import { useEffect } from 'react';
import { trackLinkClick } from '@/lib/meta-pixel';

const ConversionTracker = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const source = anchor.getAttribute('data-track-source') || window.location.pathname;
      trackLinkClick(href, source);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
};

export default ConversionTracker;
