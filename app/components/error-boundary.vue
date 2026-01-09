<script lang="ts" setup>
/**
 * Error Boundary Component
 * Catches and displays errors from child components
 */

import { ref, onErrorCaptured } from 'vue';
import type { ApiError } from '../types';
import { handleUnknownError } from '../utils/error-handler';
import { logger } from '../utils/logger';

interface Props {
  fallback?: string;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'An error occurred',
  showDetails: false,
});

const emit = defineEmits<{
  error: [error: ApiError];
}>();

const error = ref<ApiError | null>(null);
const hasError = ref(false);

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  hasError.value = true;
  error.value = handleUnknownError(err, `Component error: ${info}`);

  logger.error('Error boundary caught error', err instanceof Error ? err : undefined, {
    component: instance?.$options?.name ?? 'Unknown',
    info,
  });

  emit('error', error.value);

  // Prevent error from propagating further
  return false;
});

function retry(): void {
  hasError.value = false;
  error.value = null;
}
</script>

<template>
  <div v-if="hasError" class="error-boundary p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-lg font-medium text-red-800">{{ fallback }}</h3>
        <div v-if="error" class="mt-2 text-sm text-red-700">
          <p>{{ error.message }}</p>
          <p v-if="showDetails && error.details" class="mt-2 text-xs font-mono bg-red-100 p-2 rounded">
            {{ JSON.stringify(error.details, null, 2) }}
          </p>
        </div>
        <div class="mt-4">
          <button
            @click="retry"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.error-boundary {
  margin: 1rem 0;
}
</style>
