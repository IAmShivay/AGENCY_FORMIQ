import type { Metadata } from 'next';
import ThemeShowcase from '@/components/ThemeShowcase';
import { NOINDEX_METADATA } from '@/lib/route-config';

export const metadata: Metadata = NOINDEX_METADATA;

export default function ThemeShowcasePage() {
  return <ThemeShowcase />;
}
