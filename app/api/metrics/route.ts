import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';
import { getMetrics, startTime } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Create a Supabase client for the route handler
  const supabase = createRouteHandlerClient({ cookies } as any);

  // Check if user is authenticated and is an admin
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user profile to check if admin
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Get database metrics
    const { count: userCount, error: dbError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: blogCount, error: blogError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    const { count: websiteCount, error: websiteError } = await supabase
      .from('portfolio_websites')
      .select('*', { count: 'exact', head: true });

    const { count: appCount, error: appError } = await supabase
      .from('portfolio_apps')
      .select('*', { count: 'exact', head: true });

    const { count: designCount, error: designError } = await supabase
      .from('portfolio_designs')
      .select('*', { count: 'exact', head: true });

    // Get storage metrics
    const { data: storageData, error: storageError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 1 });

    // Get metrics from the metrics utility
    const { requestCounter, errorCounter, pathCounts } = getMetrics();

    // Return metrics
    return NextResponse.json({
      system: {
        uptime: Math.floor((Date.now() - startTime) / 1000), // in seconds
        memory: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        },
        requests: {
          total: requestCounter,
          errors: errorCounter,
          byPath: pathCounts
        }
      },
      database: {
        users: userCount || 0,
        blogPosts: blogCount || 0,
        websites: websiteCount || 0,
        apps: appCount || 0,
        designs: designCount || 0,
        errors: [
          dbError, blogError, websiteError, appError, designError
        ].filter(Boolean).map(e => e?.message)
      },
      storage: {
        buckets: storageData ? 1 : 0,
        error: storageError?.message
      }
    });
  } catch (error) {
    logger.error('Error fetching metrics', { error });
    return NextResponse.json({
      error: 'Failed to fetch metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
