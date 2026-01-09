/**
 * Event Bus Implementation
 * Concrete implementation of event-driven architecture
 */

import type {
  EventBus,
  EventHandler,
  EventSubscription,
  EventMetadata,
  EventBusConfig,
} from '../interfaces/event-bus.interface';

/**
 * Event subscription implementation
 */
class EventSubscriptionImpl implements EventSubscription {
  constructor(
    private eventBus: EventBusImpl,
    private eventType: string,
    private handler: EventHandler,
  ) {}

  unsubscribe(): void {
    this.eventBus.off(this.eventType, this.handler);
  }
}

/**
 * Event bus implementation
 */
export class EventBusImpl implements EventBus {
  private listeners = new Map<string, Set<EventHandler>>();
  private onceListeners = new Map<string, Set<EventHandler>>();
  private config: EventBusConfig;

  constructor(config: EventBusConfig = {}) {
    this.config = {
      enableLogging: false,
      enableMetrics: false,
      maxListeners: 100,
      ...config,
    };
  }

  /**
   * Emit an event
   */
  async emit<T = unknown>(
    eventType: string,
    data: T,
    metadata?: Partial<EventMetadata>,
  ): Promise<void> {
    const fullMetadata: EventMetadata = {
      timestamp: new Date(),
      ...metadata,
    };

    if (this.config.enableLogging) {
      console.log(`[EventBus] Emitting event: ${eventType}`, data);
    }

    // Execute regular listeners
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      await Promise.all(Array.from(listeners).map((handler) => handler(data)));
    }

    // Execute once listeners
    const onceListeners = this.onceListeners.get(eventType);
    if (onceListeners) {
      await Promise.all(Array.from(onceListeners).map((handler) => handler(data)));
      this.onceListeners.delete(eventType);
    }
  }

  /**
   * Subscribe to an event
   */
  on<T = unknown>(eventType: string, handler: EventHandler<T>): EventSubscription {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const listeners = this.listeners.get(eventType)!;

    // Check max listeners
    if (listeners.size >= (this.config.maxListeners ?? 100)) {
      console.warn(
        `[EventBus] Max listeners (${this.config.maxListeners}) exceeded for event: ${eventType}`,
      );
    }

    listeners.add(handler as EventHandler);

    return new EventSubscriptionImpl(this, eventType, handler as EventHandler);
  }

  /**
   * Subscribe to an event (one-time)
   */
  once<T = unknown>(eventType: string, handler: EventHandler<T>): EventSubscription {
    if (!this.onceListeners.has(eventType)) {
      this.onceListeners.set(eventType, new Set());
    }

    this.onceListeners.get(eventType)!.add(handler as EventHandler);

    return new EventSubscriptionImpl(this, eventType, handler as EventHandler);
  }

  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(eventType: string, handler: EventHandler<T>): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(handler as EventHandler);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }

    const onceListeners = this.onceListeners.get(eventType);
    if (onceListeners) {
      onceListeners.delete(handler as EventHandler);
      if (onceListeners.size === 0) {
        this.onceListeners.delete(eventType);
      }
    }
  }

  /**
   * Unsubscribe all handlers for an event
   */
  offAll(eventType: string): void {
    this.listeners.delete(eventType);
    this.onceListeners.delete(eventType);
  }

  /**
   * Get all registered event types
   */
  getEventTypes(): string[] {
    const types = new Set<string>();

    for (const type of this.listeners.keys()) {
      types.add(type);
    }

    for (const type of this.onceListeners.keys()) {
      types.add(type);
    }

    return Array.from(types);
  }

  /**
   * Get listener count for an event
   */
  listenerCount(eventType: string): number {
    const regularCount = this.listeners.get(eventType)?.size ?? 0;
    const onceCount = this.onceListeners.get(eventType)?.size ?? 0;
    return regularCount + onceCount;
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.listeners.clear();
    this.onceListeners.clear();
  }

  /**
   * Check if event type has listeners
   */
  hasListeners(eventType: string): boolean {
    return this.listenerCount(eventType) > 0;
  }
}

/**
 * Global event bus instance
 */
export const eventBus = new EventBusImpl({ enableLogging: false });
