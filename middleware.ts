import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordRequest } from './lib/metrics';
import logger from './lib/logger';
import {
  ADMIN_PATH_PREFIX,
  ADMIN_ROLE_EXEMPT_PATHS,
  AUTH_PROTECTED_PATH_PREFIXES,
  LOGIN_PATH,
  LOGIN_REDIRECT_PARAM,
  NON_ADMIN_FALLBACK_PATH,
  NOINDEX_PATH_PREFIXES,
  ROBOTS_HEADER_INDEX,
  ROBOTS_HEADER_NOINDEX,
  matchesPathPrefix,
} from './lib/route-config';

// Track response times
const responseTimeHeader = 'x-response-time';

export async function middleware(req: NextRequest) {
  // Start timing the request
  const start = Date.now();

  try {
    const res = NextResponse.next();
    const path = req.nextUrl.pathname;

    // Skip middleware for SEO-related files and static assets
    if (
      path === '/robots.txt' ||
      path === '/sitemap.xml' ||
      path.startsWith('/_next/') ||
      path.startsWith('/api/') ||
      path.includes('.') // Skip files with extensions
    ) {
      const responseTime = Date.now() - start;
      res.headers.set(responseTimeHeader, `${responseTime}ms`);
      return res;
    }

    // Record the request for metrics (only for non-static paths)
    recordRequest(path);
    if (matchesPathPrefix(path, AUTH_PROTECTED_PATH_PREFIXES)) {
      const supabase = createMiddlewareClient({ req, res });

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const redirectUrl = new URL(LOGIN_PATH, req.url);
        redirectUrl.searchParams.set(LOGIN_REDIRECT_PARAM, `${path}${req.nextUrl.search}`);
        return NextResponse.redirect(redirectUrl);
      }
      if (
        matchesPathPrefix(path, [ADMIN_PATH_PREFIX]) &&
        !matchesPathPrefix(path, ADMIN_ROLE_EXEMPT_PATHS)
      ) {
        const { data: profile } = await supabase
          .from('users')
          .select('is_admin, is_manager, is_employee')
          .eq('id', session.user.id)
          .single();

        if (!profile?.is_admin && !profile?.is_manager) {
          return NextResponse.redirect(new URL(NON_ADMIN_FALLBACK_PATH, req.url));
        }
      }
    }

    // Add SEO-friendly headers
    res.headers.set(
      'X-Robots-Tag',
      matchesPathPrefix(path, NOINDEX_PATH_PREFIXES) ? ROBOTS_HEADER_NOINDEX : ROBOTS_HEADER_INDEX
    );
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Add response time header
    const responseTime = Date.now() - start;
    res.headers.set(responseTimeHeader, `${responseTime}ms`);

    return res;
  } catch (error) {
    // Record error for metrics
    recordRequest(req.nextUrl.pathname, true);

    // Log the error with our logger
    logger.error('Middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.nextUrl.pathname
    });

    // Continue with the request even if middleware fails
    const res = NextResponse.next();

    // Add response time header
    const responseTime = Date.now() - start;
    res.headers.set(responseTimeHeader, `${responseTime}ms`);

    return res;
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Protected routes
    '/admin/:path*',
    '/user/:path*',
    '/employee/:path*',
    '/manager/:path*',
    // Public routes for metrics and headers
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
};
