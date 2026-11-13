export const ADS_TXT_CONTENT_TYPE = 'text/plain; charset=utf-8';
export const ADS_TXT_CACHE_CONTROL = 'public, max-age=3600, s-maxage=3600';

const ESCAPED_NEWLINE = /\\n/g;
const LINE_BREAK = /\r?\n/;
const NEWLINE = '\n';

export const parseAdsTxt = (raw: string | undefined): string | null => {
  if (!raw) return null;
  const lines = raw
    .replace(ESCAPED_NEWLINE, NEWLINE)
    .split(LINE_BREAK)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? `${lines.join(NEWLINE)}${NEWLINE}` : null;
};
