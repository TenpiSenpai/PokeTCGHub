/**
 * Dependency Injection Container Implementation
 * Concrete implementation of IoC container
 */

import type {
  DIContainer,
  DIScope,
  ServiceIdentifier,
  ServiceFactory,
  ServiceRegistration,
  ServiceMetadata,
} from './container.interface';
import { ServiceLifetime } from './container.interface';

/**
 * Container implementation
 */
export class DIContainerImpl implements DIContainer {
  private registrations = new Map<ServiceIdentifier, ServiceRegistration>();
  private singletons = new Map<ServiceIdentifier, unknown>();
  private resolving = new Set<ServiceIdentifier>();

  /**
   * Register a service
   */
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    lifetime: ServiceLifetime = ServiceLifetime.SINGLETON,
    dependencies: ServiceIdentifier[] = [],
  ): void {
    this.registrations.set(identifier, {
      identifier,
      factory: factory as ServiceFactory,
      lifetime,
      dependencies,
    });
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    dependencies?: ServiceIdentifier[],
  ): void {
    this.register(identifier, factory, ServiceLifetime.SINGLETON, dependencies);
  }

  /**
   * Register a transient service
   */
  registerTransient<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    dependencies?: ServiceIdentifier[],
  ): void {
    this.register(identifier, factory, ServiceLifetime.TRANSIENT, dependencies);
  }

  /**
   * Register a scoped service
   */
  registerScoped<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    dependencies?: ServiceIdentifier[],
  ): void {
    this.register(identifier, factory, ServiceLifetime.SCOPED, dependencies);
  }

  /**
   * Register an instance directly
   */
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void {
    this.singletons.set(identifier, instance);
    this.registrations.set(identifier, {
      identifier,
      factory: () => instance,
      lifetime: ServiceLifetime.SINGLETON,
      dependencies: [],
    });
  }

  /**
   * Resolve a service
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    // Check for circular dependencies
    if (this.resolving.has(identifier)) {
      throw new Error(`Circular dependency detected for ${this.getIdentifierName(identifier)}`);
    }

    const registration = this.registrations.get(identifier);
    if (!registration) {
      throw new Error(`Service ${this.getIdentifierName(identifier)} not registered`);
    }

    // Return singleton if already created
    if (registration.lifetime === ServiceLifetime.SINGLETON) {
      if (this.singletons.has(identifier)) {
        return this.singletons.get(identifier) as T;
      }
    }

    // Track resolution for circular dependency detection
    this.resolving.add(identifier);

    try {
      // Create instance
      const instance = registration.factory(this);

      // Store singleton
      if (registration.lifetime === ServiceLifetime.SINGLETON) {
        this.singletons.set(identifier, instance);
      }

      return instance as T;
    } finally {
      this.resolving.delete(identifier);
    }
  }

  /**
   * Resolve all services of a type
   */
  resolveAll<T>(identifier: ServiceIdentifier<T>): T[] {
    const instances: T[] = [];

    for (const [key, registration] of this.registrations.entries()) {
      if (key === identifier) {
        instances.push(this.resolve(key));
      }
    }

    return instances;
  }

  /**
   * Try to resolve a service
   */
  tryResolve<T>(identifier: ServiceIdentifier<T>): T | undefined {
    try {
      return this.resolve(identifier);
    } catch {
      return undefined;
    }
  }

  /**
   * Check if service is registered
   */
  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.registrations.has(identifier);
  }

  /**
   * Get service metadata
   */
  getMetadata<T>(identifier: ServiceIdentifier<T>): ServiceMetadata | undefined {
    const registration = this.registrations.get(identifier);
    if (!registration) return undefined;

    return {
      lifetime: registration.lifetime,
      dependencies: registration.dependencies ?? [],
      registered: new Date(),
    };
  }

  /**
   * Create a new scope
   */
  createScope(): DIScope {
    return new DIScopeImpl(this);
  }

  /**
   * Unregister a service
   */
  unregister<T>(identifier: ServiceIdentifier<T>): void {
    this.registrations.delete(identifier);
    this.singletons.delete(identifier);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.registrations.clear();
    this.singletons.clear();
  }

  /**
   * Dispose container
   */
  async dispose(): Promise<void> {
    // Dispose all singletons that have dispose method
    for (const instance of this.singletons.values()) {
      if (instance && typeof instance === 'object' && 'dispose' in instance) {
        if (typeof instance.dispose === 'function') {
          await instance.dispose();
        }
      }
    }

    this.clear();
  }

  /**
   * Get readable identifier name
   */
  private getIdentifierName(identifier: ServiceIdentifier): string {
    if (typeof identifier === 'string') return identifier;
    if (typeof identifier === 'symbol') return identifier.toString();
    if (typeof identifier === 'function') return identifier.name;
    return 'unknown';
  }
}

/**
 * Scoped container implementation
 */
class DIScopeImpl implements DIScope {
  private scopedInstances = new Map<ServiceIdentifier, unknown>();

  constructor(private parent: DIContainer) {}

  /**
   * Resolve service within scope
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    const metadata = this.parent.getMetadata(identifier);

    // Return scoped instance if exists
    if (metadata?.lifetime === ServiceLifetime.SCOPED) {
      if (this.scopedInstances.has(identifier)) {
        return this.scopedInstances.get(identifier) as T;
      }
    }

    // Resolve from parent
    const instance = this.parent.resolve(identifier);

    // Store scoped instance
    if (metadata?.lifetime === ServiceLifetime.SCOPED) {
      this.scopedInstances.set(identifier, instance);
    }

    return instance;
  }

  /**
   * Dispose scope
   */
  async dispose(): Promise<void> {
    // Dispose all scoped instances
    for (const instance of this.scopedInstances.values()) {
      if (instance && typeof instance === 'object' && 'dispose' in instance) {
        if (typeof instance.dispose === 'function') {
          await instance.dispose();
        }
      }
    }

    this.scopedInstances.clear();
  }
}

/**
 * Global container instance
 */
export const container = new DIContainerImpl();
