const BLOCK_ELEMENTS = /<(script|style|iframe|object|embed|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const VOID_ELEMENTS = /<\s*\/?\s*(link|meta|base|form|input|button)\b[^>]*>/gi;
const EVENT_HANDLERS = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URLS = /\s(href|src|action)\s*=\s*(["']?)\s*javascript:[^"'\s>]*\2/gi;

// isomorphic-dompurify depends on jsdom, which has failed to load in Vercel's serverless runtime
export async function sanitizeHtml(html: string): Promise<string> {
  try {
    const { default: DOMPurify } = await import('isomorphic-dompurify');
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('DOMPurify unavailable, using fallback sanitizer:', error);
    return html
      .replace(BLOCK_ELEMENTS, '')
      .replace(VOID_ELEMENTS, '')
      .replace(EVENT_HANDLERS, '')
      .replace(JS_URLS, ' $1=""');
  }
}
