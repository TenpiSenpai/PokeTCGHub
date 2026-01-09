/**
 * Core Framework Index
 * Central export point for all enterprise abstractions
 * Maximum abstraction, extensibility, and design patterns
 */

// Abstract base classes
export * from './abstracts/base-repository.abstract';
export * from './abstracts/base-service.abstract';

// Interfaces
export * from './interfaces/logger.interface';
export * from './interfaces/event-bus.interface';

// Dependency Injection
export * from './di/container.interface';
export * from './di/container.impl';

// Event Bus
export * from './event-bus/event-bus.impl';

// Design Patterns
export * from './patterns/strategy.pattern';
export * from './patterns/middleware.pattern';
export * from './patterns/plugin.pattern';
export * from './patterns/command.pattern';
export * from './patterns/observer.pattern';
export * from './patterns/decorator.pattern';
export * from './patterns/facade.pattern';

// Re-export commonly used types
export type {
  BaseQuery,
  PaginationParams,
  SortParams,
  RepositoryOptions,
} from './abstracts/base-repository.abstract';

export type { ServiceContext, ServiceOptions } from './abstracts/base-service.abstract';

export type { ServiceIdentifier, ServiceFactory } from './di/container.interface';

export type { EventHandler, EventSubscription, Event } from './interfaces/event-bus.interface';

export type { Strategy } from './patterns/strategy.pattern';

export type { Middleware, PipelineContext } from './patterns/middleware.pattern';

export type { Plugin, PluginContext, PluginMetadata } from './patterns/plugin.pattern';

export type { Command } from './patterns/command.pattern';

export type { Observer, Observable } from './patterns/observer.pattern';

export type { Decorator } from './patterns/decorator.pattern';

export type { Facade } from './patterns/facade.pattern';
