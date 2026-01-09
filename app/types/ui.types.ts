/**
 * UI component prop types and interfaces
 */

import type { Card, CardSet, EnergyTypeCode } from './card.types';

/**
 * Card list component props
 */
export interface CardListProps {
  setCode: string;
}

/**
 * Card block component props
 */
export interface CardBlockProps {
  card: Card;
  showImages?: boolean;
  lazyLoad?: boolean;
}

/**
 * Lazy image component props
 */
export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

/**
 * Header component props
 */
export interface HeaderProps {
  sets: CardSet[];
  currentLocale?: 'en' | 'jp';
}

/**
 * Loading states for components
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Component state with loading status
 */
export interface ComponentState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

/**
 * Navigation menu item
 */
export interface MenuItem {
  label: string;
  href: string;
  active?: boolean;
  children?: MenuItem[];
}

/**
 * Type color configuration
 */
export interface TypeColorConfig {
  type: EnergyTypeCode;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

/**
 * Filter options for card display
 */
export interface CardFilterOptions {
  types?: EnergyTypeCode[];
  stages?: number[];
  searchQuery?: string;
}

/**
 * Sort options for card display
 */
export enum CardSortOption {
  NUMBER = 'number',
  NAME = 'name',
  TYPE = 'type',
  HP = 'hp',
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: CardSortOption;
  direction: 'asc' | 'desc';
}
