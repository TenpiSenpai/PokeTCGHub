<script lang="ts" setup>
import { Types } from '../classes/types';
import { useCardStore } from '@/stores/cardStore';

const store = useCardStore();

interface Props {
    set: string,
    excludeTypes?: boolean
}
const { set: setName, excludeTypes = false } = defineProps<Props>();

const setinfo = await store.buildSet(setName);

let lastType:string | null = null;
function testLastType(code: string) {
    if (code != lastType) {
        lastType = code;
        return true;
    }
    return false;
}
</script>

<template>
    <div class="flex p-4 border-t flex-wrap" v-if="!excludeTypes">
        <a 
            v-for="type in Types"
            :key="type.code"
            class="px-4 py-0 basis-1/2 md:basis-1 whitespace-nowrap underline text-blue-600 hover:text-blue-800"
            :href="'#type-' + type.code"
            aria-label="Filter by card type"
        >
            <span class="font-ptcg" v-if="type.code != 'T' && type.code != 'E'">{{ type.code }}</span> {{ type.name }}
        </a>
    </div>
    <template v-for="card in setinfo.cards" :key="card.num">
        <div v-if="testLastType(card.type)" :id="'type-' + card.type"></div>
        <card-block :card="card"></card-block>
    </template>
</template>

