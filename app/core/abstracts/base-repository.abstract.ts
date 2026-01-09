/**
 * Abstract Base Repository
 * Provides foundation for all repository implementations
 * Implements Repository pattern with SOLID principles
 */

import type { Result } from '../../types';

/**
 * Base query interface for all queries
 */
export interface BaseQuery {
  [key: string]: unknown;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Sorting parameters
 */
export interface SortParams<T = unknown> {
  field: keyof T;
  order: 'asc' | 'desc';
}

/**
 * Repository options
 */
export interface RepositoryOptions {
  cache?: boolean;
  cacheTTL?: number;
  transform?: boolean;
}

/**
 * Abstract base repository class
 * All repositories must extend this
 */
export abstract class BaseRepository<
  TEntity,
  TQuery extends BaseQuery = BaseQuery,
  TId = string,
> {
  /**
   * Repository name for logging and debugging
   */
  protected abstract readonly repositoryName: string;

  /**
   * Default options
   */
  protected defaultOptions: RepositoryOptions = {
    cache: true,
    cacheTTL: 300000, // 5 minutes
    transform: true,
  };

  /**
   * Finds a single entity by ID
   */
  abstract findById(id: TId, options?: RepositoryOptions): Promise<Result<TEntity>>;

  /**
   * Finds a single entity by query
   */
  abstract findOne(
    query: Partial<TQuery>,
    options?: RepositoryOptions,
  ): Promise<Result<TEntity>>;

  /**
   * Finds all entities matching query
   */
  abstract findAll(
    query?: Partial<TQuery>,
    options?: RepositoryOptions,
  ): Promise<Result<TEntity[]>>;

  /**
   * Finds entities with pagination
   */
  abstract findPaginated(
    query: Partial<TQuery>,
    pagination: PaginationParams,
    sort?: SortParams<TEntity>,
    options?: RepositoryOptions,
  ): Promise<
    Result<{
      data: TEntity[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>
  >;

  /**
   * Counts entities matching query
   */
  abstract count(query?: Partial<TQuery>): Promise<Result<number>>;

  /**
   * Checks if entity exists
   */
  abstract exists(query: Partial<TQuery>): Promise<Result<boolean>>;

  /**
   * Creates a new entity
   */
  abstract create(entity: Partial<TEntity>, options?: RepositoryOptions): Promise<Result<TEntity>>;

  /**
   * Updates an existing entity
   */
  abstract update(
    id: TId,
    updates: Partial<TEntity>,
    options?: RepositoryOptions,
  ): Promise<Result<TEntity>>;

  /**
   * Deletes an entity
   */
  abstract delete(id: TId, options?: RepositoryOptions): Promise<Result<boolean>>;

  /**
   * Clears repository cache
   */
  abstract clearCache(): Promise<void>;

  /**
   * Hook called before find operations
   */
  protected beforeFind?(query: Partial<TQuery>): Promise<void> | void;

  /**
   * Hook called after find operations
   */
  protected afterFind?(entity: TEntity | TEntity[]): Promise<void> | void;

  /**
   * Hook called before create operations
   */
  protected beforeCreate?(entity: Partial<TEntity>): Promise<void> | void;

  /**
   * Hook called after create operations
   */
  protected afterCreate?(entity: TEntity): Promise<void> | void;

  /**
   * Merges options with defaults
   */
  protected mergeOptions(options?: RepositoryOptions): RepositoryOptions {
    return { ...this.defaultOptions, ...options };
  }
}
