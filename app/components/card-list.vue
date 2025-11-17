<script lang="ts" setup>
import { Types,GetTypeByCode } from '../classes/types';
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
const cards = data.value!.sort((a, b) => {
    return GetTypeByCode(a.type).order - GetTypeByCode(b.type).order
});
</script>

<template>
    <div class="flex">
        <div v-for="type in Types" class="p-4">{{ type.name }}</div>
    </div>
    <card-block v-for="card in cards" :data="card"></card-block>
</template>