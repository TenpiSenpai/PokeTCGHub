/**
 * Decorator Pattern Implementation
 * Adds cross-cutting concerns without modifying original classes
 * Supports logging, caching, timing, validation, etc.
 */

import type { Result } from '../../types';

/**
 * Base decorator interface
 */
export interface Decorator<T> {
  decorate(target: T): T;
}

/**
 * Method decorator metadata
 */
export interface MethodDecoratorMetadata {
  className: string;
  methodName: string;
  args: unknown[];
  startTime?: number;
  endTime?: number;
}

/**
 * Logging decorator
 */
export class LoggingDecorator<T extends object> implements Decorator<T> {
  constructor(
    private logger: {
      log: (message: string, metadata?: unknown) => void;
    },
  ) {}

  decorate(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const original = obj[prop as keyof T];

        if (typeof original === 'function') {
          return (...args: unknown[]) => {
            this.logger.log(`Calling ${String(prop)}`, { args });

            const result = (original as Function).apply(obj, args);

            if (result instanceof Promise) {
              return result.then((res) => {
                this.logger.log(`${String(prop)} completed`, { result: res });
                return res;
              });
            }

            this.logger.log(`${String(prop)} completed`, { result });
            return result;
          };
        }

        return original;
      },
    });
  }
}

/**
 * Caching decorator
 */
export class CachingDecorator<T extends object> implements Decorator<T> {
  private cache = new Map<string, { value: unknown; timestamp: number }>();

  constructor(private ttl: number = 300000) {} // 5 minutes default

  decorate(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const original = obj[prop as keyof T];

        if (typeof original === 'function') {
          return (...args: unknown[]) => {
            const cacheKey = `${String(prop)}_${JSON.stringify(args)}`;
            const cached = this.cache.get(cacheKey);

            // Return cached value if still valid
            if (cached && Date.now() - cached.timestamp < this.ttl) {
              return cached.value;
            }

            const result = (original as Function).apply(obj, args);

            if (result instanceof Promise) {
              return result.then((res) => {
                this.cache.set(cacheKey, { value: res, timestamp: Date.now() });
                return res;
              });
            }

            this.cache.set(cacheKey, { value: result, timestamp: Date.now() });
            return result;
          };
        }

        return original;
      },
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Timing decorator
 */
export class TimingDecorator<T extends object> implements Decorator<T> {
  private timings = new Map<string, number[]>();

  decorate(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const original = obj[prop as keyof T];

        if (typeof original === 'function') {
          return (...args: unknown[]) => {
            const startTime = Date.now();
            const result = (original as Function).apply(obj, args);

            if (result instanceof Promise) {
              return result.then((res) => {
                this.recordTiming(String(prop), Date.now() - startTime);
                return res;
              });
            }

            this.recordTiming(String(prop), Date.now() - startTime);
            return result;
          };
        }

        return original;
      },
    });
  }

  /**
   * Record timing
   */
  private recordTiming(method: string, duration: number): void {
    if (!this.timings.has(method)) {
      this.timings.set(method, []);
    }
    this.timings.get(method)!.push(duration);
  }

  /**
   * Get average timing for method
   */
  getAverageTiming(method: string): number {
    const timings = this.timings.get(method);
    if (!timings || timings.length === 0) return 0;
    return timings.reduce((a, b) => a + b, 0) / timings.length;
  }

  /**
   * Get all timings
   */
  getAllTimings(): Map<string, number[]> {
    return new Map(this.timings);
  }
}

/**
 * Retry decorator
 */
export class RetryDecorator<T extends object> implements Decorator<T> {
  constructor(
    private maxRetries: number = 3,
    private delay: number = 1000,
  ) {}

  decorate(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const original = obj[prop as keyof T];

        if (typeof original === 'function') {
          return async (...args: unknown[]) => {
            let lastError: Error | undefined;

            for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
              try {
                return await (original as Function).apply(obj, args);
              } catch (error) {
                lastError = error as Error;

                if (attempt < this.maxRetries) {
                  // Wait before retry
                  await new Promise((resolve) => setTimeout(resolve, this.delay * (attempt + 1)));
                }
              }
            }

            throw lastError;
          };
        }

        return original;
      },
    });
  }
}

/**
 * Validation decorator
 */
export class ValidationDecorator<T extends object> implements Decorator<T> {
  constructor(
    private validators: Map<string, (args: unknown[]) => boolean | Promise<boolean>>,
  ) {}

  decorate(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const original = obj[prop as keyof T];

        if (typeof original === 'function') {
          return async (...args: unknown[]) => {
            const validator = this.validators.get(String(prop));

            if (validator) {
              const isValid = await validator(args);
              if (!isValid) {
                throw new Error(`Validation failed for method ${String(prop)}`);
              }
            }

            return (original as Function).apply(obj, args);
          };
        }

        return original;
      },
    });
  }
}

/**
 * Error handling decorator
 */
export class ErrorHandlingDecorator<T extends object> implements Decorator<T> {
  constructor(
    private errorHandler: (error: Error, method: string, args: unknown[]) => unknown,
  ) {}

  decorate(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const original = obj[prop as keyof T];

        if (typeof original === 'function') {
          return async (...args: unknown[]) => {
            try {
              return await (original as Function).apply(obj, args);
            } catch (error) {
              return this.errorHandler(error as Error, String(prop), args);
            }
          };
        }

        return original;
      },
    });
  }
}

/**
 * Decorator composer
 * Applies multiple decorators in sequence
 */
export class DecoratorComposer<T extends object> {
  private decorators: Decorator<T>[] = [];

  /**
   * Add decorator
   */
  add(decorator: Decorator<T>): this {
    this.decorators.push(decorator);
    return this;
  }

  /**
   * Apply all decorators
   */
  apply(target: T): T {
    return this.decorators.reduce((decorated, decorator) => decorator.decorate(decorated), target);
  }
}

/**
 * Create decorated instance with common decorators
 */
export function createDecorated<T extends object>(
  target: T,
  options: {
    logging?: {
      log: (message: string, metadata?: unknown) => void;
    };
    caching?: {
      ttl?: number;
    };
    timing?: boolean;
    retry?: {
      maxRetries?: number;
      delay?: number;
    };
    validation?: Map<string, (args: unknown[]) => boolean | Promise<boolean>>;
    errorHandling?: (error: Error, method: string, args: unknown[]) => unknown;
  } = {},
): T {
  const composer = new DecoratorComposer<T>();

  if (options.logging) {
    composer.add(new LoggingDecorator(options.logging));
  }

  if (options.caching) {
    composer.add(new CachingDecorator(options.caching.ttl));
  }

  if (options.timing) {
    composer.add(new TimingDecorator());
  }

  if (options.retry) {
    composer.add(new RetryDecorator(options.retry.maxRetries, options.retry.delay));
  }

  if (options.validation) {
    composer.add(new ValidationDecorator(options.validation));
  }

  if (options.errorHandling) {
    composer.add(new ErrorHandlingDecorator(options.errorHandling));
  }

  return composer.apply(target);
}
