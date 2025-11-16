<script lang="ts" setup>
import { Types } from '../classes/types';
const props = defineProps({
    set: {
        type: String,
        required: true
    }
})
const {set} = props;
type t = keyof (Collections)
var s = set as t;

const {data} = await useAsyncData(set, () => {
  return queryCollection(s).all()
})
const cards = data.value;
</script>

<template>
    <div class="flex">
        <div v-for="type in Types">{{ type }}</div>
    </div>
    <card-block v-for="card in cards" :data="card"></card-block>
</template>