import { ReactNode } from 'react';
import RouteCurtain from '@/components/studio/RouteCurtain';

/** Remounts per navigation, which is what drives the page-transition curtain. */
export default function RoutesTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteCurtain />
      {children}
    </>
  );
}
