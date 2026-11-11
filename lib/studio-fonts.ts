import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google';

const display = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], variable: '--font-display', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--font-serif', display: 'swap' });

export const STUDIO_FONT_VARS = `${display.variable} ${mono.variable} ${serif.variable}`;
