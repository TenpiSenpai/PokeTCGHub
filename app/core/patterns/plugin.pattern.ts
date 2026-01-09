/**
 * Plugin System Pattern
 * Enables extensibility through pluggable modules
 * Supports lifecycle hooks and dependency injection
 */

import type { DIContainer } from '../di/container.interface';
import type { EventBus } from '../interfaces/event-bus.interface';
import type { Logger } from '../interfaces/logger.interface';

/**
 * Plugin context provided to plugins
 */
export interface PluginContext {
  container: DIContainer;
  eventBus: EventBus;
  logger: Logger;
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginHooks {
  /**
   * Called when plugin is registered
   */
  onRegister?(context: PluginContext): Promise<void> | void;

  /**
   * Called when plugin is initialized
   */
  onInitialize?(context: PluginContext): Promise<void> | void;

  /**
   * Called before application starts
   */
  onBeforeStart?(context: PluginContext): Promise<void> | void;

  /**
   * Called after application starts
   */
  onAfterStart?(context: PluginContext): Promise<void> | void;

  /**
   * Called before application stops
   */
  onBeforeStop?(context: PluginContext): Promise<void> | void;

  /**
   * Called when application stops
   */
  onStop?(context: PluginContext): Promise<void> | void;

  /**
   * Called when plugin is unregistered
   */
  onUnregister?(context: PluginContext): Promise<void> | void;
}

/**
 * Plugin interface
 */
export interface Plugin extends PluginHooks {
  /**
   * Plugin metadata
   */
  readonly metadata: PluginMetadata;

  /**
   * Setup plugin services
   */
  setup?(context: PluginContext): Promise<void> | void;

  /**
   * Get plugin configuration schema
   */
  getConfigSchema?(): unknown;
}

/**
 * Plugin status
 */
export enum PluginStatus {
  REGISTERED = 'registered',
  INITIALIZED = 'initialized',
  STARTED = 'started',
  STOPPED = 'stopped',
  ERROR = 'error',
}

/**
 * Plugin registration info
 */
interface PluginRegistration {
  plugin: Plugin;
  status: PluginStatus;
  error?: Error;
}

/**
 * Plugin manager
 */
export class PluginManager {
  private plugins = new Map<string, PluginRegistration>();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin): Promise<void> {
    const { name } = plugin.metadata;

    // Check if already registered
    if (this.plugins.has(name)) {
      throw new Error(`Plugin "${name}" is already registered`);
    }

    // Check dependencies
    if (plugin.metadata.dependencies) {
      for (const dep of plugin.metadata.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin "${name}" depends on "${dep}" which is not registered`);
        }
      }
    }

    // Register plugin
    this.plugins.set(name, {
      plugin,
      status: PluginStatus.REGISTERED,
    });

    try {
      // Call onRegister hook
      await plugin.onRegister?.(this.context);

      this.context.logger.info(`Plugin "${name}" registered successfully`);
    } catch (error) {
      this.plugins.get(name)!.status = PluginStatus.ERROR;
      this.plugins.get(name)!.error = error as Error;
      throw error;
    }
  }

  /**
   * Initialize plugin
   */
  async initialize(name: string): Promise<void> {
    const registration = this.plugins.get(name);

    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    const { plugin } = registration;

    try {
      // Setup plugin
      await plugin.setup?.(this.context);

      // Call onInitialize hook
      await plugin.onInitialize?.(this.context);

      registration.status = PluginStatus.INITIALIZED;

      this.context.logger.info(`Plugin "${name}" initialized successfully`);
    } catch (error) {
      registration.status = PluginStatus.ERROR;
      registration.error = error as Error;
      throw error;
    }
  }

  /**
   * Initialize all plugins
   */
  async initializeAll(): Promise<void> {
    for (const name of this.plugins.keys()) {
      await this.initialize(name);
    }
  }

  /**
   * Start plugin
   */
  async start(name: string): Promise<void> {
    const registration = this.plugins.get(name);

    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    const { plugin } = registration;

    try {
      await plugin.onBeforeStart?.(this.context);
      registration.status = PluginStatus.STARTED;
      await plugin.onAfterStart?.(this.context);

      this.context.logger.info(`Plugin "${name}" started successfully`);
    } catch (error) {
      registration.status = PluginStatus.ERROR;
      registration.error = error as Error;
      throw error;
    }
  }

  /**
   * Start all plugins
   */
  async startAll(): Promise<void> {
    for (const name of this.plugins.keys()) {
      await this.start(name);
    }
  }

  /**
   * Stop plugin
   */
  async stop(name: string): Promise<void> {
    const registration = this.plugins.get(name);

    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    const { plugin } = registration;

    try {
      await plugin.onBeforeStop?.(this.context);
      await plugin.onStop?.(this.context);
      registration.status = PluginStatus.STOPPED;

      this.context.logger.info(`Plugin "${name}" stopped successfully`);
    } catch (error) {
      registration.status = PluginStatus.ERROR;
      registration.error = error as Error;
      throw error;
    }
  }

  /**
   * Stop all plugins
   */
  async stopAll(): Promise<void> {
    const names = Array.from(this.plugins.keys()).reverse();
    for (const name of names) {
      await this.stop(name);
    }
  }

  /**
   * Unregister plugin
   */
  async unregister(name: string): Promise<void> {
    const registration = this.plugins.get(name);

    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    // Stop if running
    if (registration.status === PluginStatus.STARTED) {
      await this.stop(name);
    }

    const { plugin } = registration;

    try {
      await plugin.onUnregister?.(this.context);
      this.plugins.delete(name);

      this.context.logger.info(`Plugin "${name}" unregistered successfully`);
    } catch (error) {
      this.context.logger.error(`Failed to unregister plugin "${name}"`, error as Error);
      throw error;
    }
  }

  /**
   * Get plugin
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)?.plugin;
  }

  /**
   * Get plugin status
   */
  getStatus(name: string): PluginStatus | undefined {
    return this.plugins.get(name)?.status;
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values()).map((reg) => reg.plugin);
  }

  /**
   * Check if plugin is registered
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }
}

/**
 * Abstract base plugin class
 */
export abstract class BasePlugin implements Plugin {
  abstract readonly metadata: PluginMetadata;

  async onRegister?(context: PluginContext): Promise<void> {
    // Default implementation
  }

  async onInitialize?(context: PluginContext): Promise<void> {
    // Default implementation
  }

  async setup?(context: PluginContext): Promise<void> {
    // Default implementation
  }
}
