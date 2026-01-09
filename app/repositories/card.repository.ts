/**
 * Card repository - Data access layer for cards
 * Implements repository pattern for data operations
 */

import type { Card, CardSet, CardRepository, CardSetRepository, Result } from '../types';
import { ErrorType } from '../types';

/**
 * Card repository implementation
 * Handles data fetching from Nuxt Content
 */
export class CardRepositoryImpl implements CardSetRepository {
  /**
   * Finds a single card set by code
   * @param query - Query parameters
   * @returns Result with card set or error
   */
  async findOne(query: { setCode: string }): Promise<Result<CardSet>> {
    try {
      // Use Nuxt Content to query the YAML files
      const { $content } = useNuxtApp();

      // Determine locale from set code (en_ or jp_ prefix)
      const locale = query.setCode.startsWith('jp_') ? 'jp' : 'en';
      const path = `/sets/${locale}/${query.setCode}`;

      const data = await $content<CardSet>(path).findOne();

      if (!data) {
        return {
          success: false,
          error: {
            type: ErrorType.NOT_FOUND,
            message: `Card set ${query.setCode} not found`,
            timestamp: new Date(),
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: ErrorType.NETWORK_ERROR,
          message: error instanceof Error ? error.message : 'Failed to fetch card set',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Finds all card sets matching query
   * @param query - Optional query parameters
   * @returns Result with array of card sets or error
   */
  async findAll(query?: { setCode?: string }): Promise<Result<CardSet[]>> {
    try {
      const { $content } = useNuxtApp();

      let queryBuilder = $content<CardSet>('sets');

      if (query?.setCode) {
        queryBuilder = queryBuilder.where('set', query.setCode);
      }

      const data = await queryBuilder.find();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: ErrorType.NETWORK_ERROR,
          message: error instanceof Error ? error.message : 'Failed to fetch card sets',
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Finds card sets by locale
   * @param locale - Locale to filter by (en or jp)
   * @returns Result with array of card sets or error
   */
  async findByLocale(locale: 'en' | 'jp'): Promise<Result<CardSet[]>> {
    try {
      const { $content } = useNuxtApp();

      const data = await $content<CardSet>(`sets/${locale}`).find();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          type: ErrorType.NETWORK_ERROR,
          message: error instanceof Error ? error.message : `Failed to fetch ${locale} card sets`,
          timestamp: new Date(),
        },
      };
    }
  }
}

// Export singleton instance
export const cardRepository = new CardRepositoryImpl();
