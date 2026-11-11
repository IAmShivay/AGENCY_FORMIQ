import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

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
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const count = parseInt(searchParams.get('count') || '100', 10);
  const level = searchParams.get('level') || undefined;
  
  // Get logs
  const logs = logger.getRecentLogs(count);
  
  // Filter by level if specified
  const filteredLogs = level 
    ? logs.filter(log => log.level === level)
    : logs;
  
  return NextResponse.json({
    logs: filteredLogs,
    total: filteredLogs.length
  });
}
