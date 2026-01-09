/**
 * Event Bus Interface
 * Defines contract for event-driven architecture
 * Supports pub/sub pattern with typed events
 */

/**
 * Event handler function type
 */
export type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

/**
 * Event metadata
 */
export interface EventMetadata {
  timestamp: Date;
  source?: string;
  correlation Id?: string;
}

/**
 * Event wrapper
 */
export interface Event<T = unknown> {
  type: string;
  data: T;
  metadata: EventMetadata;
}

/**
 * Event subscription
 */
export interface EventSubscription {
  unsubscribe(): void;
}

/**
 * Event bus configuration
 */
export interface EventBusConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  maxListeners?: number;
}

/**
 * Event bus interface
 * Implements Observer pattern for event-driven architecture
 */
export interface EventBus {
  /**
   * Emit an event
   */
  emit<T = unknown>(eventType: string, data: T, metadata?: Partial<EventMetadata>): Promise<void>;

  /**
   * Subscribe to an event
   */
  on<T = unknown>(eventType: string, handler: EventHandler<T>): EventSubscription;

  /**
   * Subscribe to an event (one-time)
   */
  once<T = unknown>(eventType: string, handler: EventHandler<T>): EventSubscription;

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(eventType: string, handler: EventHandler<T>): void;

  /**
   * Unsubscribe all handlers for an event
   */
  offAll(eventType: string): void;

  /**
   * Get all registered event types
   */
  getEventTypes(): string[];

  /**
   * Get listener count for an event
   */
  listenerCount(eventType: string): number;

  /**
   * Clear all event listeners
   */
  clear(): void;

  /**
   * Check if event type has listeners
   */
  hasListeners(eventType: string): boolean;
}
