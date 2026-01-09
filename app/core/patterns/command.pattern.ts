/**
 * Command Pattern Implementation
 * Encapsulates operations as objects
 * Supports undo/redo, queuing, and logging
 */

import type { Result } from '../../types';

/**
 * Command interface
 */
export interface Command<TResult = unknown> {
  /**
   * Command name
   */
  readonly name: string;

  /**
   * Execute command
   */
  execute(): Promise<Result<TResult>>;

  /**
   * Undo command (optional)
   */
  undo?(): Promise<Result<void>>;

  /**
   * Check if command can be undone
   */
  canUndo?(): boolean;

  /**
   * Validate command before execution
   */
  validate?(): Promise<Result<void>>;
}

/**
 * Command history entry
 */
interface CommandHistoryEntry<T = unknown> {
  command: Command<T>;
  result: Result<T>;
  timestamp: Date;
  executionTime: number;
}

/**
 * Command invoker
 * Executes commands and manages history
 */
export class CommandInvoker {
  private history: CommandHistoryEntry[] = [];
  private currentIndex = -1;
  private maxHistorySize = 50;

  /**
   * Execute a command
   */
  async execute<T>(command: Command<T>): Promise<Result<T>> {
    const startTime = Date.now();

    try {
      // Validate command if validation is available
      if (command.validate) {
        const validation = await command.validate();
        if (!validation.success) {
          return validation as Result<T>;
        }
      }

      // Execute command
      const result = await command.execute();
      const executionTime = Date.now() - startTime;

      // Add to history if successful
      if (result.success) {
        this.addToHistory({
          command,
          result,
          timestamp: new Date(),
          executionTime,
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'COMMAND_EXECUTION_ERROR' as any,
          message: error instanceof Error ? error.message : 'Command execution failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Undo last command
   */
  async undo(): Promise<Result<void>> {
    if (!this.canUndo()) {
      return {
        success: false,
        error: {
          type: 'UNDO_NOT_AVAILABLE' as any,
          message: 'Nothing to undo',
          timestamp: new Date(),
        },
      };
    }

    const entry = this.history[this.currentIndex];
    const { command } = entry;

    if (!command.undo) {
      return {
        success: false,
        error: {
          type: 'UNDO_NOT_SUPPORTED' as any,
          message: `Command "${command.name}" does not support undo`,
          timestamp: new Date(),
        },
      };
    }

    try {
      const result = await command.undo();

      if (result.success) {
        this.currentIndex--;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'UNDO_ERROR' as any,
          message: error instanceof Error ? error.message : 'Undo failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Redo last undone command
   */
  async redo(): Promise<Result<unknown>> {
    if (!this.canRedo()) {
      return {
        success: false,
        error: {
          type: 'REDO_NOT_AVAILABLE' as any,
          message: 'Nothing to redo',
          timestamp: new Date(),
        },
      };
    }

    const entry = this.history[this.currentIndex + 1];
    const { command } = entry;

    try {
      const result = await command.execute();

      if (result.success) {
        this.currentIndex++;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'REDO_ERROR' as any,
          message: error instanceof Error ? error.message : 'Redo failed',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get command history
   */
  getHistory(): CommandHistoryEntry[] {
    return [...this.history];
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Set max history size
   */
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
    this.trimHistory();
  }

  /**
   * Add command to history
   */
  private addToHistory(entry: CommandHistoryEntry): void {
    // Remove any commands after current index (they were undone)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new command
    this.history.push(entry);
    this.currentIndex++;

    // Trim history if needed
    this.trimHistory();
  }

  /**
   * Trim history to max size
   */
  private trimHistory(): void {
    if (this.history.length > this.maxHistorySize) {
      const removeCount = this.history.length - this.maxHistorySize;
      this.history = this.history.slice(removeCount);
      this.currentIndex -= removeCount;
    }
  }
}

/**
 * Abstract base command class
 */
export abstract class BaseCommand<TResult = unknown> implements Command<TResult> {
  abstract readonly name: string;

  abstract execute(): Promise<Result<TResult>>;

  async undo?(): Promise<Result<void>> {
    return {
      success: false,
      error: {
        type: 'UNDO_NOT_IMPLEMENTED' as any,
        message: `Undo not implemented for command "${this.name}"`,
        timestamp: new Date(),
      },
    };
  }

  canUndo?(): boolean {
    return false;
  }

  async validate?(): Promise<Result<void>> {
    return { success: true, data: undefined };
  }
}

/**
 * Composite command (executes multiple commands)
 */
export class CompositeCommand<TResult = unknown> extends BaseCommand<TResult[]> {
  readonly name = 'CompositeCommand';

  constructor(private commands: Command<TResult>[]) {
    super();
  }

  async execute(): Promise<Result<TResult[]>> {
    const results: TResult[] = [];

    for (const command of this.commands) {
      const result = await command.execute();

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      results.push(result.data);
    }

    return {
      success: true,
      data: results,
    };
  }

  async undo(): Promise<Result<void>> {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      const command = this.commands[i];

      if (command.undo) {
        const result = await command.undo();

        if (!result.success) {
          return result;
        }
      }
    }

    return { success: true, data: undefined };
  }

  canUndo(): boolean {
    return this.commands.every((cmd) => cmd.canUndo?.() ?? false);
  }
}

/**
 * Command queue for batch execution
 */
export class CommandQueue {
  private queue: Command[] = [];
  private processing = false;

  /**
   * Add command to queue
   */
  enqueue(command: Command): void {
    this.queue.push(command);
  }

  /**
   * Process queue
   */
  async process(invoker: CommandInvoker): Promise<Result<unknown[]>> {
    if (this.processing) {
      return {
        success: false,
        error: {
          type: 'QUEUE_PROCESSING' as any,
          message: 'Queue is already being processed',
          timestamp: new Date(),
        },
      };
    }

    this.processing = true;
    const results: unknown[] = [];

    try {
      while (this.queue.length > 0) {
        const command = this.queue.shift()!;
        const result = await invoker.execute(command);

        if (!result.success) {
          return result as Result<unknown[]>;
        }

        results.push(result.data);
      }

      return {
        success: true,
        data: results,
      };
    } finally {
      this.processing = false;
    }
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get queue size
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
