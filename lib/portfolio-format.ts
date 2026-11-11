export const PORTFOLIO_ROUTE = '/portfolio';
export const PORTFOLIO_WEBSITES_ROUTE = `${PORTFOLIO_ROUTE}/websites`;
export const IN_PROGRESS = 'In progress';
export const NO_YEAR = '—';

export const yearOf = (raw: string | undefined) => {
  if (!raw) return NO_YEAR;
  if (/progress/i.test(raw)) return IN_PROGRESS;
  const year = raw.match(/20\d{2}/)?.[0];
  return year && Number(year) <= new Date().getFullYear() ? year : NO_YEAR;
};

export const validLink = (...links: (string | undefined)[]) => links.find((l) => l && /^https?:\/\//.test(l)) ?? '';
export const validImage = (src: string | undefined) => (src && src !== '#' ? src : '');
export const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');
export const paragraphs = (text: string | undefined) => (text ?? '').split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean);
export const initials = (title: string) => title.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
export const LEAD_MAX_CHARS = 240;
export const isShort = (text: string) => text.length <= LEAD_MAX_CHARS;
export const splitQuote = (raw: string) => {
  const text = raw.trim().replace(/^["“”']+|["“”']+$/g, '');
  const match = text.match(/^(.*?)["“”']?\s+[—–-]\s+([^"“”]{2,80})$/s);
  return match ? { quote: match[1].replace(/["“”']+$/, '').trim(), by: match[2].trim() } : { quote: text, by: '' };
};
const UNNAMED_CLIENT = /^(confidential|nda|private|under nda|anonymous)$/i;
export const isNamedClient = (client: string) => !!client && !UNNAMED_CLIENT.test(client.trim());
