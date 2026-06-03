// A simple structured logger for the application

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;
// In-memory log storage (will be cleared on app restart)
const logHistory: LogEntry[] = [];

// Environment-based log level
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * Add a log entry to the history and console
 */
function addLog(level: LogLevel, message: string, context?: Record<string, any>): void {
  // Skip logs below the current log level
  if (LOG_LEVELS[level] < LOG_LEVELS[LOG_LEVEL as LogLevel]) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };

  // Add to in-memory history
  logHistory.push(entry);
  
  // Trim history if it gets too large
  if (logHistory.length > MAX_LOGS) {
    logHistory.shift();
  }

  // Log to console with appropriate method
  const logData = context ? { message, ...context } : message;
  
  switch (level) {
    case 'debug':
      console.debug(`[DEBUG] ${entry.timestamp}:`, logData);
      break;
    case 'info':
      console.info(`[INFO] ${entry.timestamp}:`, logData);
      break;
    case 'warn':
      console.warn(`[WARN] ${entry.timestamp}:`, logData);
      break;
    case 'error':
      console.error(`[ERROR] ${entry.timestamp}:`, logData);
      break;
  }
}

/**
 * Get recent logs
 */
function getRecentLogs(count = 100): LogEntry[] {
  return logHistory.slice(-count);
}

/**
 * Clear log history
 */
function clearLogs(): void {
  logHistory.length = 0;
}

const logger = {
  debug: (message: string, context?: Record<string, any>) => addLog('debug', message, context),
  info: (message: string, context?: Record<string, any>) => addLog('info', message, context),
  warn: (message: string, context?: Record<string, any>) => addLog('warn', message, context),
  error: (message: string, context?: Record<string, any>) => addLog('error', message, context),
  getRecentLogs,
  clearLogs
};

export default logger;
