import { ADS_TXT_CACHE_CONTROL, ADS_TXT_CONTENT_TYPE, parseAdsTxt } from '@/lib/ads/ads-txt';

const NOT_FOUND_STATUS = 404;

export function GET() {
  const body = parseAdsTxt(process.env.MONETAG_ADS_TXT);
  if (!body) return new Response(null, { status: NOT_FOUND_STATUS });
  return new Response(body, {
    headers: { 'Content-Type': ADS_TXT_CONTENT_TYPE, 'Cache-Control': ADS_TXT_CACHE_CONTROL },
  });
}
