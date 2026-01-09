/**
 * Dependency Injection Container Interface
 * Provides IoC container for dependency management
 * Supports singleton, transient, and scoped lifetimes
 */

/**
 * Service lifetime
 */
export enum ServiceLifetime {
  SINGLETON = 'singleton', // One instance for entire application
  TRANSIENT = 'transient', // New instance every time
  SCOPED = 'scoped', // One instance per scope (e.g., per request)
}

/**
 * Service identifier
 */
export type ServiceIdentifier<T = unknown> = string | symbol | (new (...args: unknown[]) => T);

/**
 * Factory function for creating service instances
 */
export type ServiceFactory<T = unknown> = (container: DIContainer) => T | Promise<T>;

/**
 * Service registration
 */
export interface ServiceRegistration<T = unknown> {
  identifier: ServiceIdentifier<T>;
  factory: ServiceFactory<T>;
  lifetime: ServiceLifetime;
  dependencies?: ServiceIdentifier[];
}

/**
 * Service metadata
 */
export interface ServiceMetadata {
  lifetime: ServiceLifetime;
  dependencies: ServiceIdentifier[];
  registered: Date;
}

/**
 * DI Container scope
 */
export interface DIScope {
  resolve<T>(identifier: ServiceIdentifier<T>): T;
  dispose(): Promise<void>;
}

/**
 * Dependency Injection Container interface
 */
export interface DIContainer {
  /**
   * Register a service
   */
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    lifetime?: ServiceLifetime,
    dependencies?: ServiceIdentifier[],
  ): void;

  /**
   * Register a singleton service
   */
  registerSingleton<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    dependencies?: ServiceIdentifier[],
  ): void;

  /**
   * Register a transient service
   */
  registerTransient<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    dependencies?: ServiceIdentifier[],
  ): void;

  /**
   * Register a scoped service
   */
  registerScoped<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    dependencies?: ServiceIdentifier[],
  ): void;

  /**
   * Register an instance directly
   */
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void;

  /**
   * Resolve a service
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T;

  /**
   * Resolve all services of a type
   */
  resolveAll<T>(identifier: ServiceIdentifier<T>): T[];

  /**
   * Try to resolve a service (returns undefined if not found)
   */
  tryResolve<T>(identifier: ServiceIdentifier<T>): T | undefined;

  /**
   * Check if service is registered
   */
  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean;

  /**
   * Get service metadata
   */
  getMetadata<T>(identifier: ServiceIdentifier<T>): ServiceMetadata | undefined;

  /**
   * Create a new scope
   */
  createScope(): DIScope;

  /**
   * Unregister a service
   */
  unregister<T>(identifier: ServiceIdentifier<T>): void;

  /**
   * Clear all registrations
   */
  clear(): void;

  /**
   * Dispose container and all singleton instances
   */
  dispose(): Promise<void>;
}
