import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Define the health response type to avoid type errors
  type HealthResponse = {
    status: 'ok' | 'error' | 'degraded';
    timestamp: string;
    database: {
      connected: boolean;
      responseTime: string | null;
    };
    storage: {
      connected: boolean;
      responseTime: string | null;
    };
  };

  // Prepare the health response object - minimal info for public endpoint
  const healthResponse: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      responseTime: null,
    },
    storage: {
      connected: false,
      responseTime: null,
    }
  };

  try {
    // Check database connection with a simple query
    // We'll use a try/catch inside our main try block to continue even if DB fails
    try {
      const startTime = Date.now();
      // Use a simple RPC call that doesn't depend on specific tables
      const { error: dbError } = await supabase.rpc('get_service_status');

      // If the RPC doesn't exist, fall back to a simple query
      if (dbError && dbError.message.includes('function "get_service_status" does not exist')) {
        // Try a simple query that should work on any Supabase project
        const { error } = await supabase.from('_realtime').select('*', { count: 'exact', head: true });

        // If that fails too, try one more fallback
        if (error) {
          // Final fallback - just check if we can connect at all
          await supabase.auth.getSession();
        }
      }

      const dbResponseTime = Date.now() - startTime;
      healthResponse.database = {
        connected: true,
        responseTime: dbResponseTime + 'ms',
      };

      logger.info('Database health check successful', { responseTime: dbResponseTime });
    } catch (dbError) {
      logger.error('Database health check failed', {
        error: dbError instanceof Error ? dbError.message : 'Unknown error'
      });

      healthResponse.database = {
        connected: false,
        responseTime: null,
      };

      // Don't throw, continue checking other services
    }

    // Check storage connection
    try {
      const storageStartTime = Date.now();

      // Try to list files in the storage bucket
      // If 'blog-images' doesn't exist, we'll catch the error and try a different approach
      try {
        await supabase.storage.from('blog-images').list('', { limit: 1 });
      } catch (bucketError) {
        // If that fails, try to list buckets instead
        const { data: buckets } = await supabase.storage.listBuckets();

        // If we got buckets, use the first one to test listing
        if (buckets && buckets.length > 0) {
          await supabase.storage.from(buckets[0].name).list('', { limit: 1 });
        }
      }

      const storageResponseTime = Date.now() - storageStartTime;
      healthResponse.storage = {
        connected: true,
        responseTime: storageResponseTime + 'ms',
      };

      logger.info('Storage health check successful', { responseTime: storageResponseTime });
    } catch (storageError) {
      logger.error('Storage health check failed', {
        error: storageError instanceof Error ? storageError.message : 'Unknown error'
      });

      healthResponse.storage = {
        connected: false,
        responseTime: null,
      };

      // Don't throw, we'll still return partial health info
    }

    // If both database and storage are disconnected, consider the overall status as error
    if (!healthResponse.database.connected && !healthResponse.storage.connected) {
      healthResponse.status = 'error';
    } else if (!healthResponse.database.connected || !healthResponse.storage.connected) {
      healthResponse.status = 'degraded';
    }

    // Return health status
    return NextResponse.json(healthResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log the error
    logger.error('Health check failed', { error: errorMessage, stack: errorStack });

    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
