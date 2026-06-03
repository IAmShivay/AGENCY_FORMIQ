import { supabase } from './supabaseClient';
import logger from './logger';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface UploadOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filePath?: string;
}

/**
 * Upload a file to Supabase Storage with proper validation and error handling
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // Set default options
    const {
      bucket = 'blog-images',
      folder = '',
      cacheControl = '3600',
      upsert = false,
      maxSize = MAX_FILE_SIZE,
      allowedTypes = ALLOWED_IMAGE_TYPES,
      onProgress
    } = options;

    // Validate file size
    if (file.size > maxSize) {
      const errorMsg = `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`;
      logger.warn(errorMsg, { fileSize: file.size, maxSize });
      return { success: false, error: errorMsg };
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `File type ${file.type} is not allowed`;
      logger.warn(errorMsg, { fileType: file.type, allowedTypes });
      return { success: false, error: errorMsg };
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Log upload attempt
    logger.info('Uploading file to Supabase Storage', {
      bucket,
      filePath,
      fileSize: file.size,
      fileType: file.type
    });

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl,
        upsert,
        onUploadProgress: onProgress ? (progress: { loaded: number; total: number }) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          onProgress(percentage);
        } : undefined,
      } as any);

    if (uploadError) {
      logger.error('Error uploading file', { error: uploadError });
      return { success: false, error: uploadError.message };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    logger.info('File uploaded successfully', { filePath, publicUrl });
    return { success: true, url: publicUrl, filePath };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error during file upload';
    logger.error('Unexpected error during file upload', { error });
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  filePath: string,
  bucket: string = 'blog-images'
): Promise<{ success: boolean; error?: string }> {
  try {
    logger.info('Deleting file from Supabase Storage', { bucket, filePath });

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      logger.error('Error deleting file', { error });
      return { success: false, error: error.message };
    }

    logger.info('File deleted successfully', { filePath });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error during file deletion';
    logger.error('Unexpected error during file deletion', { error });
    return { success: false, error: errorMsg };
  }
}

/**
 * Extract file path from a Supabase Storage URL
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    if (!url) return null;

    // Parse the URL to extract the path
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // The path format is typically /storage/v1/object/public/bucket-name/path/to/file.ext
    // We want to extract the path after the bucket name
    const bucketIndex = pathParts.findIndex(part => part === 'public') + 1;
    if (bucketIndex > 0 && bucketIndex < pathParts.length) {
      // Skip the bucket name and join the rest
      return pathParts.slice(bucketIndex + 1).join('/');
    }

    return null;
  } catch (error) {
    logger.error('Error extracting file path from URL', { url, error });
    return null;
  }
}
