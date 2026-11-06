import Image from 'next/image';
import { CLIENT_LOGOS, hasExamples, visibleItems, type ClientLogo, type LogoStyle } from '@/lib/social-proof';
import { CONTAINER, EYEBROW } from '@/components/studio/ui';

const MIN_LOGOS = 4;
const MAX_LOGOS = 8;

const WORDMARK: Record<LogoStyle, string> = {
  display: 'font-display text-[26px] font-bold tracking-[-0.04em]',
  serif: 'font-serif text-[30px] italic tracking-[-0.01em]',
  mono: 'font-mono text-[15px] uppercase tracking-[0.22em]',
  light: 'font-display text-[26px] font-light lowercase tracking-[-0.02em]',
  wide: 'font-display text-[18px] font-semibold uppercase tracking-[0.42em]',
};

const Logo = ({ logo }: { logo: ClientLogo }) => (
  <li className="flex h-24 max-sm:h-20 max-sm:[&:nth-child(n+7)]:hidden items-center justify-center border-b border-r border-border px-6 text-muted-foreground transition-colors duration-500 hover:text-foreground">
    {logo.logoSrc ? (
      <Image src={logo.logoSrc} alt={logo.name} width={140} height={40} className="h-8 w-auto object-contain opacity-70 grayscale transition-opacity duration-500 hover:opacity-100" />
    ) : (
      <span className={`whitespace-nowrap ${WORDMARK[logo.style ?? 'display']}`}>{logo.name}</span>
    )}
  </li>
);

export default function ClientLogos() {
  const logos = visibleItems(CLIENT_LOGOS);
  if (logos.length < MIN_LOGOS) return null;

  return (
    <section aria-label="Selected clients" className="bg-background py-12 sm:py-20">
      <div className={`${CONTAINER} mb-8 flex flex-wrap items-center justify-between gap-3`}>
        <p className={EYEBROW}>Selected clients</p>
        {hasExamples(logos) && (
          <span className={`${EYEBROW} rounded-full border border-primary/40 px-3 py-1 text-primary`}>Sample logos · development only</span>
        )}
      </div>
      <div className={CONTAINER}>
        <ul className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-4">
          {logos.slice(0, MAX_LOGOS).map((l) => <Logo key={l.name} logo={l} />)}
        </ul>
      </div>
    </section>
  );
}
