<script lang="ts" setup>
import { Types,GetTypeByCode } from '../classes/types';
const props = defineProps({
    set: {
        type: String,
        required: true
    },
    excludeTypes: {
        type: Boolean,
        required: false,
        default: false
    }
})
const {set, excludeTypes} = props;

const {data} = await useAsyncData(set, () => {
  return queryCollection('card_db').where('set', '=', set).first()
})
if (data.value == null) {
    throw set + ' does not exist';
}
let setList: {set:string, cards: any[]}[] = [];
//set Linking
//This makes it so you only have to declare cards once and cn show them in several sets such as reprints or en/jp
for(let i = 0; i < data.value!.cards.length; i++) {
    const card = data.value!.cards[i]!;
    if (card.ref != null && card.ref.num != null) {
        let setFind = setList.find((x) => x.set == card.ref.set);
        if (setFind == null) {
            const {data: item} = await useAsyncData(card.ref.set, () => {
            return queryCollection('card_db')
                .where('set', '=', card.ref.set)
                .first()
            });
            if (item.value == null) {
                throw card.ref.set + ': does not exists.';
            }
            const newSet = {
                set: card.ref.set,
                cards: item.value.cards
            };
            setList.push(newSet);
            setFind = newSet;
        }
        
        let f = setFind.cards.find((item: any) => parseInt(item.num) == parseInt(card.ref.num));
        if (f == null) {
            throw card.ref.set + ':' + card.ref.num + ' does not exists.';
        }
        var found = { ...f }
        found.ref = card.ref;
        found.title = card.title;
        found.num = card.num;
        data.value!.cards[i] = found;
    }
}
const cards = data.value!.cards.sort((a, b) => {
    return GetTypeByCode(a.type).order - GetTypeByCode(b.type).order
});

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
    <div class="flex p-4 border-t" v-if="!excludeTypes">
        <a v-for="type in Types" class="p-4" :href="'#type-' + type.code">{{ type.name }}</a>
    </div>
    <template v-for="card in cards" :key="card.num">
        <div v-if="testLastType(card.type)" :id="'type-' + card.type"></div>
        <card-block :data="card"></card-block>
    </template>
</template>