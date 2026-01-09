/**
 * Unit tests for error handler utility
 */

import { describe, it, expect, vi } from 'vitest';
import { createApiError, handleUnknownError, isErrorType, formatErrorMessage } from '../../../app/utils/error-handler';
import { ErrorType } from '../../../app/types';

describe('Error Handler', () => {
  describe('createApiError', () => {
    it('should create an ApiError with correct properties', () => {
      const error = createApiError(ErrorType.NOT_FOUND, 'Resource not found');

      expect(error.type).toBe(ErrorType.NOT_FOUND);
      expect(error.message).toBe('Resource not found');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should include details if provided', () => {
      const details = { id: '123', resource: 'card' };
      const error = createApiError(ErrorType.NOT_FOUND, 'Card not found', details);

      expect(error.details).toEqual(details);
    });
  });

  describe('handleUnknownError', () => {
    it('should handle Error instances', () => {
      const originalError = new Error('Test error');
      const result = handleUnknownError(originalError);

      expect(result.type).toBe(ErrorType.UNKNOWN_ERROR);
      expect(result.message).toBe('Test error');
    });

    it('should handle non-Error values', () => {
      const result = handleUnknownError('string error');

      expect(result.type).toBe(ErrorType.UNKNOWN_ERROR);
      expect(result.message).toContain('unknown error');
    });

    it('should include context in error', () => {
      const result = handleUnknownError(new Error('Test'), 'Fetching data');

      expect(result.details?.context).toBe('Fetching data');
    });
  });

  describe('isErrorType', () => {
    it('should return true for matching error type', () => {
      const error = createApiError(ErrorType.NETWORK_ERROR, 'Network failed');

      expect(isErrorType(error, ErrorType.NETWORK_ERROR)).toBe(true);
    });

    it('should return false for non-matching error type', () => {
      const error = createApiError(ErrorType.NETWORK_ERROR, 'Network failed');

      expect(isErrorType(error, ErrorType.NOT_FOUND)).toBe(false);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format NOT_FOUND errors', () => {
      const error = createApiError(ErrorType.NOT_FOUND, 'Card not found');
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('Resource not found');
      expect(formatted).toContain('Card not found');
    });

    it('should format NETWORK_ERROR errors', () => {
      const error = createApiError(ErrorType.NETWORK_ERROR, 'Connection failed');
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('Network error');
    });

    it('should format VALIDATION_ERROR errors', () => {
      const error = createApiError(ErrorType.VALIDATION_ERROR, 'Invalid data');
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('Validation error');
    });

    it('should return raw message for unknown types', () => {
      const error = createApiError(ErrorType.UNKNOWN_ERROR, 'Something went wrong');
      const formatted = formatErrorMessage(error);

      expect(formatted).toBe('Something went wrong');
    });
  });
});
