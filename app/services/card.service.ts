/**
 * Card service - Business logic for card operations
 * Implements enterprise-level service layer pattern
 */

import type { Card, CardSet, Result, ApiError, CardReference } from '../types';
import type { CardSetSchemaType } from '../schemas';
import { validateCardSet } from '../schemas';
import { ErrorType } from '../types';
import { CardRepositoryImpl } from '../repositories/card.repository';

/**
 * Card service class
 * Handles all card-related business logic
 */
export class CardService {
  private cardRepository: CardRepositoryImpl;

  constructor() {
    this.cardRepository = new CardRepositoryImpl();
  }

  /**
   * Fetches a card set by its code
   * @param setCode - The set code to fetch
   * @returns Result containing the card set or error
   */
  async getCardSet(setCode: string): Promise<Result<CardSet>> {
    try {
      const result = await this.cardRepository.findOne({ setCode });

      if (!result.success) {
        return result;
      }

      // Validate the data with Zod
      const validation = validateCardSet(result.data);

      if (!validation.success) {
        return {
          success: false,
          error: {
            type: ErrorType.VALIDATION_ERROR,
            message: 'Invalid card set data',
            details: { issues: validation.error.issues },
            timestamp: new Date(),
          },
        };
      }

      return {
        success: true,
        data: validation.data as CardSet,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Resolves card references and merges data
   * @param card - Card that might have a reference
   * @param allSets - All available card sets for reference resolution
   * @returns Resolved card with merged data
   */
  async resolveCardReference(card: Card, allSets: Map<string, CardSet>): Promise<Card> {
    if (!card.ref) {
      return card;
    }

    const referencedSet = allSets.get(card.ref.set);
    if (!referencedSet) {
      console.warn(`Referenced set ${card.ref.set} not found for card ${card.num}`);
      return card;
    }

    const referencedCard = referencedSet.cards.find((c) => c.num === card.ref?.num);
    if (!referencedCard) {
      console.warn(`Referenced card ${card.ref.num} not found in set ${card.ref.set}`);
      return card;
    }

    // Merge the referenced card data with the current card
    // Current card properties take precedence
    return {
      ...referencedCard,
      ...card,
      // Preserve the reference information
      ref: card.ref,
    };
  }

  /**
   * Groups cards by their type
   * @param cards - Array of cards to group
   * @returns Map of type code to cards
   */
  groupCardsByType(cards: Card[]): Map<string, Card[]> {
    const grouped = new Map<string, Card[]>();

    for (const card of cards) {
      if (!card.type) continue;

      const existing = grouped.get(card.type) ?? [];
      grouped.set(card.type, [...existing, card]);
    }

    return grouped;
  }

  /**
   * Filters cards based on search query
   * @param cards - Cards to filter
   * @param query - Search query
   * @returns Filtered cards
   */
  filterCards(cards: Card[], query: string): Card[] {
    if (!query.trim()) return cards;

    const lowerQuery = query.toLowerCase();

    return cards.filter((card) => {
      return (
        card.name?.toLowerCase().includes(lowerQuery) ||
        card.num.toLowerCase().includes(lowerQuery) ||
        card.type?.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Handles errors and converts them to ApiError format
   * @param error - Error to handle
   * @returns ApiError object
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN_ERROR,
        message: error.message,
        timestamp: new Date(),
      };
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: 'An unknown error occurred',
      timestamp: new Date(),
    };
  }
}

// Export singleton instance
export const cardService = new CardService();
