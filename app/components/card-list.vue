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
    function gotoType(code: string) {
        console.log(code);
        console.log(document.querySelectorAll(`[type="${code}"]`))
        // window.location = '#type-' + code;
    }
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
    <div class="flex p-4 border-t">
        <a v-for="type in Types" class="p-4" :href="'#type-' + type.code">{{ type.name }}</a>
    </div>
    <template v-for="card in cards">
        <div v-if="testLastType(card.type)" :id="'type-' + card.type"></div>
        <card-block :data="card"></card-block>
    </template>
</template>

<script lang="ts">
</script>