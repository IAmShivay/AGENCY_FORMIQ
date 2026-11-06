import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import logger from './logger';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const APPLICATION_NAME_HEADER = 'x-application-name';
const APPLICATION_NAME = 'formiqstudio-dashboard';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

// Create a singleton instance of the Supabase client
let supabaseInstance: SupabaseClient | null = null;

// Track if we've already initialized the client
let clientInitialized = false;

/**
 * Get the Supabase client instance
 * This ensures we're reusing the same connection
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    logger.info('Creating new Supabase client instance');
    const globalOptions = {
      // Add request headers to track client usage
      headers: {
        [APPLICATION_NAME_HEADER]: APPLICATION_NAME,
      },
    };

    supabaseInstance = isBrowser()
      ? // In the browser, persist the auth session in cookies (not localStorage)
        // so middleware and route handlers (auth-helpers) can see it server-side.
        createClientComponentClient({
          supabaseUrl,
          supabaseKey,
          options: { global: globalOptions },
          isSingleton: true,
        })
      : createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
          global: globalOptions,
        });

    // Only set up monitoring once
    if (!clientInitialized) {
      // Setup connection monitoring
      monitorConnection(supabaseInstance);
      clientInitialized = true;
    }
  }

  return supabaseInstance;
}

// Track if we've already set up auth state change listener
let authListenerInitialized = false;

/**
 * Monitor the Supabase connection and log issues
 */
function monitorConnection(client: SupabaseClient): void {
  // Only set up auth listener once
  if (!authListenerInitialized) {
    // Listen for auth state changes
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      logger.debug(`Auth state changed: ${event}`, { userId: session?.user?.id });
    });

    // Store the subscription so we can clean it up later if needed
    authListenerInitialized = true;

    // Log that we've initialized the listener
    logger.debug('Auth state change listener initialized');
  }

  // We don't need to set up signal handlers here anymore
  // They're now handled in the cleanup.ts module
}

// Export the client for easy access throughout the app
export const supabase = getSupabaseClient();

export interface User {
  id: string;
  email: string;
  is_admin?: boolean;
}