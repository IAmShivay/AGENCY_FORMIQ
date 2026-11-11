// Simple in-memory metrics storage
let requestCounter = 0;
let errorCounter = 0;
const pathCounts: Record<string, number> = {};
export const startTime = Date.now();

// Maximum number of unique paths to track (to prevent memory leaks)
const MAX_PATHS = 100;

/**
 * Record a request for metrics tracking
 * @param path The path of the request
 * @param isError Whether the request resulted in an error
 */
export function recordRequest(path: string, isError = false) {
  requestCounter++;

  // Only track paths if we haven't exceeded the maximum
  if (Object.keys(pathCounts).length < MAX_PATHS || path in pathCounts) {
    pathCounts[path] = (pathCounts[path] || 0) + 1;
  }

  if (isError) errorCounter++;

  // Periodically clean up old paths if we're tracking too many
  if (Object.keys(pathCounts).length > MAX_PATHS * 1.5) {
    // Sort paths by count and keep only the top MAX_PATHS
    const sortedPaths = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_PATHS);

    // Reset the path counts with only the top paths
    const newPathCounts: Record<string, number> = {};
    sortedPaths.forEach(([path, count]) => {
      newPathCounts[path] = count;
    });

    // Replace the old path counts
    Object.keys(pathCounts).forEach(key => delete pathCounts[key]);
    Object.entries(newPathCounts).forEach(([key, value]) => {
      pathCounts[key] = value;
    });
  }
}

/**
 * Get the current metrics data
 */
export function getMetrics() {
  return {
    requestCounter,
    errorCounter,
    pathCounts,
    startTime
  };
}
