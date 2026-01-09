# Architecture Documentation

## 📐 Overview

Poké TCG Hub is built using enterprise-level architecture patterns to ensure maintainability, scalability, and code quality. This document describes the architectural decisions and patterns used throughout the application.

## 🏗️ Architecture Layers

### 1. Presentation Layer (Components)

**Location**: `app/components/`

Vue 3 components using Composition API with TypeScript.

#### Principles:
- **Single Responsibility**: Each component has one clear purpose
- **Prop Validation**: Strict TypeScript interfaces for props
- **No Business Logic**: Components delegate to composables/services
- **Accessibility First**: ARIA labels, semantic HTML, keyboard navigation

#### Example:
```vue
<script setup lang="ts">
import type { Card } from '../types';

interface Props {
  card: Card;
}

const props = defineProps<Props>();
</script>
```

### 2. Composables Layer

**Location**: `app/composables/`

Reusable composition functions that encapsulate reactive logic.

#### Responsibilities:
- State management within components
- Reactive data operations
- Side effects (API calls)
- Computed values

#### Example:
```typescript
export function useCardSet(setCode?: string) {
  const cards = ref<Card[]>([]);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  async function fetchCardSet(code: string) {
    // Implementation
  }

  return { cards, loading, error, fetchCardSet };
}
```

### 3. Service Layer

**Location**: `app/services/`

Business logic and application-specific operations.

#### Responsibilities:
- Business rules enforcement
- Data transformation
- Orchestration of multiple operations
- Error handling

#### Pattern:
```typescript
export class CardService {
  private cardRepository: CardRepositoryImpl;

  async getCardSet(setCode: string): Promise<Result<CardSet>> {
    // Fetch data
    // Validate data
    // Transform data
    // Return result
  }
}
```

### 4. Repository Layer

**Location**: `app/repositories/`

Data access abstraction using Repository pattern.

#### Responsibilities:
- Data fetching
- Data persistence (if applicable)
- Query building
- Error handling at data layer

#### Interface:
```typescript
export interface Repository<T, TQuery> {
  findOne(query: TQuery): Promise<Result<T>>;
  findAll(query?: Partial<TQuery>): Promise<Result<T[]>>;
}
```

### 5. State Management Layer

**Location**: `app/stores/`

Centralized state management using Pinia.

#### Use Cases:
- Global application state
- Shared data between components
- Caching
- Complex state synchronization

#### Example:
```typescript
export const useCardsStore = defineStore('cards', () => {
  const cardSets = ref<Map<string, CardSet>>(new Map());

  async function fetchCardSet(setCode: string) {
    // Check cache
    // Fetch if needed
    // Update state
  }

  return { cardSets, fetchCardSet };
});
```

### 6. Utilities Layer

**Location**: `app/utils/`

Pure functions and helper utilities.

#### Categories:
- **Logger**: Structured logging
- **Error Handler**: Error processing and formatting
- **Sanitizer**: Security (XSS prevention)
- **Validators**: Data validation helpers

## 🎯 Design Patterns

### 1. Repository Pattern

Abstracts data access logic from business logic.

**Benefits**:
- Decoupling from data source
- Easier testing (mock repositories)
- Consistent error handling
- Swappable implementations

### 2. Service Layer Pattern

Encapsulates business logic separate from presentation.

**Benefits**:
- Reusable business logic
- Testable without UI
- Clear separation of concerns
- Easier maintenance

### 3. Result Pattern

Type-safe error handling without exceptions.

```typescript
type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };
```

**Benefits**:
- Explicit error handling
- Type-safe error types
- No uncaught exceptions
- Better API design

### 4. Factory Pattern

Used in error creation and type instantiation.

```typescript
export function createApiError(
  type: ErrorType,
  message: string
): ApiError {
  return {
    type,
    message,
    timestamp: new Date(),
  };
}
```

## 🔒 Security Architecture

### XSS Prevention

1. **No Direct v-html**: All HTML sanitized with DOMPurify
2. **Input Validation**: Zod schemas for runtime validation
3. **Output Encoding**: Escape HTML before rendering
4. **CSP Headers**: Content Security Policy configured

### Data Validation Pipeline

```
Raw Data → Zod Schema → Type Validation → Business Validation → Sanitization → Rendering
```

## 🧪 Testing Strategy

### Test Pyramid

```
        /\
       /E2E\      Few, broad integration tests
      /______\
     /        \
    / Component\  More component tests
   /____________\
  /              \
 /  Unit Tests    \ Many, focused unit tests
/__________________\
```

### Test Layers

1. **Unit Tests**: Services, utilities, composables
2. **Component Tests**: Vue component behavior
3. **E2E Tests**: Critical user flows

## 📦 Module Organization

### Feature-Based Structure

```
app/
├── types/           # Shared type definitions
├── schemas/         # Validation schemas
├── services/        # Business logic
├── repositories/    # Data access
├── stores/          # State management
├── composables/     # Reusable logic
├── components/      # UI components
└── utils/           # Helper functions
```

### Import Patterns

```typescript
// ✅ Good: Import from index files
import type { Card, CardSet } from '../types';
import { cardService } from '../services/card.service';

// ❌ Avoid: Deep imports
import type { Card } from '../types/card.types';
```

## 🚀 Performance Optimizations

### 1. Code Splitting

```typescript
// nuxt.config.ts
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'card-components': ['./app/components/card-list.vue'],
        },
      },
    },
  },
}
```

### 2. Lazy Loading

- Images: Intersection Observer
- Routes: Nuxt auto code-splitting
- Components: Dynamic imports when needed

### 3. Caching Strategy

- **In-Memory Cache**: Pinia stores
- **HTTP Cache**: Nuxt Content caching
- **Asset Cache**: Service Worker (future)

## 🔄 Data Flow

### Typical Request Flow

```
User Interaction
      ↓
Component Event Handler
      ↓
Composable Function
      ↓
Service Method
      ↓
Repository Query
      ↓
Data Source (Nuxt Content)
      ↓
Validation (Zod)
      ↓
Service Transform
      ↓
State Update (Pinia)
      ↓
Component Re-render
```

### Error Flow

```
Error Occurrence
      ↓
Caught by Repository/Service
      ↓
Converted to Result<T, ApiError>
      ↓
Logged by Logger
      ↓
Returned to Composable
      ↓
Displayed in Component
```

## 🎨 Type System Architecture

### Type Organization

```
types/
├── card.types.ts      # Card domain types
├── api.types.ts       # API/service types
├── ui.types.ts        # UI component types
└── index.ts           # Central exports
```

### Type Principles

1. **Strict Mode**: All types strictly defined
2. **No Any**: Explicit types required
3. **Type Guards**: Runtime type checking
4. **Utility Types**: Leverage TypeScript utilities

## 📊 State Management Philosophy

### When to Use Pinia

✅ **Use Pinia for**:
- Global application state
- Data shared across routes
- Caching layer
- Complex state with actions

❌ **Don't use Pinia for**:
- Component-local state (use `ref`/`reactive`)
- Derived state (use `computed`)
- Simple prop drilling (use props)

## 🔌 Plugin Architecture

### Nuxt Plugins

**Location**: `app/plugins/`

- **LazyLoad**: Intersection Observer directive
- **Error Handler**: Global error handling
- Future: Analytics, monitoring, etc.

## 🌐 Content Architecture

### YAML Data Structure

```
content/sets/
├── en/
│   ├── en_por.yaml
│   └── en_asc.yaml
└── jp/
    ├── jp_m3.yaml
    └── jp_m2a.yaml
```

### Content Processing

1. **Load**: Nuxt Content reads YAML
2. **Validate**: Zod schema validation
3. **Transform**: Service layer processing
4. **Cache**: Pinia store caching
5. **Render**: Component display

## 🏗️ Future Architecture Considerations

### Potential Enhancements

1. **GraphQL Layer**: For complex queries
2. **Service Worker**: Offline support
3. **Real-time Updates**: WebSocket integration
4. **Micro-frontends**: If scaling significantly
5. **Backend API**: For user-generated content

### Scalability Patterns

- **Horizontal**: Add more data sources
- **Vertical**: Enhanced features per module
- **Federation**: Split into micro-services if needed

## 📚 References

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Nuxt 3 Architecture](https://nuxt.com/docs/guide/concepts/auto-imports)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

Last Updated: 2026-01-09
