import type { ReactNode } from 'react';
import { CONTAINER, EYEBROW, H1 } from './ui';

interface PageHeaderProps {
  /** Mono eyebrow, e.g. "(01) About". */
  eyebrow: string;
  /** Sentence-case title; wrap one word in <span className="text-primary"> for the accent. */
  title: ReactNode;
  intro?: ReactNode;
  /** Optional right-hand column (buttons, meta, filters). */
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Studio sub page header: mono eyebrow, large left-aligned h1, short intro. */
export default function PageHeader({ eyebrow, title, intro, aside, children, className = '' }: PageHeaderProps) {
  return (
    <header className={`bg-background text-foreground pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 ${className}`}>
      <div className={CONTAINER}>
        <p className={`${EYEBROW} mb-6`}>{eyebrow}</p>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 min-w-0">
            <h1 className={`${H1} break-words`}>{title}</h1>
          </div>
          {(intro || aside) && (
            <div className="lg:col-span-4 space-y-6">
              {intro && <div className="text-base sm:text-lg text-muted-foreground leading-relaxed">{intro}</div>}
              {aside}
            </div>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}
