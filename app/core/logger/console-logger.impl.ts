/**
 * Console Logger Implementation
 * Concrete implementation of Logger interface
 * Supports structured logging with multiple levels
 */

import type { Logger, LogLevel, LogMetadata, LogEntry } from '../interfaces/logger.interface';
import { LogLevel as LogLevelEnum } from '../interfaces/logger.interface';

/**
 * Console logger implementation
 */
export class ConsoleLogger implements Logger {
  private level: LogLevel;
  private context?: string;

  constructor(level: LogLevel = LogLevelEnum.INFO, context?: string) {
    this.level = level;
    this.context = context;
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: LogMetadata): void {
    this.log(LogLevelEnum.DEBUG, message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: LogMetadata): void {
    this.log(LogLevelEnum.INFO, message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.log(LogLevelEnum.WARN, message, metadata);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, metadata?: LogMetadata): void {
    this.log(LogLevelEnum.ERROR, message, metadata, error);
  }

  /**
   * Log fatal error message
   */
  fatal(message: string, error?: Error, metadata?: LogMetadata): void {
    this.log(LogLevelEnum.FATAL, message, metadata, error);
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Set logger context
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Create child logger with context
   */
  child(context: string): Logger {
    const childContext = this.context ? `${this.context}.${context}` : context;
    return new ConsoleLogger(this.level, childContext);
  }

  /**
   * Flush pending logs (no-op for console)
   */
  async flush(): Promise<void> {
    // Console logger writes immediately, nothing to flush
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, metadata?: LogMetadata, error?: Error): void {
    if (level < this.level) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata,
      error,
      context: this.context,
    };

    this.writeLog(entry);
  }

  /**
   * Write log to console
   */
  private writeLog(entry: LogEntry): void {
    const levelName = LogLevelEnum[entry.level];
    const timestamp = entry.timestamp.toISOString();
    const contextStr = entry.context ? `[${entry.context}]` : '';

    let message = `${timestamp} ${levelName} ${contextStr} ${entry.message}`;

    if (entry.metadata) {
      message += ` ${JSON.stringify(entry.metadata)}`;
    }

    if (entry.error) {
      message += `\n${entry.error.stack || entry.error.message}`;
    }

    // Use appropriate console method
    switch (entry.level) {
      case LogLevelEnum.DEBUG:
        console.debug(message);
        break;
      case LogLevelEnum.INFO:
        console.info(message);
        break;
      case LogLevelEnum.WARN:
        console.warn(message);
        break;
      case LogLevelEnum.ERROR:
      case LogLevelEnum.FATAL:
        console.error(message);
        break;
    }
  }
}

/**
 * Global logger instance
 */
export const logger = new ConsoleLogger(LogLevelEnum.INFO);
