import type { Metadata } from 'next';
import { NOINDEX_METADATA } from '@/lib/route-config';

export const metadata: Metadata = NOINDEX_METADATA;

export default function ServicesCheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
