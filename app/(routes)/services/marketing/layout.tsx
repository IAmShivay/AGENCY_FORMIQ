import type { Metadata } from 'next';
import { NOINDEX_METADATA } from '@/lib/route-config';

export const metadata: Metadata = NOINDEX_METADATA;

export default function ServicesMarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
