/**
 * Abstract Base Service
 * Provides foundation for all service implementations
 * Implements Service Layer pattern with lifecycle hooks
 */

import type { Result, ApiError } from '../../types';
import type { Logger } from '../interfaces/logger.interface';
import type { EventBus } from '../interfaces/event-bus.interface';

/**
 * Service context for dependency injection
 */
export interface ServiceContext {
  logger: Logger;
  eventBus: EventBus;
}

/**
 * Service operation options
 */
export interface ServiceOptions {
  skipValidation?: boolean;
  skipHooks?: boolean;
  emitEvents?: boolean;
}

/**
 * Abstract base service class
 * All services should extend this
 */
export abstract class BaseService<TEntity = unknown, TId = string> {
  /**
   * Service name for logging
   */
  protected abstract readonly serviceName: string;

  /**
   * Logger instance
   */
  protected logger: Logger;

  /**
   * Event bus instance
   */
  protected eventBus: EventBus;

  /**
   * Default service options
   */
  protected defaultOptions: ServiceOptions = {
    skipValidation: false,
    skipHooks: false,
    emitEvents: true,
  };

  constructor(context: ServiceContext) {
    this.logger = context.logger;
    this.eventBus = context.eventBus;
  }

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    this.logger.info(`${this.serviceName} initialized`);
    await this.onInitialize?.();
  }

  /**
   * Cleanup service resources
   */
  async dispose(): Promise<void> {
    this.logger.info(`${this.serviceName} disposed`);
    await this.onDispose?.();
  }

  /**
   * Lifecycle hook: Called when service is initialized
   */
  protected onInitialize?(): Promise<void> | void;

  /**
   * Lifecycle hook: Called when service is disposed
   */
  protected onDispose?(): Promise<void> | void;

  /**
   * Hook: Before operation execution
   */
  protected beforeOperation?(operation: string, data?: unknown): Promise<void> | void;

  /**
   * Hook: After operation execution
   */
  protected afterOperation?(operation: string, result: unknown): Promise<void> | void;

  /**
   * Hook: On operation error
   */
  protected onOperationError?(operation: string, error: Error): Promise<void> | void;

  /**
   * Executes an operation with lifecycle hooks
   */
  protected async executeOperation<T>(
    operationName: string,
    operation: () => Promise<Result<T>>,
    options?: ServiceOptions,
  ): Promise<Result<T>> {
    const opts = this.mergeOptions(options);

    try {
      // Before hook
      if (!opts.skipHooks) {
        await this.beforeOperation?.(operationName);
      }

      // Execute operation
      const result = await operation();

      // After hook
      if (!opts.skipHooks && result.success) {
        await this.afterOperation?.(operationName, result.data);
      }

      // Emit event
      if (opts.emitEvents && result.success) {
        await this.eventBus.emit(`${this.serviceName}.${operationName}`, result.data);
      }

      return result;
    } catch (error) {
      // Error hook
      if (!opts.skipHooks) {
        await this.onOperationError?.(operationName, error as Error);
      }

      this.logger.error(`${this.serviceName}.${operationName} failed`, error as Error);

      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Handles errors and converts to ApiError
   */
  protected abstract handleError(error: unknown): ApiError;

  /**
   * Validates entity
   */
  protected abstract validate(entity: Partial<TEntity>): Promise<Result<TEntity>>;

  /**
   * Merges options with defaults
   */
  protected mergeOptions(options?: ServiceOptions): ServiceOptions {
    return { ...this.defaultOptions, ...options };
  }

  /**
   * Logs operation start
   */
  protected logOperationStart(operation: string, data?: unknown): void {
    this.logger.debug(`${this.serviceName}.${operation} started`, data);
  }

  /**
   * Logs operation success
   */
  protected logOperationSuccess(operation: string, result?: unknown): void {
    this.logger.debug(`${this.serviceName}.${operation} succeeded`, result);
  }

  /**
   * Logs operation failure
   */
  protected logOperationFailure(operation: string, error: Error): void {
    this.logger.error(`${this.serviceName}.${operation} failed`, error);
  }
}
