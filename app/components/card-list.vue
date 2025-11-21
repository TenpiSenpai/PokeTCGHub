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
//set Linking
//This makes it so you only have to declare cards once and cn show them in several sets such as reprints or en/jp
for(let i = 0; i < data.value!.cards.length; i++) {
    let r = data.value!.cards[i]!;
    if (r.ref != null) {
        const {data: item} = await useAsyncData(r.ref.set, () => {
            return queryCollection('card_db')
                .where('set', '=', r.ref.set)
                .first()
        })
        if (item.value == null) {
            throw r.ref.set + ': does not exists.';
        }
        let f = item.value.cards.find((item: any) => item.num == r.ref.num);
        if (f == null) {
            throw r.ref.set + ':' + r.ref.num + ' does not exists.';
        }
        f.ref = r.ref;
        f.title = r.title;
        f.num = r.num;
        data.value!.cards[i] = f;
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
    <template v-for="card in cards">
        <div v-if="testLastType(card.type)" :id="'type-' + card.type"></div>
        <card-block :data="card"></card-block>
    </template>
</template>