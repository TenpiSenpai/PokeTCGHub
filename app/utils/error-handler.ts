/**
 * Enterprise error handling utilities
 * Provides consistent error handling across the application
 */

import type { ApiError } from '../types';
import { ErrorType } from '../types';
import { logger } from './logger';

/**
 * Creates a standardized API error
 */
export function createApiError(
  type: ErrorType,
  message: string,
  details?: Record<string, unknown>
): ApiError {
  const error: ApiError = {
    type,
    message,
    timestamp: new Date(),
    details,
  };

  // Log the error
  logger.error(message, undefined, { errorType: type, details });

  return error;
}

/**
 * Handles unknown errors and converts them to ApiError
 */
export function handleUnknownError(error: unknown, context?: string): ApiError {
  const contextMessage = context ? `${context}: ` : '';

  if (error instanceof Error) {
    logger.error(`${contextMessage}${error.message}`, error);

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message,
      timestamp: new Date(),
      details: {
        context,
        stack: error.stack,
      },
    };
  }

  const message = `${contextMessage}An unknown error occurred`;
  logger.error(message, undefined, { error });

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message,
    timestamp: new Date(),
    details: {
      context,
      error: String(error),
    },
  };
}

/**
 * Error boundary handler for Vue components
 */
export function setupGlobalErrorHandler(app: any): void {
  app.config.errorHandler = (err: unknown, instance: any, info: string) => {
    logger.error('Vue error', err instanceof Error ? err : new Error(String(err)), {
      component: instance?.$options?.name ?? 'Unknown',
      info,
    });

    // In production, you might want to send this to an error tracking service
    // sendToErrorTracking(err, { component: instance, info });
  };
}

/**
 * Async error wrapper for safe async operations
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context: string
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: handleUnknownError(error, context),
    };
  }
}

/**
 * Checks if an error is a specific type
 */
export function isErrorType(error: ApiError, type: ErrorType): boolean {
  return error.type === type;
}

/**
 * Formats error message for display
 */
export function formatErrorMessage(error: ApiError): string {
  switch (error.type) {
    case ErrorType.NOT_FOUND:
      return `Resource not found: ${error.message}`;
    case ErrorType.NETWORK_ERROR:
      return `Network error: ${error.message}`;
    case ErrorType.VALIDATION_ERROR:
      return `Validation error: ${error.message}`;
    case ErrorType.PARSE_ERROR:
      return `Data parsing error: ${error.message}`;
    default:
      return error.message;
  }
}
