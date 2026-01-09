# Enterprise Abstraction Patterns

## 🎯 Overview

This document describes the extensive abstraction patterns and design principles used in the PokéTCG Hub codebase. The architecture prioritizes **maximum extensibility**, **flexibility**, and **maintainability** through extensive use of enterprise design patterns.

## 📐 Core Abstractions

### Base Repository Abstract Class

**Location**: `app/core/abstracts/base-repository.abstract.ts`

**Purpose**: Provides foundation for all data access implementations

**Features**:
- Generic CRUD operations
- Pagination support
- Sorting capabilities
- Lifecycle hooks (beforeFind, afterFind, etc.)
- Options pattern for configuration
- Cache management

**Usage**:
```typescript
export class CardRepository extends BaseRepository<Card, CardQuery, string> {
  protected readonly repositoryName = 'CardRepository';

  async findById(id: string): Promise<Result<Card>> {
    // Implementation
  }
}
```

**Benefits**:
- Consistent API across all repositories
- Easy to mock for testing
- Built-in pagination and sorting
- Extensible through hooks

---

### Base Service Abstract Class

**Location**: `app/core/abstracts/base-service.abstract.ts`

**Purpose**: Foundation for all business logic services

**Features**:
- Dependency injection through ServiceContext
- Lifecycle management (initialize, dispose)
- Operation lifecycle hooks
- Automatic event emission
- Error handling
- Logging integration

**Usage**:
```typescript
export class CardService extends BaseService<Card, string> {
  protected readonly serviceName = 'CardService';

  async getCard(id: string): Promise<Result<Card>> {
    return this.executeOperation('getCard', async () => {
      // Implementation
    });
  }
}
```

**Benefits**:
- Consistent error handling
- Automatic logging
- Event-driven architecture integration
- Lifecycle management

---

## 🏗️ Design Patterns

### 1. Dependency Injection Container

**Location**: `app/core/di/`

**Pattern**: Inversion of Control (IoC)

**Features**:
- Service lifetime management (Singleton, Transient, Scoped)
- Automatic dependency resolution
- Circular dependency detection
- Scope management
- Disposal management

**Usage**:
```typescript
import { container, ServiceLifetime } from '~/core';

// Register services
container.registerSingleton('Logger', () => new ConsoleLogger());
container.registerTransient('CardService', (c) => new CardService(c.resolve('Logger')));

// Resolve services
const cardService = container.resolve<CardService>('CardService');
```

**Benefits**:
- Loose coupling
- Easy testing (mock dependencies)
- Centralized dependency management
- Automatic lifetime management

---

### 2. Event-Driven Architecture (Event Bus)

**Location**: `app/core/event-bus/`

**Pattern**: Observer / Pub-Sub

**Features**:
- Type-safe event subscriptions
- One-time subscriptions
- Event metadata
- Max listeners protection
- Async event handlers

**Usage**:
```typescript
import { eventBus } from '~/core';

// Subscribe to events
const subscription = eventBus.on<Card>('card.created', async (card) => {
  console.log('Card created:', card);
});

// Emit events
await eventBus.emit('card.created', newCard);

// Unsubscribe
subscription.unsubscribe();
```

**Benefits**:
- Decoupled components
- Easy to add features without modifying existing code
- Async operation support
- Type safety

---

### 3. Strategy Pattern

**Location**: `app/core/patterns/strategy.pattern.ts`

**Purpose**: Runtime algorithm selection

**Features**:
- Multiple strategy registration
- Priority-based selection
- Conditional strategy execution
- Strategy composition

**Usage**:
```typescript
import { StrategyContext, BaseStrategy } from '~/core';

class CacheStrategy extends BaseStrategy<Card, Card> {
  readonly name = 'cache';
  priority = 10;

  execute(card: Card): Result<Card> {
    // Cache logic
  }
}

const context = new StrategyContext<Card, Card>();
context.register(new CacheStrategy());
await context.execute('cache', card);
```

**Benefits**:
- Flexible algorithm selection
- Easy to add new strategies
- Priority-based execution
- Testable in isolation

---

### 4. Middleware Pipeline

**Location**: `app/core/patterns/middleware.pattern.ts`

**Pattern**: Chain of Responsibility

**Features**:
- Composable processing pipeline
- Context passing
- Built-in middlewares (validation, logging, caching, etc.)
- Error handling
- Transformation support

**Usage**:
```typescript
import { MiddlewarePipeline, ValidationMiddleware } from '~/core';

const pipeline = new MiddlewarePipeline<Card>();

pipeline
  .use(new ValidationMiddleware((card) => card.hp > 0).toMiddleware())
  .use(new TransformationMiddleware((card) => ({ ...card, processed: true })).toMiddleware())
  .use(new LoggingMiddleware(logger).toMiddleware());

const result = await pipeline.execute(card);
```

**Benefits**:
- Reusable processing logic
- Order-independent middleware
- Easy to add cross-cutting concerns
- Testable middleware in isolation

---

### 5. Plugin System

**Location**: `app/core/patterns/plugin.pattern.ts`

**Purpose**: Extensibility through pluggable modules

**Features**:
- Lifecycle hooks (onRegister, onInitialize, onStart, etc.)
- Dependency management
- Plugin metadata
- Status tracking
- Error handling

**Usage**:
```typescript
import { PluginManager, BasePlugin } from '~/core';

class AnalyticsPlugin extends BasePlugin {
  readonly metadata = {
    name: 'analytics',
    version: '1.0.0',
    description: 'Analytics tracking'
  };

  async onInitialize(context: PluginContext) {
    // Setup analytics
  }
}

const manager = new PluginManager(context);
await manager.register(new AnalyticsPlugin());
await manager.initializeAll();
```

**Benefits**:
- Modular architecture
- Easy to add/remove features
- Isolated plugin development
- Dependency management

---

### 6. Command Pattern

**Location**: `app/core/patterns/command.pattern.ts`

**Purpose**: Encapsulate operations as objects

**Features**:
- Undo/Redo support
- Command history
- Command queuing
- Validation before execution
- Composite commands

**Usage**:
```typescript
import { CommandInvoker, BaseCommand } from '~/core';

class CreateCardCommand extends BaseCommand<Card> {
  readonly name = 'createCard';

  async execute(): Promise<Result<Card>> {
    // Create card
  }

  async undo(): Promise<Result<void>> {
    // Delete card
  }

  canUndo(): boolean {
    return true;
  }
}

const invoker = new CommandInvoker();
await invoker.execute(new CreateCardCommand());
await invoker.undo();
```

**Benefits**:
- Undo/Redo capability
- Operation history
- Batch operations
- Transaction-like behavior

---

### 7. Observer Pattern (Advanced)

**Location**: `app/core/patterns/observer.pattern.ts`

**Purpose**: Reactive state management

**Features**:
- Reactive properties
- Change notifications
- Computed properties
- Observable collections
- Reactive store

**Usage**:
```typescript
import { ReactiveProperty, ReactiveStore } from '~/core';

const count = new ReactiveProperty(0);

count.subscribe({
  update: (change) => {
    console.log(`Count changed from ${change.oldValue} to ${change.newValue}`);
  }
});

await count.set(10);

// Reactive Store
const store = new ReactiveStore({ count: 0, name: 'Test' });
await store.set('count', 5);
```

**Benefits**:
- Fine-grained reactivity
- Change tracking
- Computed values
- Type-safe subscriptions

---

### 8. Decorator Pattern

**Location**: `app/core/patterns/decorator.pattern.ts`

**Purpose**: Add cross-cutting concerns without modifying classes

**Features**:
- Logging decorator
- Caching decorator
- Timing decorator
- Retry decorator
- Validation decorator
- Error handling decorator
- Decorator composition

**Usage**:
```typescript
import { createDecorated } from '~/core';

const service = createDecorated(new CardService(), {
  logging: { log: console.log },
  caching: { ttl: 5000 },
  timing: true,
  retry: { maxRetries: 3, delay: 1000 }
});

// Service now has logging, caching, timing, and retry
```

**Benefits**:
- Non-invasive feature addition
- Composable decorators
- Reusable cross-cutting concerns
- Easy to enable/disable features

---

### 9. Facade Pattern

**Location**: `app/core/patterns/facade.pattern.ts`

**Purpose**: Simplified interface to complex subsystems

**Features**:
- Coordinate multiple services
- Parallel operation execution
- Sequential operation execution
- Error handling
- Event emission

**Usage**:
```typescript
import { BaseFacade } from '~/core';

class CardFacade extends BaseFacade {
  readonly name = 'CardFacade';

  async getCardWithDetails(id: string): Promise<Result<CardDetails>> {
    return this.execute(async () => {
      // Coordinate multiple services
      const card = await cardService.get(id);
      const stats = await statsService.get(id);
      const images = await imageService.get(id);

      return {
        success: true,
        data: { card, stats, images }
      };
    }, 'getCardWithDetails');
  }
}
```

**Benefits**:
- Simplified API
- Coordinate complex operations
- Hide subsystem complexity
- Single entry point

---

## 🎯 Abstraction Principles

### 1. **Dependency Inversion Principle (DIP)**

High-level modules should not depend on low-level modules. Both should depend on abstractions.

```typescript
// ✅ Good: Depend on interface
class CardService {
  constructor(private logger: Logger) {}
}

// ❌ Bad: Depend on concrete implementation
class CardService {
  constructor(private logger: ConsoleLogger) {}
}
```

### 2. **Open/Closed Principle (OCP)**

Software entities should be open for extension but closed for modification.

```typescript
// ✅ Good: Extend base class
class CustomRepository extends BaseRepository<Card> {
  // Add custom behavior
}

// ❌ Bad: Modify existing class
```

### 3. **Interface Segregation Principle (ISP)**

Clients should not depend on interfaces they don't use.

```typescript
// ✅ Good: Small, focused interfaces
interface Readable<T> {
  read(id: string): Promise<T>;
}

interface Writable<T> {
  write(data: T): Promise<void>;
}
```

### 4. **Liskov Substitution Principle (LSP)**

Derived classes must be substitutable for their base classes.

```typescript
// ✅ Good: Substitutable
function process(repo: BaseRepository<Card>) {
  // Works with any repository implementation
}
```

### 5. **Single Responsibility Principle (SRP)**

A class should have only one reason to change.

```typescript
// ✅ Good: Single responsibility
class CardValidator {
  validate(card: Card): boolean {}
}

class CardFormatter {
  format(card: Card): string {}
}
```

---

## 🔧 Using the Abstraction Layers

### Example: Creating a New Feature

```typescript
// 1. Define types
interface PokemonCard extends Card {
  evolution: string;
}

// 2. Create repository
class PokemonRepository extends BaseRepository<PokemonCard, Query> {
  protected readonly repositoryName = 'PokemonRepository';
  // Implement abstract methods
}

// 3. Create service
class PokemonService extends BaseService<PokemonCard> {
  protected readonly serviceName = 'PokemonService';

  constructor(
    context: ServiceContext,
    private repository: PokemonRepository
  ) {
    super(context);
  }

  async evolve(id: string): Promise<Result<PokemonCard>> {
    return this.executeOperation('evolve', async () => {
      // Business logic
    });
  }
}

// 4. Register in DI container
container.registerSingleton('PokemonRepository', () => new PokemonRepository());
container.registerSingleton('PokemonService', (c) =>
  new PokemonService(
    { logger: c.resolve('Logger'), eventBus: c.resolve('EventBus') },
    c.resolve('PokemonRepository')
  )
);

// 5. Create facade (optional)
class PokemonFacade extends BaseFacade {
  async getPokemonWithEvolution(id: string) {
    // Coordinate services
  }
}

// 6. Add decorators (optional)
const service = createDecorated(pokemonService, {
  logging: { log: logger.log },
  caching: { ttl: 60000 }
});
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Facade Layer                         │
│          (Simplified Interface for Complex Ops)         │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                         │
│            (Business Logic + Validation)                │
│          Extends BaseService<T> abstract class          │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Repository Layer                        │
│                  (Data Access)                          │
│        Extends BaseRepository<T> abstract class         │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Source                           │
│               (Nuxt Content, API, etc.)                 │
└─────────────────────────────────────────────────────────┘

     Cross-Cutting Concerns (Applied via Decorators)
┌─────────────────────────────────────────────────────────┐
│  Logging | Caching | Timing | Retry | Validation       │
└─────────────────────────────────────────────────────────┘

        Event-Driven Communication (Event Bus)
┌─────────────────────────────────────────────────────────┐
│  Service A ──► Event Bus ──► Service B                  │
│  Component ──► Event Bus ──► Plugin                     │
└─────────────────────────────────────────────────────────┘

         Dependency Management (DI Container)
┌─────────────────────────────────────────────────────────┐
│  Container resolves dependencies automatically          │
│  Manages service lifetimes (Singleton/Transient/Scoped) │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Benefits of Maximum Abstraction

### 1. **Extensibility**
- Add new features without modifying existing code
- Plugin system allows third-party extensions
- Strategy pattern enables algorithm selection

### 2. **Testability**
- Mock dependencies easily through DI
- Test services in isolation
- Test decorators independently

### 3. **Maintainability**
- Clear separation of concerns
- Single responsibility classes
- Consistent patterns throughout codebase

### 4. **Flexibility**
- Swap implementations at runtime
- Configure behavior through decorators
- Adjust strategies dynamically

### 5. **Reusability**
- Abstract base classes provide common functionality
- Middleware can be reused across features
- Decorators apply to any class

### 6. **Scalability**
- Add new repositories/services easily
- Plugin system scales with features
- Event bus prevents tight coupling

---

## 📝 Best Practices

1. **Always depend on abstractions, not concretions**
2. **Use DI container for all service instantiation**
3. **Extend base classes for consistency**
4. **Apply decorators for cross-cutting concerns**
5. **Use event bus for loose coupling**
6. **Leverage strategies for varying algorithms**
7. **Apply middleware for processing pipelines**
8. **Create facades for complex operations**
9. **Use commands for undoable operations**
10. **Implement observers for reactive state**

---

## 🎓 Further Reading

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)
- [Dependency Injection in TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [Chain of Responsibility Pattern](https://refactoring.guru/design-patterns/chain-of-responsibility)

---

**Last Updated**: 2026-01-09
**Version**: 2.0.0 (Maximum Abstraction)
