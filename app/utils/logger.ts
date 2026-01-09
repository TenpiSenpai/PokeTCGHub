/**
 * Enterprise logging utility
 * Provides structured logging with different levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.isDevelopment) return;
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    // In development, log to console
    if (this.isDevelopment) {
      this.consoleLog(entry);
    }

    // In production, you would send to a logging service (e.g., Sentry, LogRocket)
    // this.sendToLoggingService(entry);
  }

  /**
   * Log to console with formatting
   */
  private consoleLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context ?? '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context ?? '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context ?? '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.error ?? '', entry.context ?? '');
        break;
    }
  }

  /**
   * Example method for sending logs to external service
   * Implement based on your logging service (Sentry, LogRocket, etc.)
   */
  // private sendToLoggingService(entry: LogEntry): void {
  //   // TODO: Implement external logging service integration
  // }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;
