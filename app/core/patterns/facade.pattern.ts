/**
 * Facade Pattern Implementation
 * Provides simplified interface to complex subsystems
 * Coordinates multiple services and operations
 */

import type { Result } from '../../types';
import type { DIContainer } from '../di/container.interface';
import type { EventBus } from '../interfaces/event-bus.interface';
import type { Logger } from '../interfaces/logger.interface';

/**
 * Base facade interface
 */
export interface Facade {
  /**
   * Facade name
   */
  readonly name: string;

  /**
   * Initialize facade
   */
  initialize?(): Promise<void>;

  /**
   * Cleanup facade resources
   */
  dispose?(): Promise<void>;
}

/**
 * Abstract base facade
 */
export abstract class BaseFacade implements Facade {
  abstract readonly name: string;

  constructor(
    protected container: DIContainer,
    protected eventBus: EventBus,
    protected logger: Logger,
  ) {}

  async initialize?(): Promise<void> {
    this.logger.info(`${this.name} facade initialized`);
  }

  async dispose?(): Promise<void> {
    this.logger.info(`${this.name} facade disposed`);
  }

  /**
   * Execute operation with error handling
   */
  protected async execute<T>(
    operation: () => Promise<Result<T>>,
    operationName: string,
  ): Promise<Result<T>> {
    try {
      this.logger.debug(`${this.name}.${operationName} started`);

      const result = await operation();

      if (result.success) {
        this.logger.debug(`${this.name}.${operationName} succeeded`);
      } else {
        this.logger.warn(`${this.name}.${operationName} failed`, result.error);
      }

      return result;
    } catch (error) {
      this.logger.error(`${this.name}.${operationName} error`, error as Error);

      return {
        success: false,
        error: {
          type: 'FACADE_ERROR' as any,
          message: error instanceof Error ? error.message : 'Facade operation failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Execute multiple operations in parallel
   */
  protected async executeParallel<T>(
    operations: Array<() => Promise<Result<T>>>,
    operationName: string,
  ): Promise<Result<T[]>> {
    try {
      this.logger.debug(`${this.name}.${operationName} (parallel) started`);

      const results = await Promise.all(operations.map((op) => op()));

      // Check if any operation failed
      const failure = results.find((r) => !r.success);
      if (failure) {
        return failure as Result<T[]>;
      }

      const data = results.map((r) => (r as Result<T> & { success: true }).data);

      this.logger.debug(`${this.name}.${operationName} (parallel) succeeded`);

      return {
        success: true,
        data,
      };
    } catch (error) {
      this.logger.error(`${this.name}.${operationName} (parallel) error`, error as Error);

      return {
        success: false,
        error: {
          type: 'FACADE_ERROR' as any,
          message: error instanceof Error ? error.message : 'Parallel operation failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Execute operations in sequence
   */
  protected async executeSequence<T>(
    operations: Array<() => Promise<Result<T>>>,
    operationName: string,
  ): Promise<Result<T[]>> {
    try {
      this.logger.debug(`${this.name}.${operationName} (sequence) started`);

      const results: T[] = [];

      for (const operation of operations) {
        const result = await operation();

        if (!result.success) {
          return result as Result<T[]>;
        }

        results.push(result.data);
      }

      this.logger.debug(`${this.name}.${operationName} (sequence) succeeded`);

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      this.logger.error(`${this.name}.${operationName} (sequence) error`, error as Error);

      return {
        success: false,
        error: {
          type: 'FACADE_ERROR' as any,
          message: error instanceof Error ? error.message : 'Sequence operation failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Emit event
   */
  protected async emitEvent<T>(eventType: string, data: T): Promise<void> {
    await this.eventBus.emit(`${this.name}.${eventType}`, data);
  }
}

/**
 * Facade registry
 * Manages and coordinates multiple facades
 */
export class FacadeRegistry {
  private facades = new Map<string, Facade>();

  /**
   * Register a facade
   */
  register(facade: Facade): void {
    if (this.facades.has(facade.name)) {
      throw new Error(`Facade "${facade.name}" is already registered`);
    }

    this.facades.set(facade.name, facade);
  }

  /**
   * Unregister a facade
   */
  unregister(name: string): void {
    this.facades.delete(name);
  }

  /**
   * Get facade by name
   */
  get<T extends Facade>(name: string): T | undefined {
    return this.facades.get(name) as T | undefined;
  }

  /**
   * Initialize all facades
   */
  async initializeAll(): Promise<void> {
    const initializations = Array.from(this.facades.values()).map((facade) =>
      facade.initialize?.(),
    );

    await Promise.all(initializations);
  }

  /**
   * Dispose all facades
   */
  async disposeAll(): Promise<void> {
    const disposals = Array.from(this.facades.values()).map((facade) => facade.dispose?.());

    await Promise.all(disposals);
  }

  /**
   * Check if facade is registered
   */
  has(name: string): boolean {
    return this.facades.has(name);
  }

  /**
   * Get all facade names
   */
  getFacadeNames(): string[] {
    return Array.from(this.facades.keys());
  }
}
