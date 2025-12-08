<script lang="ts" setup>
const props = defineProps({
    source: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: false
    },
    altText: {
      type: String,
      required: true
    }
})
</script>
<template>
  <figure v-lazy-load>
    <img
      :class="(className ?? '')"
      :data-url="source"
      :alt="altText"
    >
  </figure>
</template>