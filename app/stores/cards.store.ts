/**
 * Pinia store for card data management
 * Provides centralized state management for cards and card sets
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Card, CardSet, ApiError } from '../types';
import { cardService } from '../services/card.service';

export const useCardsStore = defineStore('cards', () => {
  // State
  const cardSets = ref<Map<string, CardSet>>(new Map());
  const currentSetCode = ref<string | null>(null);
  const loading = ref<Map<string, boolean>>(new Map());
  const errors = ref<Map<string, ApiError>>(new Map());

  // Getters
  const currentCardSet = computed(() => {
    if (!currentSetCode.value) return null;
    return cardSets.value.get(currentSetCode.value) ?? null;
  });

  const currentCards = computed(() => {
    return currentCardSet.value?.cards ?? [];
  });

  const isLoading = computed(() => {
    if (!currentSetCode.value) return false;
    return loading.value.get(currentSetCode.value) ?? false;
  });

  const currentError = computed(() => {
    if (!currentSetCode.value) return null;
    return errors.value.get(currentSetCode.value) ?? null;
  });

  const groupedCards = computed(() => {
    if (!currentCardSet.value) return new Map();
    return cardService.groupCardsByType(currentCards.value);
  });

  // Actions
  async function fetchCardSet(setCode: string): Promise<void> {
    // Check cache first
    if (cardSets.value.has(setCode)) {
      currentSetCode.value = setCode;
      return;
    }

    loading.value.set(setCode, true);
    errors.value.delete(setCode);

    try {
      const result = await cardService.getCardSet(setCode);

      if (!result.success) {
        errors.value.set(setCode, result.error);
        return;
      }

      cardSets.value.set(setCode, result.data);
      currentSetCode.value = setCode;
    } finally {
      loading.value.set(setCode, false);
    }
  }

  function setCurrentSet(setCode: string): void {
    if (cardSets.value.has(setCode)) {
      currentSetCode.value = setCode;
    }
  }

  function clearCache(): void {
    cardSets.value.clear();
    loading.value.clear();
    errors.value.clear();
    currentSetCode.value = null;
  }

  function clearError(setCode: string): void {
    errors.value.delete(setCode);
  }

  return {
    // State
    cardSets,
    currentSetCode,
    loading,
    errors,
    // Getters
    currentCardSet,
    currentCards,
    isLoading,
    currentError,
    groupedCards,
    // Actions
    fetchCardSet,
    setCurrentSet,
    clearCache,
    clearError,
  };
});
