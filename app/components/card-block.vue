<script lang="ts" setup>
/**
 * Card Block Component - Refactored for Enterprise Architecture
 * Displays detailed information about a single Pokemon card
 * Uses sanitization to prevent XSS attacks
 */

import { computed } from 'vue';
import type { Card } from '../types';
import { useEnergyTypes } from '../composables/useEnergyTypes';
import { formatCardText, escapeHtml } from '../utils/sanitizer';

/**
 * Component props
 */
interface Props {
  card: Card;
}

const props = defineProps<Props>();

// Composables
const { getType } = useEnergyTypes();

// Computed properties
const cardType = computed(() => {
  if (!props.card.type) return null;
  return getType(props.card.type);
});

const imageSource = computed(() => {
  const baseUrl = '/PokeTCGHub/images/sets';
  if (props.card.img?.en) {
    return `${baseUrl}${props.card.img.en}`;
  }
  if (props.card.img?.jp) {
    return `${baseUrl}${props.card.img.jp}`;
  }
  return null;
});

const evolutionText = computed(() => {
  if (!props.card.stage) return null;
  if (props.card.stage === 0) return 'Basic Pokémon';
  return `Stage ${props.card.stage} Pokémon evolves from ${props.card['evolve-from'] ?? 'Unknown'}`;
});

const weaknessType = computed(() => {
  if (!props.card.weak) return null;
  return getType(props.card.weak);
});

const resistanceType = computed(() => {
  if (!props.card.resist) return null;
  return getType(props.card.resist);
});

const retreatCostArray = computed(() => {
  if (!props.card.retreat) return [];
  return Array(props.card.retreat).fill('C');
});

// Helper function to safely format card name (replaces "ex" with styled version)
function formatCardName(name: string | undefined): string {
  if (!name) return '';
  const escaped = escapeHtml(name);
  return escaped.replace(/ ex/g, ' <span class="font-ptcg">e</span>');
}

// Helper function to format ability/attack descriptions
function formatDescription(text: string | undefined): string {
  if (!text) return '';
  return formatCardText(text);
}

// Subtype helper text
const subtypeHelperText = computed(() => {
  switch (props.card.subtype) {
    case 'Supporter':
      return 'You may play only 1 Supporter card during your turn.';
    case 'Item':
      return 'You may play as many Item cards as you like during your turn.';
    case 'Pokémon Tool':
      return 'You may attach any number of Pokémon Tools to your Pokémon during your turn. You may attach only 1 Pokémon Tool to each Pokémon, and it stays attached.';
    case 'Stadium':
      return "You may play only 1 Stadium card during your turn. Put it next to the Active Spot, and discard it if another Stadium comes into play. A Stadium with the same name can't be played.";
    default:
      return null;
  }
});
</script>

<template>
  <article
    class="flex flex-col border-t border-b md:flex-row"
    :data-card-type="cardType?.code"
    :aria-label="`Card: ${card.name ?? 'Unknown'}`"
  >
    <!-- Card Image -->
    <div v-if="imageSource" class="flex shrink-0 p-4 pb-0 md:p-8">
      <lazyimage
        :source="imageSource"
        :alt-text="`${card.name} card image`"
        class-name="h-[150px] w-[112px] rounded-[8px] md:h-[300px] md:w-[215px] md:rounded-[12px]"
      />
    </div>

    <!-- Card Details -->
    <div class="flex grow flex-col p-4 md:p-8">
      <!-- Reference Info -->
      <p v-if="card.ref?.from" class="mb-2 text-sm italic text-gray-600">
        {{ card.ref.from }}
      </p>

      <!-- Card Header -->
      <header class="mb-2">
        <span class="font-semibold">{{ card.num }}</span>:
        <strong v-html="formatCardName(card.name)"></strong>
        -
        <span>
          <span v-if="card.type && card.type !== 'T' && card.type !== 'E'" class="font-ptcg">
            {{ card.type }}
          </span>
          {{ cardType?.name }}
        </span>
        <span v-if="card.hp"> - {{ card.hp }} HP</span>
        <span v-if="card.subtype"> - {{ card.subtype }}</span>
      </header>

      <!-- Evolution Info -->
      <p v-if="evolutionText && !card.trainer" class="mb-4 text-sm">
        {{ evolutionText }}
      </p>

      <!-- Ability -->
      <section v-if="card.ability" class="mb-4" aria-label="Ability">
        <strong>Ability:</strong> {{ card.ability.name }}<br />
        <span v-html="formatDescription(card.ability.desc)"></span>
      </section>

      <!-- Attacks -->
      <section v-if="card.attack?.length" aria-label="Attacks">
        <div v-for="(attack, index) in card.attack" :key="index" class="mb-2">
          <strong>
            <span class="font-ptcg tracking-widest">[{{ attack.energy }}]</span>
            {{ attack.name }}
            <span v-if="attack.damage">{{ attack.damage }}</span>
          </strong>
          <br v-if="attack.desc" />
          <span v-html="formatDescription(attack.desc)"></span>
        </div>
      </section>

      <!-- Trainer Card Text -->
      <section v-if="card.trainer?.length" class="pt-4" aria-label="Trainer card effect">
        <p v-for="(line, index) in card.trainer" :key="index" class="mb-2" v-html="formatDescription(line)"></p>
        <p v-if="subtypeHelperText" class="mb-2 text-sm text-gray-600">
          {{ subtypeHelperText }}
        </p>
      </section>

      <!-- Pokemon Stats (non-trainer cards) -->
      <footer v-if="!card.trainer" class="mt-auto pt-2">
        <div class="text-sm">
          <strong>Weakness:</strong>
          <span v-if="weaknessType">
            <span class="font-ptcg">{{ card.weak }}</span>
            {{ weaknessType.name }}
          </span>
          <span v-else>None</span>
        </div>
        <div class="text-sm">
          <strong>Resistance:</strong>
          <span v-if="resistanceType">
            <span class="font-ptcg">{{ card.resist }}</span>
            {{ resistanceType.name }}
          </span>
          <span v-else>None</span>
        </div>
        <div class="text-sm">
          <strong>Retreat:</strong>
          <span class="font-ptcg tracking-widest">
            <span v-for="(cost, index) in retreatCostArray" :key="index">{{ cost }}</span>
          </span>
          <span v-if="retreatCostArray.length === 0">0</span>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped>
/* Energy icon styling */
:deep(.energy-icon) {
  @apply inline-block font-ptcg;
}
</style>
