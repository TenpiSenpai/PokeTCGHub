<script lang="ts" setup>
/**
 * Card List Component - Refactored for Enterprise Architecture
 * Displays a list of cards from a specific set with type filtering
 */

import { computed, onMounted } from 'vue';
import type { Card } from '../types';
import { ENERGY_TYPES } from '../classes/types';
import { useCardSet } from '../composables/useCardSet';
import { useEnergyTypes } from '../composables/useEnergyTypes';
import { logger } from '../utils/logger';
import { formatErrorMessage } from '../utils/error-handler';

/**
 * Component props
 */
interface Props {
  set: string;
  excludeTypes?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  excludeTypes: false,
});

// Composables
const { cardSet, cards, loading, error, state, fetchCardSet, groupedCards } = useCardSet();
const { getType } = useEnergyTypes();

// Fetch card set on mount
onMounted(async () => {
  try {
    await fetchCardSet(props.set);
  } catch (err) {
    logger.error('Failed to fetch card set', err instanceof Error ? err : undefined, {
      set: props.set,
    });
  }
});

// Sort cards by type order
const sortedCards = computed(() => {
  if (!cards.value.length) return [];

  return [...cards.value].sort((a, b) => {
    const typeA = getType(a.type ?? '');
    const typeB = getType(b.type ?? '');

    if (!typeA || !typeB) return 0;
    return typeA.order - typeB.order;
  });
});

// Track last type for section headers
let lastType: string | null = null;

function shouldShowTypeHeader(card: Card): boolean {
  if (!card.type) return false;

  if (card.type !== lastType) {
    lastType = card.type;
    return true;
  }
  return false;
}

// Error message formatting
const errorMessage = computed(() => {
  if (!error.value) return '';
  return formatErrorMessage(error.value);
});
</script>

<template>
  <div class="card-list-container">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center p-8">
      <div class="text-center">
        <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">Loading cards...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg m-4" role="alert">
      <h3 class="text-red-800 font-semibold mb-2">Error Loading Cards</h3>
      <p class="text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Success State -->
    <template v-else-if="cardSet && sortedCards.length > 0">
      <!-- Type Navigation -->
      <nav v-if="!excludeTypes" class="flex flex-wrap gap-2 p-4 border-t" aria-label="Card type navigation">
        <a
          v-for="type in ENERGY_TYPES"
          :key="type.code"
          :href="`#type-${type.code}`"
          class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          :aria-label="`Jump to ${type.name} cards`"
        >
          <span v-if="type.code !== 'T' && type.code !== 'E'" class="font-ptcg mr-1">
            {{ type.code }}
          </span>
          {{ type.name }}
        </a>
      </nav>

      <!-- Card List -->
      <div class="card-list" role="list">
        <template v-for="card in sortedCards" :key="card.num">
          <!-- Type Section Header -->
          <div
            v-if="shouldShowTypeHeader(card)"
            :id="`type-${card.type}`"
            class="scroll-mt-20"
            role="separator"
          ></div>

          <!-- Card Block -->
          <card-block :card="card" role="listitem" />
        </template>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="p-8 text-center text-gray-500">
      <p>No cards found in this set.</p>
    </div>
  </div>
</template>

<style scoped>
.scroll-mt-20 {
  scroll-margin-top: 5rem;
}
</style>
