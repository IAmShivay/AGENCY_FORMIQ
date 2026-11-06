import { gsap } from '@/lib/studio-motion';
import { LOGO_F_PARTS, LOGO_GAP_EM, LOGO_GRID, LOGO_LETTERS, LOGO_SPARKS, LOGO_STROKE, LOGO_VIEWBOX } from './logo-geometry';

const SVG_STYLE = { height: '1em' };
const WORD_STYLE = { ...SVG_STYLE, marginLeft: `${LOGO_GAP_EM}em` };
const CENTER = '50% 50%';
const BASELINE = '50% 100%';
const LEFT = '0% 50%';
const DISC_PIVOT = '0% 100%';

type Spark = { x: number; y: number; size: number };
const SparkRect = ({ s, ...rest }: { s: Spark } & Record<string, unknown>) => (
  <rect {...rest} className="wm-spark" x={s.x} y={s.y} width={s.size} height={s.size} />
);

export default function Wordmark({ className = '', full = false, grid = false }: { className?: string; full?: boolean; grid?: boolean }) {
  const { stem, arm, disc } = LOGO_F_PARTS;
  return (
    <span className={`wordmark ${full ? 'wm-full' : ''} ${className}`} role="img" aria-label="Formiq">
      <svg viewBox={LOGO_VIEWBOX.symbol} style={SVG_STYLE} className="wm-svg" aria-hidden="true">
        {grid && (
          <g className="wm-grid">
            {LOGO_GRID.map((d, i) => <path key={i} d={d} pathLength={1} vectorEffect="non-scaling-stroke" />)}
          </g>
        )}
        <g fill="currentColor">
          <rect data-wm-stem x={stem.x} y={stem.y} width={stem.w} height={stem.h} />
          <rect data-wm-arm x={arm.x} y={arm.y} width={arm.w} height={arm.h} />
          <path data-wm-disc d={disc} />
        </g>
        <SparkRect s={LOGO_SPARKS.symbol} data-wm-dot="" />
      </svg>
      <span className="wm-tail" aria-hidden="true">
        <svg viewBox={LOGO_VIEWBOX.word} style={WORD_STYLE} className="wm-svg">
          <g fill="none" stroke="currentColor" strokeWidth={LOGO_STROKE}>
            {LOGO_LETTERS.map((strokes, i) => (
              <g key={i}>
                {strokes.map((d, j) => <path key={j} className="wm-stroke" d={d} pathLength={1} />)}
              </g>
            ))}
          </g>
          <SparkRect s={LOGO_SPARKS.word} data-wm-dot-i="" />
        </svg>
      </span>
    </span>
  );
}

const parts = (root: Element) => ({
  grid: root.querySelectorAll('.wm-grid path'),
  stem: root.querySelector('[data-wm-stem]'),
  arm: root.querySelector('[data-wm-arm]'),
  disc: root.querySelector('[data-wm-disc]'),
  dot: root.querySelector('[data-wm-dot]'),
  dotI: root.querySelector('[data-wm-dot-i]'),
  strokes: root.querySelectorAll('.wm-stroke'),
});

export function wordmarkIn(root: Element, delay = 0, { construct = false } = {}) {
  const p = parts(root);
  const t = construct ? 0.45 : 0;
  const tl = gsap.timeline({ delay }).set(root, { autoAlpha: 1 });
  if (construct && p.grid.length) {
    tl.from(p.grid, { strokeDashoffset: 1, duration: 0.8, ease: 'power3.inOut', stagger: 0.04 }, 0)
      .to(p.grid, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, t + 1.3);
  }
  return tl
    .from(p.stem, { scaleY: 0, transformOrigin: BASELINE, duration: 0.7, ease: 'expo.out' }, t)
    .from(p.arm, { scaleX: 0, transformOrigin: LEFT, duration: 0.6, ease: 'expo.out' }, t + 0.2)
    .from(p.disc, { rotate: -90, autoAlpha: 0, transformOrigin: DISC_PIVOT, duration: 0.75, ease: 'expo.out' }, t + 0.32)
    .from(p.dot, { y: -LOGO_SPARKS.symbol.size * 2, rotate: -90, autoAlpha: 0, transformOrigin: CENTER, duration: 0.8, ease: 'expo.out' }, t + 0.45)
    .from(p.strokes, { strokeDashoffset: 1, duration: 0.9, ease: 'power3.inOut', stagger: 0.04 }, t + 0.4)
    .from(p.dotI, { y: -LOGO_SPARKS.word.size * 3, autoAlpha: 0, duration: 0.7, ease: 'expo.out' }, t + 1);
}

export function wordmarkOut(root: Element, { keepSpark = false } = {}) {
  const p = parts(root);
  const tl = gsap.timeline({ defaults: { ease: 'power3.in' } })
    .to(p.dotI, { y: -LOGO_SPARKS.word.size * 3, autoAlpha: 0, duration: 0.35 }, 0)
    .to(p.strokes, { strokeDashoffset: -1, duration: 0.55, stagger: 0.02 }, 0)
    .to(p.disc, { rotate: -90, autoAlpha: 0, transformOrigin: DISC_PIVOT, duration: 0.4 }, 0.1)
    .to(p.arm, { scaleX: 0, transformOrigin: LEFT, duration: 0.4 }, 0.2)
    .to(p.stem, { scaleY: 0, transformOrigin: BASELINE, duration: 0.45 }, 0.25);
  if (!keepSpark) tl.to(p.dot, { scale: 0, transformOrigin: CENTER, duration: 0.35 }, 0.3);
  return tl;
}

export function wordmarkHover(host: HTMLElement, root: Element) {
  const { dot, dotI } = parts(root);
  const enter = () => {
    gsap.timeline({ overwrite: 'auto', defaults: { transformOrigin: CENTER } })
      .to(dot, { rotate: 45, scale: 0.8, duration: 0.35, ease: 'power3.out' })
      .to(dot, { rotate: 90, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      .set(dot, { rotate: 0 });
    gsap.timeline({ overwrite: 'auto' })
      .to(dotI, { y: -LOGO_SPARKS.word.size, duration: 0.25, ease: 'power2.out' })
      .to(dotI, { y: 0, duration: 0.6, ease: 'bounce.out' });
  };
  host.addEventListener('pointerenter', enter);
  return () => host.removeEventListener('pointerenter', enter);
}
