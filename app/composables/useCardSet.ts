/**
 * Composable for card set operations
 * Provides reactive card set data and operations
 */

import { ref, computed, type Ref } from 'vue';
import type { Card, CardSet, ApiError } from '../types';
import { LoadingState } from '../types';
import { cardService } from '../services/card.service';

export interface UseCardSetReturn {
  cardSet: Ref<CardSet | null>;
  cards: Ref<Card[]>;
  loading: Ref<boolean>;
  error: Ref<ApiError | null>;
  state: Ref<LoadingState>;
  fetchCardSet: (setCode: string) => Promise<void>;
  groupedCards: Ref<Map<string, Card[]>>;
  filterCards: (query: string) => Card[];
}

/**
 * Composable for managing card set data
 * @param setCode - Optional initial set code to load
 * @returns Card set state and operations
 */
export function useCardSet(setCode?: string): UseCardSetReturn {
  const cardSet = ref<CardSet | null>(null);
  const cards = ref<Card[]>([]);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);
  const state = ref<LoadingState>(LoadingState.IDLE);

  /**
   * Fetches a card set by code
   */
  const fetchCardSet = async (code: string): Promise<void> => {
    loading.value = true;
    state.value = LoadingState.LOADING;
    error.value = null;

    try {
      const result = await cardService.getCardSet(code);

      if (!result.success) {
        error.value = result.error;
        state.value = LoadingState.ERROR;
        cardSet.value = null;
        cards.value = [];
        return;
      }

      cardSet.value = result.data;
      cards.value = result.data.cards;
      state.value = LoadingState.SUCCESS;
    } catch (err) {
      error.value = {
        type: 'UNKNOWN_ERROR' as const,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        timestamp: new Date(),
      };
      state.value = LoadingState.ERROR;
      cardSet.value = null;
      cards.value = [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Computed property for grouped cards by type
   */
  const groupedCards = computed(() => {
    if (!cardSet.value) return new Map();
    return cardService.groupCardsByType(cards.value);
  });

  /**
   * Filters cards based on query
   */
  const filterCards = (query: string): Card[] => {
    return cardService.filterCards(cards.value, query);
  };

  // Auto-fetch if setCode provided
  if (setCode) {
    fetchCardSet(setCode);
  }

  return {
    cardSet,
    cards,
    loading,
    error,
    state,
    fetchCardSet,
    groupedCards,
    filterCards,
  };
}
