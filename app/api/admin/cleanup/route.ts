import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { triggerCleanup } from '@/lib/cleanup';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    logger.info('Cleanup request received');

    const supabase = createRouteHandlerClient({ cookies } as any);

    // Authenticate user via session cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Fallback: try Bearer token if cookie auth fails
    let authenticatedUserId: string | null = user?.id || null;

    if (authError || !user) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data.user) {
          authenticatedUserId = data.user.id;
        }
      }
    }

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // Check admin status from database only - no hardcoded emails
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', authenticatedUserId)
      .single();

    if (profileError || !profile?.is_admin) {
      logger.warn('Non-admin user attempted cleanup', { userId: authenticatedUserId });
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    logger.info('Admin verified, running cleanup', { userId: authenticatedUserId });

    await triggerCleanup();

    logger.info('Cleanup completed successfully', { userId: authenticatedUserId });

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error during cleanup process', { error: errorMessage });
    return NextResponse.json({
      success: false,
      message: 'Cleanup failed',
      error: errorMessage
    }, { status: 500 });
  }
}
