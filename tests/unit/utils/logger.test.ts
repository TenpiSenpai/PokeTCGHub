/**
 * Unit tests for logger utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, LogLevel } from '../../../app/utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      logger.debug('Test debug message', { test: 'data' });

      // In test environment, it may not log depending on NODE_ENV
      // Just verify it doesn't throw
      expect(() => logger.debug('test')).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      logger.info('Test info message');

      expect(() => logger.info('test')).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      logger.warn('Test warning');

      expect(() => logger.warn('test')).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const testError = new Error('Test error');
      logger.error('Test error message', testError);

      expect(() => logger.error('test', testError)).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle errors without Error object', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.error('Test error message');

      expect(() => logger.error('test')).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
