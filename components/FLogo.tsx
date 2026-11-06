import { LOGO_F_PATH, LOGO_SPARKS, LOGO_TILE } from '@/components/studio/logo-geometry';

interface FLogoProps {
  size?: number;
  className?: string;
}

const INK = 'hsl(var(--ink))';
const PAPER = 'hsl(var(--paper))';
const EMBER = 'hsl(var(--ember))';

const FLogo = ({ size = 48, className = '' }: FLogoProps) => {
  const s = LOGO_SPARKS.symbol;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Formiq" className={className}>
      <rect width="100" height="100" rx={LOGO_TILE.radius} fill={INK} />
      <g transform={LOGO_TILE.transform}>
        <path d={LOGO_F_PATH} fill={PAPER} />
        <rect x={s.x} y={s.y} width={s.size} height={s.size} fill={EMBER} />
      </g>
    </svg>
  );
};

export default FLogo;
