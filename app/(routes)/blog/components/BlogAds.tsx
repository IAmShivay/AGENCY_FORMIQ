'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/hooks/use-consent';
import { MONETAG_CONFIG, shouldLoadAds } from '@/lib/ads/config';
import { injectAdScript, removeAdScript, scheduleAfterInteractive } from '@/lib/ads/inject';
import { isAdEligiblePath } from '@/lib/ads/routes';

export default function BlogAds() {
  const pathname = usePathname();
  const { advertising } = useConsent();
  const injectedRef = useRef(false);

  const allowed = shouldLoadAds({
    config: MONETAG_CONFIG,
    advertisingConsent: advertising,
    pathEligible: isAdEligiblePath(pathname),
  });

  useEffect(() => {
    const src = MONETAG_CONFIG.src;
    if (!allowed || !src || injectedRef.current) return;

    const cancel = scheduleAfterInteractive(() => {
      injectedRef.current = true;
      injectAdScript({ src, zone: MONETAG_CONFIG.zone });
    });

    return () => {
      cancel();
      removeAdScript();
    };
  }, [allowed]);

  return null;
}
