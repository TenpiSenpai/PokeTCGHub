/**
 * Middleware Pipeline Pattern
 * Chain of Responsibility implementation for request processing
 * Enables composable, reusable processing logic
 */

import type { Result } from '../../types';

/**
 * Pipeline context
 */
export interface PipelineContext<TData = unknown> {
  data: TData;
  metadata: Map<string, unknown>;
  state: Map<string, unknown>;
}

/**
 * Next function type
 */
export type NextFunction<TContext> = (context?: TContext) => Promise<TContext>;

/**
 * Middleware function type
 */
export type Middleware<TContext extends PipelineContext> = (
  context: TContext,
  next: NextFunction<TContext>,
) => Promise<TContext>;

/**
 * Middleware pipeline
 */
export class MiddlewarePipeline<TData = unknown> {
  private middlewares: Middleware<PipelineContext<TData>>[] = [];

  /**
   * Add middleware to pipeline
   */
  use(middleware: Middleware<PipelineContext<TData>>): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Execute pipeline
   */
  async execute(data: TData): Promise<Result<TData>> {
    try {
      const context: PipelineContext<TData> = {
        data,
        metadata: new Map(),
        state: new Map(),
      };

      const result = await this.executeMiddlewares(context, 0);

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'PIPELINE_ERROR' as any,
          message: error instanceof Error ? error.message : 'Pipeline execution failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Execute middlewares recursively
   */
  private async executeMiddlewares(
    context: PipelineContext<TData>,
    index: number,
  ): Promise<PipelineContext<TData>> {
    // If no more middlewares, return context
    if (index >= this.middlewares.length) {
      return context;
    }

    const middleware = this.middlewares[index];

    // Create next function
    const next: NextFunction<PipelineContext<TData>> = async (
      updatedContext?: PipelineContext<TData>,
    ) => {
      return this.executeMiddlewares(updatedContext ?? context, index + 1);
    };

    // Execute middleware
    return await middleware(context, next);
  }

  /**
   * Clear all middlewares
   */
  clear(): void {
    this.middlewares = [];
  }

  /**
   * Get middleware count
   */
  get length(): number {
    return this.middlewares.length;
  }
}

/**
 * Abstract middleware base class
 */
export abstract class BaseMiddleware<TData = unknown> {
  abstract execute(
    context: PipelineContext<TData>,
    next: NextFunction<PipelineContext<TData>>,
  ): Promise<PipelineContext<TData>>;

  /**
   * Create middleware function
   */
  toMiddleware(): Middleware<PipelineContext<TData>> {
    return this.execute.bind(this);
  }
}

/**
 * Validation middleware
 */
export class ValidationMiddleware<TData = unknown> extends BaseMiddleware<TData> {
  constructor(private validator: (data: TData) => boolean | Promise<boolean>) {
    super();
  }

  async execute(
    context: PipelineContext<TData>,
    next: NextFunction<PipelineContext<TData>>,
  ): Promise<PipelineContext<TData>> {
    const isValid = await this.validator(context.data);

    if (!isValid) {
      throw new Error('Validation failed');
    }

    return next(context);
  }
}

/**
 * Transformation middleware
 */
export class TransformationMiddleware<TData = unknown> extends BaseMiddleware<TData> {
  constructor(private transformer: (data: TData) => TData | Promise<TData>) {
    super();
  }

  async execute(
    context: PipelineContext<TData>,
    next: NextFunction<PipelineContext<TData>>,
  ): Promise<PipelineContext<TData>> {
    context.data = await this.transformer(context.data);
    return next(context);
  }
}

/**
 * Logging middleware
 */
export class LoggingMiddleware<TData = unknown> extends BaseMiddleware<TData> {
  constructor(
    private logger: {
      log: (message: string, data?: unknown) => void;
    },
  ) {
    super();
  }

  async execute(
    context: PipelineContext<TData>,
    next: NextFunction<PipelineContext<TData>>,
  ): Promise<PipelineContext<TData>> {
    this.logger.log('Pipeline middleware executing', context.data);
    const result = await next(context);
    this.logger.log('Pipeline middleware completed', result.data);
    return result;
  }
}

/**
 * Error handling middleware
 */
export class ErrorHandlingMiddleware<TData = unknown> extends BaseMiddleware<TData> {
  constructor(
    private errorHandler: (error: Error, context: PipelineContext<TData>) => Promise<void>,
  ) {
    super();
  }

  async execute(
    context: PipelineContext<TData>,
    next: NextFunction<PipelineContext<TData>>,
  ): Promise<PipelineContext<TData>> {
    try {
      return await next(context);
    } catch (error) {
      await this.errorHandler(error as Error, context);
      throw error;
    }
  }
}

/**
 * Caching middleware
 */
export class CachingMiddleware<TData = unknown> extends BaseMiddleware<TData> {
  private cache = new Map<string, TData>();

  constructor(
    private keyExtractor: (data: TData) => string,
    private ttl?: number,
  ) {
    super();
  }

  async execute(
    context: PipelineContext<TData>,
    next: NextFunction<PipelineContext<TData>>,
  ): Promise<PipelineContext<TData>> {
    const key = this.keyExtractor(context.data);

    // Check cache
    if (this.cache.has(key)) {
      context.data = this.cache.get(key)!;
      context.metadata.set('cached', true);
      return context;
    }

    // Execute pipeline
    const result = await next(context);

    // Store in cache
    this.cache.set(key, result.data);

    // Set TTL if specified
    if (this.ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, this.ttl);
    }

    return result;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
