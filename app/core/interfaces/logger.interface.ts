/**
 * Logger Interface
 * Defines contract for logging implementations
 * Supports multiple log levels and structured logging
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Log metadata
 */
export interface LogMetadata {
  [key: string]: unknown;
}

/**
 * Log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  metadata?: LogMetadata;
  error?: Error;
  context?: string;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  context?: string;
}

/**
 * Logger interface
 * All logger implementations must implement this
 */
export interface Logger {
  /**
   * Log debug message
   */
  debug(message: string, metadata?: LogMetadata): void;

  /**
   * Log info message
   */
  info(message: string, metadata?: LogMetadata): void;

  /**
   * Log warning message
   */
  warn(message: string, metadata?: LogMetadata): void;

  /**
   * Log error message
   */
  error(message: string, error?: Error, metadata?: LogMetadata): void;

  /**
   * Log fatal error message
   */
  fatal(message: string, error?: Error, metadata?: LogMetadata): void;

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void;

  /**
   * Set logger context
   */
  setContext(context: string): void;

  /**
   * Create child logger with context
   */
  child(context: string): Logger;

  /**
   * Flush pending logs
   */
  flush(): Promise<void>;
}
