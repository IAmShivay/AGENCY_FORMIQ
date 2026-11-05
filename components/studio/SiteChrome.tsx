'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Pages that ship their own minimal header/footer (ad landing pages).
const BARE_PREFIXES = ['/landing'];

/** Renders the global site chrome (header, footer) except on pages that bring their own. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  if (BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) return null;
  return <>{children}</>;
}
