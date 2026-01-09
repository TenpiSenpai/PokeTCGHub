/**
 * API and service layer type definitions
 */

import type { Card, CardSet } from './card.types';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

/**
 * Error types that can occur in the application
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Structured error information
 */
export interface ApiError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Card query options
 */
export interface CardQueryOptions {
  setCode: string;
  locale?: 'en' | 'jp';
}

/**
 * Card set query options
 */
export interface SetQueryOptions {
  locale?: 'en' | 'jp';
  includeCardCount?: boolean;
}

/**
 * Cache entry structure
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Service result type (for non-async operations)
 */
export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Repository interface pattern
 */
export interface Repository<T, TQuery = Record<string, unknown>> {
  findOne(query: TQuery): Promise<Result<T>>;
  findAll(query?: Partial<TQuery>): Promise<Result<T[]>>;
}

/**
 * Card repository interface
 */
export interface CardRepository extends Repository<Card, { setCode: string; cardNum: string }> {
  findBySet(setCode: string): Promise<Result<Card[]>>;
}

/**
 * Card set repository interface
 */
export interface CardSetRepository extends Repository<CardSet, { setCode: string }> {
  findByLocale(locale: 'en' | 'jp'): Promise<Result<CardSet[]>>;
}
