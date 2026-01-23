<script lang="ts" setup>
import type { Card } from '~/utils/types'
import { Types } from '../classes/types'
import { useCardStore } from '@/stores/cardStore'

const store = useCardStore()

interface Props {
    set: string
    excludeTypes?: boolean
}
const { set: setName, excludeTypes = false } = defineProps<Props>()

const setinfo = await store.buildSet(setName)
const hasAlts = setinfo.cards.findIndex((x) => x.alt) > -1
let lastType: string | null = null
function testLastType(c: Card) {
    if (c.alt && lastType != 'alt') {
        lastType = 'alt'
    }
    if (c.type != lastType) {
        lastType = c.type
        return true
    }
    return false
}
</script>

<template>
    <div v-if="!excludeTypes" class="flex p-4 border-t flex-wrap">
        <a
            v-for="type in Types"
            :key="type.code"
            class="px-4 py-0 basis-1/2 md:basis-1 whitespace-nowrap underline text-blue-600 hover:text-blue-800"
            :href="'#type-' + type.code"
            aria-label="Go to card type"
        >
            <span v-if="type.code != 'T' && type.code != 'E'" class="font-ptcg">{{
                type.code
            }}</span>
            {{ type.name }}
        </a>
        <a
            v-if="hasAlts"
            href="#type-alt"
            aria-label="Go to Secret Rares"
            class="px-4 py-0 basis-1/2 md:basis-1 whitespace-nowrap underline text-blue-600 hover:text-blue-800"
            >Secret Rares</a
        >
    </div>
    <template v-for="card in setinfo.cards" :key="card.num">
        <div v-if="testLastType(card) && !card.alt" :id="'type-' + card.type" />
        <div v-if="testLastType(card) && card.alt" id="type-alt" />
        <card-block :card="card" />
    </template>
</template>
