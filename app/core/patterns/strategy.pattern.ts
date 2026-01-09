/**
 * Strategy Pattern Implementation
 * Enables runtime algorithm selection
 * Used for flexible data processing and transformation
 */

import type { Result } from '../../types';

/**
 * Base strategy interface
 */
export interface Strategy<TInput, TOutput> {
  /**
   * Strategy name/identifier
   */
  readonly name: string;

  /**
   * Execute strategy
   */
  execute(input: TInput): Promise<Result<TOutput>> | Result<TOutput>;

  /**
   * Check if strategy can handle input
   */
  canHandle?(input: TInput): boolean;

  /**
   * Strategy priority (higher = higher priority)
   */
  priority?: number;
}

/**
 * Strategy context
 * Manages and executes strategies
 */
export class StrategyContext<TInput, TOutput> {
  private strategies = new Map<string, Strategy<TInput, TOutput>>();

  /**
   * Register a strategy
   */
  register(strategy: Strategy<TInput, TOutput>): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * Unregister a strategy
   */
  unregister(name: string): void {
    this.strategies.delete(name);
  }

  /**
   * Execute specific strategy by name
   */
  async execute(strategyName: string, input: TInput): Promise<Result<TOutput>> {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      return {
        success: false,
        error: {
          type: 'STRATEGY_NOT_FOUND' as any,
          message: `Strategy "${strategyName}" not found`,
          timestamp: new Date(),
        },
      };
    }

    return await strategy.execute(input);
  }

  /**
   * Execute first strategy that can handle input
   */
  async executeFirst(input: TInput): Promise<Result<TOutput>> {
    // Sort strategies by priority
    const sortedStrategies = Array.from(this.strategies.values()).sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    );

    for (const strategy of sortedStrategies) {
      if (!strategy.canHandle || strategy.canHandle(input)) {
        return await strategy.execute(input);
      }
    }

    return {
      success: false,
      error: {
        type: 'NO_STRATEGY_AVAILABLE' as any,
        message: 'No strategy available to handle input',
        timestamp: new Date(),
      },
    };
  }

  /**
   * Execute all applicable strategies and combine results
   */
  async executeAll(input: TInput): Promise<Result<TOutput[]>> {
    const results: TOutput[] = [];

    for (const strategy of this.strategies.values()) {
      if (!strategy.canHandle || strategy.canHandle(input)) {
        const result = await strategy.execute(input);
        if (result.success) {
          results.push(result.data);
        }
      }
    }

    return {
      success: true,
      data: results,
    };
  }

  /**
   * Get all registered strategies
   */
  getStrategies(): Strategy<TInput, TOutput>[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Check if strategy is registered
   */
  hasStrategy(name: string): boolean {
    return this.strategies.has(name);
  }

  /**
   * Clear all strategies
   */
  clear(): void {
    this.strategies.clear();
  }
}

/**
 * Abstract strategy base class
 */
export abstract class BaseStrategy<TInput, TOutput> implements Strategy<TInput, TOutput> {
  abstract readonly name: string;
  priority?: number = 0;

  abstract execute(input: TInput): Promise<Result<TOutput>> | Result<TOutput>;

  canHandle?(input: TInput): boolean {
    return true;
  }
}
