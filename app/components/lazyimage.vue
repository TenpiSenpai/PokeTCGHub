<script lang="ts" setup>
/**
 * Lazy Image Component - Refactored for Enterprise Architecture
 * Implements lazy loading for images with proper error handling
 */

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { logger } from '../utils/logger';

/**
 * Component props
 */
interface Props {
  source: string;
  altText: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  loading: 'lazy',
});

const imageRef = ref<HTMLImageElement | null>(null);
const hasError = ref(false);
const isLoaded = ref(false);

/**
 * Handle image load success
 */
function handleLoad(): void {
  isLoaded.value = true;
  logger.debug('Image loaded successfully', { source: props.source });
}

/**
 * Handle image load error
 */
function handleError(event: Event): void {
  hasError.value = true;
  logger.warn('Failed to load image', {
    source: props.source,
    alt: props.altText,
  });
}

onMounted(() => {
  if (imageRef.value && props.loading === 'lazy') {
    // Native lazy loading is supported in modern browsers
    // The v-lazy-load directive from plugins will handle intersection observer
  }
});
</script>

<template>
  <figure v-lazy-load class="relative">
    <img
      ref="imageRef"
      :class="[
        className,
        { 'opacity-0': !isLoaded, 'opacity-100': isLoaded },
        'transition-opacity duration-300',
      ]"
      :data-url="source"
      :alt="altText"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Loading placeholder -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
      aria-hidden="true"
    >
      <svg
        class="h-8 w-8 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>

    <!-- Error placeholder -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm"
      role="alert"
      aria-live="polite"
    >
      <span>Failed to load image</span>
    </div>
  </figure>
</template>

<style scoped>
figure {
  position: relative;
  display: inline-block;
}
</style>
