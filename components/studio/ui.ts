/** Shared class strings for the studio marketing pages (app/(routes)). Tokens only. */

export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Page gutters + max width, matching the homepage sections. */
export const CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

/** Vertical rhythm for a full section. */
export const SECTION_Y = 'py-14 sm:py-28 lg:py-32';

/** Mono indexed eyebrow, e.g. "(01) Services". */
export const EYEBROW = 'font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground';

/** Section heading (h2). */
export const H2 = 'font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em] text-foreground';

/** Page title (h1) for sub pages. */
export const H1 =
  'font-display text-[2.6rem] leading-[0.98] min-[400px]:text-5xl sm:text-6xl lg:text-7xl xl:text-[5.4rem] font-bold tracking-[-0.05em] text-foreground';

/** Primary pill button (fills with ink on hover). */
export const BTN_PRIMARY = `btn-ink btn-ink-invert group/cta h-14 px-7 bg-foreground text-background rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`;

/** Ember pill button, for the one accent moment in a section. */
export const BTN_EMBER = `btn-ink btn-ink-invert group/cta h-14 px-7 bg-primary text-primary-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`;

/** Outline pill button. */
export const BTN_OUTLINE = `btn-ink group/cta h-14 px-7 border border-foreground/30 text-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`;

/** Two-digit index, e.g. 1 → "01". */
export const RAIL_TO_SM = '-mx-4 px-4 scroll-px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0';
export const RAIL_TO_MD = '-mx-4 px-4 scroll-px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0 md:overflow-visible md:pb-0';
export const RAIL_ITEM = 'w-[82%] flex-shrink-0 snap-start';

export const pad2 = (n: number) => String(n).padStart(2, '0');
