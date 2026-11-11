import type { CSSProperties, ReactNode } from 'react';

const ORU = {
  forest: '#1F3B2D',
  turmeric: '#E3A23B',
  clay: '#B4532F',
  rice: '#F3EDE0',
  ink: '#16130F',
  stone: '#D8CDB6',
} as const;

const PRODUCTS = [
  { name: 'Moringa', note: 'Leaf powder · 200 g', body: ORU.forest, label: ORU.rice, text: ORU.forest },
  { name: 'Turmeric', note: 'Lakadong · 150 g', body: ORU.turmeric, label: ORU.rice, text: ORU.ink },
  { name: 'Millet', note: 'Ragi flour · 500 g', body: ORU.clay, label: ORU.rice, text: ORU.ink },
] as const;

type Product = (typeof PRODUCTS)[number];

const PATTERN_COUNT = 24;
const PATTERN_ACCENT_EVERY = 5;
const PATTERN_TURN_DEG = 45;

function OruMark({ color, gap, className = '', style }: { color: string; gap: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth="6" />
      <rect x="4" y="18.5" width="32" height="3" fill={gap} />
    </svg>
  );
}

export function OruLogo({ color, gap, className = '' }: { color: string; gap: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.18em] ${className}`} style={{ color }}>
      <OruMark color={color} gap={gap} className="h-[0.8em] w-[0.8em]" />
      <span className="font-serif italic leading-none tracking-[-0.02em]">oru</span>
    </span>
  );
}

const Grain = () => <div aria-hidden="true" className="grain absolute inset-0" />;

function Frame({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative isolate overflow-hidden rounded-[22px] ${className}`} style={style}>
      {children}
      <Grain />
    </div>
  );
}

function Pouch({ p, className = '', style }: { p: Product; className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[14%_14%_10%_10%/9%_9%_6%_6%]" style={{ background: p.body }}>
        <div className="absolute inset-x-0 top-0 h-[7%] bg-black/10" />
        <div className="absolute inset-x-[9%] bottom-[9%] top-[30%] flex flex-col justify-between rounded-[8%] p-[9%]" style={{ background: p.label, color: p.text }}>
          <OruLogo color={p.text} gap={p.label} className="text-[clamp(14px,2.4vw,30px)]" />
          <div>
            <p className="font-serif text-[clamp(16px,2.8vw,36px)] italic leading-none">{p.name}</p>
            <p className="mt-[6%] font-mono text-[clamp(6px,0.75vw,10px)] uppercase tracking-[0.14em] opacity-70">{p.note}</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-white/10" />
      </div>
      <div aria-hidden="true" className="mx-auto mt-[4%] h-[3%] w-[80%] rounded-[50%] bg-black/25 blur-md" />
    </div>
  );
}

function Jar({ p }: { p: Product }) {
  return (
    <div className="relative w-full">
      <div className="mx-auto h-[0.9rem] w-[78%] rounded-t-md sm:h-6" style={{ background: ORU.ink }} />
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[22%] rounded-t-[10%]" style={{ background: p.body }}>
        <div className="absolute inset-x-0 top-[28%] h-[44%] px-[10%] py-[8%]" style={{ background: p.label, color: p.text }}>
          <OruLogo color={p.text} gap={p.label} className="text-[clamp(12px,1.8vw,22px)]" />
          <p className="mt-[8%] font-serif text-[clamp(14px,2vw,26px)] italic leading-none">{p.name}</p>
        </div>
        <div className="absolute inset-y-0 left-[12%] w-[6%] bg-white/15" />
      </div>
    </div>
  );
}

export function OruHero() {
  return (
    <Frame className="aspect-[6/5] sm:aspect-[16/9]" style={{ background: ORU.forest }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ background: `radial-gradient(60% 55% at 50% 30%, ${ORU.turmeric}33, transparent 70%)` }} />
      <div className="absolute inset-x-[8%] bottom-[10%] grid grid-cols-3 items-end gap-[4%]">
        <Pouch p={PRODUCTS[1]} style={{ transform: 'rotate(-4deg) translateY(4%)' }} />
        <Pouch p={PRODUCTS[0]} className="z-10" style={{ transform: 'scale(1.12)' }} />
        <Pouch p={PRODUCTS[2]} style={{ transform: 'rotate(4deg) translateY(4%)' }} />
      </div>
    </Frame>
  );
}

export function OruIdentity() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
      <Frame className="flex aspect-[4/3] items-center justify-center sm:col-span-4 sm:aspect-auto sm:min-h-[420px]" style={{ background: ORU.turmeric }}>
        <OruLogo color={ORU.ink} gap={ORU.turmeric} className="text-[clamp(64px,12vw,160px)]" />
      </Frame>
      <Frame className="flex aspect-square items-center justify-center sm:col-span-2 sm:aspect-auto" style={{ background: ORU.forest }}>
        <OruMark color={ORU.rice} gap={ORU.forest} className="w-1/3" />
      </Frame>
      <Frame className="aspect-[4/3] sm:col-span-3 sm:aspect-[16/10]" style={{ background: ORU.rice }}>
        <div className="absolute inset-0 grid grid-cols-6 place-items-center gap-2 p-6">
          {Array.from({ length: PATTERN_COUNT }, (_, i) => (
            <OruMark
              key={i}
              color={i % PATTERN_ACCENT_EVERY === 0 ? ORU.clay : ORU.forest}
              gap={ORU.rice}
              className="w-full max-w-[56px]"
              style={{ transform: `rotate(${(i % 4) * PATTERN_TURN_DEG}deg)` }}
            />
          ))}
        </div>
      </Frame>
      <Frame className="flex aspect-[4/3] flex-col justify-between p-8 sm:col-span-3 sm:aspect-[16/10]" style={{ background: ORU.clay, color: ORU.rice }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-80">Shipping box · lid</p>
        <p className="max-w-[14ch] font-serif text-[clamp(32px,4.5vw,56px)] italic leading-[0.95]">Grown slowly, packed by hand.</p>
        <OruLogo color={ORU.rice} gap={ORU.clay} className="text-3xl" />
      </Frame>
    </div>
  );
}

export function OruPackaging() {
  return (
    <Frame className="px-[8%] pb-[8%] pt-[12%]" style={{ background: ORU.stone }}>
      <div className="grid grid-cols-3 items-end gap-[5%]">
        {PRODUCTS.map((p) => <Jar key={p.name} p={p} />)}
      </div>
      <div aria-hidden="true" className="mt-[3%] h-px w-full bg-black/15" />
    </Frame>
  );
}

function BrowserChrome({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-black/10 bg-white">
      <div className="flex items-center gap-3 border-b border-black/10 bg-[#F4F2EE] px-4 py-2.5">
        <div className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-black/15" />)}</div>
        <div className="mx-auto w-1/2 truncate rounded-full bg-white px-3 py-1 text-center font-mono text-[10px] text-black/50">{url}</div>
      </div>
      {children}
    </div>
  );
}

export function OruStore() {
  return (
    <Frame className="p-[5%] sm:p-[6%]" style={{ background: ORU.forest }}>
      <div className="grid items-end gap-[5%] lg:grid-cols-[1fr_auto]">
        <BrowserChrome url="oru.example">
          <div style={{ background: ORU.rice, color: ORU.ink }}>
            <div className="flex items-center justify-between px-[5%] py-4">
              <OruLogo color={ORU.forest} gap={ORU.rice} className="text-xl" />
              <div className="hidden gap-5 font-mono text-[9px] uppercase tracking-[0.14em] opacity-70 sm:flex"><span>Shop</span><span>Farms</span><span>Recipes</span><span>Bag (2)</span></div>
            </div>
            <div className="grid grid-cols-5 gap-[4%] px-[5%] pb-[6%] pt-[3%]">
              <div className="col-span-3 self-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">New harvest</p>
                <p className="mt-2 font-serif text-[clamp(22px,3.6vw,48px)] italic leading-[0.95]" style={{ color: ORU.forest }}>Moringa, picked at sunrise.</p>
                <span className="mt-4 inline-block rounded-full px-4 py-2 text-[10px] font-semibold" style={{ background: ORU.forest, color: ORU.rice }}>Shop moringa</span>
              </div>
              <div className="col-span-2"><Pouch p={PRODUCTS[0]} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-black/10 px-[5%] py-[4%]">
              {PRODUCTS.map((p) => (
                <div key={p.name} className="rounded-lg bg-white p-2">
                  <div className="rounded-md px-[12%] pt-[10%]" style={{ background: `${p.body}22` }}><Pouch p={p} /></div>
                  <p className="mt-2 text-[10px] font-semibold">{p.name}</p>
                  <p className="font-mono text-[8px] opacity-60">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        </BrowserChrome>
        <div className="mx-auto hidden w-[200px] overflow-hidden rounded-[30px] border-[6px] border-black/80 lg:block" style={{ background: ORU.rice }}>
          <div className="px-4 pb-6 pt-8">
            <OruLogo color={ORU.forest} gap={ORU.rice} className="text-lg" />
            <div className="mt-4 rounded-xl px-6 pt-5" style={{ background: `${ORU.turmeric}33` }}><Pouch p={PRODUCTS[1]} /></div>
            <p className="mt-3 font-serif text-2xl italic" style={{ color: ORU.forest }}>Turmeric</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-60">Subscribe & save 10%</p>
            <span className="mt-3 block rounded-full py-2 text-center text-[11px] font-semibold" style={{ background: ORU.forest, color: ORU.rice }}>Add to bag</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
