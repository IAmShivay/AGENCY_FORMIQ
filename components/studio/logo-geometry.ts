export const LOGO_STROKE = 24;

export const LOGO_VIEWBOX = {
  lockup: '-4 -50 712.41 204',
  symbol: '-4 -50 154.01 204',
  word: '152.81 -50 555.6 204',
} as const;

export const LOGO_GAP_EM = 0.0137;

export const LOGO_LETTERS: readonly (readonly string[])[] = [["M256.81,50A44,44 0 1 1 168.81,50A44,44 0 1 1 256.81,50"],["M298.81,100V0","M298.81,40A28,28 0 0 1 326.81,12H336.81"],["M369.21,100V0","M369.21,100V48A36,36 0 0 1 441.21,48V100","M441.21,48A36,36 0 0 1 513.21,48V100"],["M561.21,100V0"],["M692.41,50A44,44 0 1 1 604.41,50A44,44 0 1 1 692.41,50","M692.41,0V150"]];

export const LOGO_F_PATH = 'M0,-46H97.34A48.67,48.67 0 0 1 146.01,2.67H48.67V100.01H0Z';
export const LOGO_F_PARTS = {
  stem: {"x":0,"y":-46,"w":48.67,"h":146.01},
  arm: {"x":48.17,"y":-46,"w":49.67,"h":48.67},
  disc: 'M97.34,-46A48.67,48.67 0 0 1 146.01,2.67H96.84V-46Z',
} as const;
export const LOGO_GRID: readonly string[] = ["M0,-63.03V117.03","M48.67,-63.03V117.03","M97.34,-63.03V117.03","M146.01,-63.03V117.03","M-17.03,-46H163.04","M-17.03,2.67H163.04","M-17.03,51.34H163.04","M-17.03,100.01H163.04"];

export const LOGO_SPARKS = {
  symbol: {"x":48.67,"y":2.67,"size":48.67},
  word: {"x":549.21,"y":-46,"size":24},
} as const;

export const LOGO_TILE = {
  radius: 22,
  transform: 'translate(22 39.64) scale(0.3835)',
} as const;
