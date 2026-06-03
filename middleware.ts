import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordRequest } from './lib/metrics';
import logger from './lib/logger';

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

    // Skip auth checks for public pages to avoid redirect issues for crawlers
    const publicPaths = [
      '/',
      '/about',
      '/services',
      '/portfolio',
      '/blog',
      '/contact',
      '/web',
      '/mobile',
      '/marketing',
      '/shopify',
      '/ecommerce-marketplace',
      '/software-tools',
      '/agents',
      '/team',
      '/privacy',
      '/terms',
      '/quote'
    ];

    const isPublicPath = publicPaths.some(publicPath =>
      path === publicPath || path.startsWith(`${publicPath}/`)
    );

    // Only apply auth middleware to protected routes
    if (!isPublicPath && (path.startsWith('/admin') || path.startsWith('/user') || path.startsWith('/employee') || path.startsWith('/manager'))) {
      const supabase = createMiddlewareClient({ req, res });

      // Check if we have a session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session and trying to access protected routes, redirect to login
    if (!session && (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/user'))) {
      // Uncomment to enable redirect to login
      // const redirectUrl = new URL('/login', req.url);
      // return NextResponse.redirect(redirectUrl);
      }

      // If we have a session but the user doesn't have admin/manager access and trying to access admin routes
    if (session && req.nextUrl.pathname.startsWith('/admin')) {
        // Get user profile to check roles
        const { data: profile } = await supabase
          .from('users')
          .select('is_admin, is_manager, is_employee')
          .eq('id', session.user.id)
          .single();

        // If not admin or manager, redirect to user dashboard
        if (!profile?.is_admin && !profile?.is_manager) {
          const redirectUrl = new URL('/user', req.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // Add SEO-friendly headers
    res.headers.set('X-Robots-Tag', 'index, follow');
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
