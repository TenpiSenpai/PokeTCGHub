/**
 * Observer Pattern Implementation
 * Advanced state management with reactive subscriptions
 * Supports fine-grained reactivity and change tracking
 */

/**
 * Observer interface
 */
export interface Observer<T = unknown> {
  update(data: T): void | Promise<void>;
}

/**
 * Observable subject
 */
export interface Observable<T = unknown> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(data: T): Promise<void>;
}

/**
 * Change notification
 */
export interface ChangeNotification<T = unknown> {
  oldValue: T;
  newValue: T;
  timestamp: Date;
  property?: string;
}

/**
 * Observable subject implementation
 */
export class Subject<T = unknown> implements Observable<T> {
  private observers: Set<Observer<T>> = new Set();

  /**
   * Attach observer
   */
  attach(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  /**
   * Detach observer
   */
  detach(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  /**
   * Notify all observers
   */
  async notify(data: T): Promise<void> {
    const notifications = Array.from(this.observers).map((observer) => observer.update(data));
    await Promise.all(notifications);
  }

  /**
   * Get observer count
   */
  get observerCount(): number {
    return this.observers.size;
  }

  /**
   * Clear all observers
   */
  clear(): void {
    this.observers.clear();
  }
}

/**
 * Reactive property with change tracking
 */
export class ReactiveProperty<T> {
  private value: T;
  private subject = new Subject<ChangeNotification<T>>();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  /**
   * Get current value
   */
  get(): T {
    return this.value;
  }

  /**
   * Set new value and notify observers
   */
  async set(newValue: T): Promise<void> {
    const oldValue = this.value;

    if (oldValue !== newValue) {
      this.value = newValue;

      await this.subject.notify({
        oldValue,
        newValue,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Subscribe to value changes
   */
  subscribe(observer: Observer<ChangeNotification<T>>): () => void {
    this.subject.attach(observer);

    // Return unsubscribe function
    return () => {
      this.subject.detach(observer);
    };
  }

  /**
   * Map property to another reactive property
   */
  map<U>(mapper: (value: T) => U): ReactiveProperty<U> {
    const mapped = new ReactiveProperty<U>(mapper(this.value));

    this.subscribe({
      update: async (change) => {
        await mapped.set(mapper(change.newValue));
      },
    });

    return mapped;
  }

  /**
   * Filter property changes
   */
  filter(predicate: (value: T) => boolean): ReactiveProperty<T> {
    const filtered = new ReactiveProperty<T>(this.value);

    this.subscribe({
      update: async (change) => {
        if (predicate(change.newValue)) {
          await filtered.set(change.newValue);
        }
      },
    });

    return filtered;
  }
}

/**
 * Reactive state store
 */
export class ReactiveStore<T extends Record<string, unknown>> {
  private properties = new Map<keyof T, ReactiveProperty<unknown>>();
  private subject = new Subject<Partial<T>>();

  constructor(initialState: T) {
    // Create reactive properties for each state property
    for (const [key, value] of Object.entries(initialState)) {
      const prop = new ReactiveProperty(value);
      this.properties.set(key as keyof T, prop);

      // Subscribe to property changes
      prop.subscribe({
        update: async (change) => {
          await this.subject.notify({ [key]: change.newValue } as Partial<T>);
        },
      });
    }
  }

  /**
   * Get property value
   */
  get<K extends keyof T>(key: K): T[K] {
    const prop = this.properties.get(key);
    if (!prop) {
      throw new Error(`Property "${String(key)}" does not exist`);
    }
    return prop.get() as T[K];
  }

  /**
   * Set property value
   */
  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    const prop = this.properties.get(key);
    if (!prop) {
      throw new Error(`Property "${String(key)}" does not exist`);
    }
    await (prop as ReactiveProperty<T[K]>).set(value);
  }

  /**
   * Update multiple properties
   */
  async update(updates: Partial<T>): Promise<void> {
    const promises = Object.entries(updates).map(([key, value]) =>
      this.set(key as keyof T, value as T[keyof T]),
    );
    await Promise.all(promises);
  }

  /**
   * Subscribe to store changes
   */
  subscribe(observer: Observer<Partial<T>>): () => void {
    this.subject.attach(observer);

    return () => {
      this.subject.detach(observer);
    };
  }

  /**
   * Subscribe to specific property changes
   */
  subscribeToProperty<K extends keyof T>(
    key: K,
    observer: Observer<ChangeNotification<T[K]>>,
  ): () => void {
    const prop = this.properties.get(key);
    if (!prop) {
      throw new Error(`Property "${String(key)}" does not exist`);
    }
    return (prop as ReactiveProperty<T[K]>).subscribe(observer);
  }

  /**
   * Get current state snapshot
   */
  getState(): T {
    const state: Partial<T> = {};
    for (const [key, prop] of this.properties.entries()) {
      state[key] = prop.get() as T[keyof T];
    }
    return state as T;
  }

  /**
   * Reset store to initial state
   */
  async reset(initialState: T): Promise<void> {
    await this.update(initialState);
  }
}

/**
 * Computed reactive value
 */
export class ComputedProperty<T> {
  private value: T;
  private dependencies: ReactiveProperty<unknown>[] = [];

  constructor(
    private computer: () => T,
    dependencies: ReactiveProperty<unknown>[],
  ) {
    this.value = computer();
    this.dependencies = dependencies;

    // Subscribe to all dependencies
    for (const dep of dependencies) {
      dep.subscribe({
        update: async () => {
          this.recompute();
        },
      });
    }
  }

  /**
   * Get computed value
   */
  get(): T {
    return this.value;
  }

  /**
   * Recompute value
   */
  private recompute(): void {
    this.value = this.computer();
  }
}

/**
 * Observable collection
 */
export class ObservableCollection<T> {
  private items: T[] = [];
  private addSubject = new Subject<{ item: T; index: number }>();
  private removeSubject = new Subject<{ item: T; index: number }>();
  private changeSubject = new Subject<T[]>();

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  /**
   * Add item
   */
  async add(item: T): Promise<void> {
    this.items.push(item);
    const index = this.items.length - 1;

    await this.addSubject.notify({ item, index });
    await this.changeSubject.notify([...this.items]);
  }

  /**
   * Remove item
   */
  async remove(item: T): Promise<void> {
    const index = this.items.indexOf(item);

    if (index !== -1) {
      this.items.splice(index, 1);
      await this.removeSubject.notify({ item, index });
      await this.changeSubject.notify([...this.items]);
    }
  }

  /**
   * Get all items
   */
  getAll(): T[] {
    return [...this.items];
  }

  /**
   * Subscribe to additions
   */
  onAdd(observer: Observer<{ item: T; index: number }>): () => void {
    this.addSubject.attach(observer);
    return () => this.addSubject.detach(observer);
  }

  /**
   * Subscribe to removals
   */
  onRemove(observer: Observer<{ item: T; index: number }>): () => void {
    this.removeSubject.attach(observer);
    return () => this.removeSubject.detach(observer);
  }

  /**
   * Subscribe to any changes
   */
  onChange(observer: Observer<T[]>): () => void {
    this.changeSubject.attach(observer);
    return () => this.changeSubject.detach(observer);
  }

  /**
   * Clear collection
   */
  async clear(): Promise<void> {
    this.items = [];
    await this.changeSubject.notify([]);
  }

  /**
   * Get collection size
   */
  get size(): number {
    return this.items.length;
  }
}
