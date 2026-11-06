import { EYEBROW, FOCUS_RING } from '@/components/studio/ui';

export { EYEBROW as ADMIN_EYEBROW, FOCUS_RING as ADMIN_FOCUS };

export const ADMIN_TITLE = 'font-display text-3xl sm:text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-foreground';
export const ADMIN_H2 = 'font-display text-xl font-semibold tracking-[-0.03em] text-foreground';

export const ADMIN_CARD = 'rounded-2xl border border-border bg-card text-card-foreground';
export const ADMIN_CARD_PAD = 'p-5 sm:p-6';
export const ADMIN_STAT_VALUE = 'font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] tabular-nums text-foreground';

export const ADMIN_TABLE_WRAP = `${ADMIN_CARD} overflow-x-auto`;
export const ADMIN_TABLE = 'w-full text-sm';
export const ADMIN_TH = 'px-4 py-3 text-left font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted-foreground whitespace-nowrap';
export const ADMIN_TD = 'px-4 py-3.5 align-middle text-foreground';
export const ADMIN_ROW = 'border-t border-border transition-colors hover:bg-muted/40';

export const ADMIN_BADGE = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] whitespace-nowrap';
export const ADMIN_TONE = {
  neutral: 'border-border bg-muted/50 text-muted-foreground',
  positive: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  negative: 'border-destructive/30 bg-destructive/10 text-destructive',
  accent: 'border-primary/30 bg-primary/10 text-primary',
} as const;
export type AdminTone = keyof typeof ADMIN_TONE;

const BTN_BASE = `inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none ${FOCUS_RING}`;
export const ADMIN_BTN_PRIMARY = `${BTN_BASE} bg-foreground text-background hover:bg-foreground/85`;
export const ADMIN_BTN_ACCENT = `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`;
export const ADMIN_BTN_OUTLINE = `${BTN_BASE} border border-border bg-transparent text-foreground hover:bg-muted`;
export const ADMIN_BTN_GHOST = `${BTN_BASE} text-muted-foreground hover:text-foreground hover:bg-muted`;
export const ADMIN_BTN_DANGER = `${BTN_BASE} border border-destructive/30 text-destructive hover:bg-destructive/10`;
export const ADMIN_ICON_BTN = `inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${FOCUS_RING}`;

export const ADMIN_INPUT = `h-10 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/30`;
export const ADMIN_LABEL = 'font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground';

export const ADMIN_EMPTY = 'py-16 text-center text-sm text-muted-foreground';
