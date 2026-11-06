import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';
import OpenSheetButton from '@/components/OpenSheetButton';
import { BTN_PRIMARY, CONTAINER, EYEBROW, FOCUS_RING } from './ui';

interface CTALink {
  label: string;
  href: string;
  external?: boolean;
}

interface PageCTAProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primary: { label: string };
  secondary?: CTALink;
}

const linkProps = (l: CTALink) => (l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {});

export default function PageCTA({ eyebrow = 'Next step', title, subtitle, primary, secondary }: PageCTAProps) {
  const SecondaryTag = secondary?.external ? 'a' : Link;
  return (
    <section className="tone-ember py-20 sm:py-28">
      <div className={CONTAINER}>
        <p className={`${EYEBROW} mb-6`}>{eyebrow}</p>
        <h2 className="font-display text-[2.6rem] leading-[0.98] sm:text-7xl lg:text-8xl font-bold tracking-[-0.05em] max-w-5xl break-words">
          {title}
        </h2>
        <div className="mt-10 sm:mt-14 pt-8 border-t border-border grid gap-8 lg:grid-cols-[1fr,auto] lg:items-end">
          {subtitle ? <p className="text-base sm:text-lg text-foreground/80 max-w-xl leading-relaxed">{subtitle}</p> : <span />}
          <div className="flex flex-col min-[420px]:flex-row gap-3 min-[420px]:items-center">
            <Magnetic>
              <OpenSheetButton className={BTN_PRIMARY}>
                {primary.label}
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />
              </OpenSheetButton>
            </Magnetic>
            {secondary && (
              <SecondaryTag
                href={secondary.href}
                {...linkProps(secondary)}
                className={`inline-flex min-h-14 items-center justify-center gap-2 px-2 text-[15px] font-semibold rounded-sm ${FOCUS_RING}`}
              >
                <span className="link-draw">{secondary.label}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </SecondaryTag>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
