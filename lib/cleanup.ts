import { supabase } from './supabaseClient';
import logger from './logger';

/**
 * Cleanup utility for managing resources and preventing leaks
 */

// Track resources that need cleanup
const cleanupTasks: Array<() => Promise<void>> = [];

/**
 * Register a cleanup task to be executed on shutdown
 */
export function registerCleanupTask(task: () => Promise<void>): void {
  cleanupTasks.push(task);
}

/**
 * Clean up unused files in storage
 * This removes files that are not referenced in any database records
 */
export async function cleanupUnusedFiles(): Promise<void> {
  try {
    logger.info('Starting cleanup of unused files');

    // Get all files from storage
    // List files in the root directory first
    const { data: rootFiles, error: rootFilesError } = await supabase.storage
      .from('blog-images')
      .list('', {
        limit: 1000, // Set a reasonable limit
      });

    if (rootFilesError) {
      logger.error('Error listing root files for cleanup', { error: rootFilesError });
      throw new Error(`Failed to list files: ${rootFilesError.message}`);
    }

    // Initialize files array
    const files = rootFiles || [];

    // No need to check for filesError anymore as we've already handled rootFilesError

    if (!files || files.length === 0) {
      logger.info('No files found for cleanup');
      return;
    }

    logger.info(`Found ${files.length} files in storage`);

    // Get all image references from database tables
    const [
      { data: blogImages },
      { data: authorImages },
      { data: websiteImages },
      { data: appImages },
      { data: designImages }
    ] = await Promise.all([
      supabase.from('blog_posts').select('cover_image'),
      supabase.from('blog_authors').select('avatar'),
      supabase.from('portfolio_websites').select('image, case_study_screens'),
      supabase.from('portfolio_apps').select('image'),
      supabase.from('portfolio_designs').select('image')
    ]);

    // Collect all referenced image URLs
    const referencedUrls = new Set<string>();

    // Add blog cover images
    blogImages?.forEach(blog => {
      if (blog.cover_image) referencedUrls.add(blog.cover_image);
    });

    // Add author avatars
    authorImages?.forEach(author => {
      if (author.avatar) referencedUrls.add(author.avatar);
    });

    // Add website images and case study screens
    websiteImages?.forEach(website => {
      if (website.image) referencedUrls.add(website.image);
      if (website.case_study_screens && Array.isArray(website.case_study_screens)) {
        website.case_study_screens.forEach(screen => referencedUrls.add(screen));
      }
    });

    // Add app images
    appImages?.forEach(app => {
      if (app.image) referencedUrls.add(app.image);
    });

    // Add design images
    designImages?.forEach(design => {
      if (design.image) referencedUrls.add(design.image);
    });

    logger.info(`Found ${referencedUrls.size} referenced images in database`);

    // Find files that are not referenced
    const filesToDelete: string[] = [];

    // Log all referenced URLs for debugging
    logger.info('Referenced URLs:', { urls: Array.from(referencedUrls).slice(0, 5) });

    files.forEach(file => {
      // Get the public URL for this file
      const fileUrl = supabase.storage.from('blog-images').getPublicUrl(file.name).data.publicUrl;

      // Check if this file is referenced in any database record
      let isReferenced = false;

      // Direct URL comparison might fail due to different URL formats
      // So we'll also check if any referenced URL contains this file name
      // Convert Set to Array to avoid TypeScript iteration issues
      Array.from(referencedUrls).some(url => {
        if (url === fileUrl || url.includes(file.name)) {
          isReferenced = true;
          return true; // Stop iteration
        }
        return false;
      });

      if (!isReferenced) {
        logger.info(`Marking file for deletion: ${file.name}`);
        filesToDelete.push(file.name);
      }
    });

    if (filesToDelete.length === 0) {
      logger.info('No unused files found for deletion');
      return;
    }

    logger.info(`Found ${filesToDelete.length} unused files to delete`);

    // Delete unused files in batches of 100
    const batchSize = 100;
    for (let i = 0; i < filesToDelete.length; i += batchSize) {
      const batch = filesToDelete.slice(i, i + batchSize);
      const { error: deleteError } = await supabase.storage
        .from('blog-images')
        .remove(batch);

      if (deleteError) {
        logger.error('Error deleting unused files', { error: deleteError });
      } else {
        logger.info(`Deleted batch of ${batch.length} unused files`);
      }
    }

    logger.info('Cleanup of unused files completed');
  } catch (error) {
    logger.error('Error during file cleanup', { error: error instanceof Error ? error.message : 'Unknown error' });
    // Re-throw the error so the caller knows the cleanup failed
    throw error;
  }
}

/**
 * Run all registered cleanup tasks
 */
export async function runCleanup(): Promise<void> {
  logger.info(`Running ${cleanupTasks.length} cleanup tasks`);

  for (const task of cleanupTasks) {
    try {
      await task();
    } catch (error) {
      logger.error('Error running cleanup task', { error });
    }
  }

  logger.info('All cleanup tasks completed');
}

// Register the file cleanup task
registerCleanupTask(cleanupUnusedFiles);

// Setup cleanup on process termination for server environments
// We'll use a module-level variable to track if we've already set up listeners
let listenersInitialized = false;

/**
 * Initialize signal handlers for graceful shutdown
 * This should only be called once to avoid memory leaks
 */
export function initializeCleanupListeners(): void {
  // Only set up listeners once
  if (typeof window !== 'undefined' || listenersInitialized) {
    return;
  }

  // Increase the max listeners to avoid warnings
  process.setMaxListeners(15);

  // Define signals with proper type
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

  signals.forEach(signal => {
    // Remove any existing listeners to avoid duplicates
    const existingListeners = process.listeners(signal);
    if (existingListeners.length > 0) {
      logger.info(`Removing ${existingListeners.length} existing ${signal} listeners`);
      process.removeAllListeners(signal);
    }

    // Add our listener
    process.once(signal, async () => {
      logger.info(`${signal} received, running cleanup tasks`);
      await runCleanup();
      process.exit(0);
    });
  });

  listenersInitialized = true;
  logger.info('Cleanup listeners initialized');
}

// Initialize listeners when this module is imported
if (typeof window === 'undefined') {
  initializeCleanupListeners();
}

// Export a function to manually trigger cleanup
export async function triggerCleanup(): Promise<void> {
  logger.info('Manual cleanup triggered');

  // Check if we have any cleanup tasks registered
  if (cleanupTasks.length === 0) {
    logger.warn('No cleanup tasks registered');
  }

  try {
    await runCleanup();
    logger.info('Manual cleanup completed successfully');
  } catch (error) {
    logger.error('Error during manual cleanup', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Re-throw to let the caller handle it
  }
}
