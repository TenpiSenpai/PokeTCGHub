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
type t = keyof (Collections)
var s = set as t;

const {data} = await useAsyncData(set, () => {
  return queryCollection(s).all()
})
if (data.value?.length == null) {
    throw set + ' does not exist';
}
//set Linking
//This makes it so you only have to declare cards once and cn show them in several sets such as reprints or en/jp
for(let i = 0; i < data.value!.length; i++) {
    let r = data.value![i]!;
    if (r.ref != null) {
        type t2 = keyof (Collections)
        const s2 = r.ref.set as t2;
        const {data: item} = await useAsyncData(r.ref.set + r.ref.num, () => {
            return queryCollection(s2)
                .where('title', '=', r.ref.num)
                .first()
        })
        if (item!.value == null) {
            throw r.ref.set + ':' + r.ref.num + ' does not exists.';
        }
        item.value.ref = r.ref;
        item.value.title = r.title;
        data.value![i] = item!.value;
    }
}
// console.log(data.value);
const cards = data.value!.sort((a, b) => {
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