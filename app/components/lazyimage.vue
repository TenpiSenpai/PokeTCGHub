<script lang="ts" setup>
interface Props {
    source: string
    className: string
    altText: string
}
const props = defineProps<Props>()
</script>

<template>
    <figure v-lazy-load>
        <img :class="props.className ?? ''" :data-url="props.source" :alt="props.altText" />
    </figure>
</template>
