<script setup>
import { GetTypeByCode } from '~/classes/types';
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
const {data} = props;
</script>
<template>
    <div class="flex border-t border-b" :type="GetTypeByCode(data.type)?.code">
        <div class="p-8">
            <img v-if="data.img.jp != null && data.img.en == null" :src="'/PokeTCGHub/images/sets' + data.img.jp" class="max-h-[300px]"></img>
            <img v-if="data.img.en != null" :src="'/PokeTCGHub/images/sets' + data.img.en" class="max-h-[300px]"></img>
        </div>
        <div class="grow p-8 flex flex-col">
            <div v-if="data.ref?.from != null" class="italic text-sm">{{ data.ref.from }}</div>
            <div>
                <span>{{ data.num }}</span>: <span class="font-bold">{{ data.name }}</span> - <span>{{ GetTypeByCode(data.type)?.name }}</span>
                <span v-if="data.hp != null"> - {{ data.hp }} HP</span>
                <span v-if="data.subtype != null"> - {{ data.subtype }}</span>
            </div>
            <div v-if="data.trainer == null" class="pb-4">
                <span v-if="data.stage == 0">Basic Pokemon</span>
                <span v-if="data.stage > 0">Stage {{ data.stage }} Pokemon evolves from {{ data['evolve-from'] }}</span>
            </div>
            <div v-if="data.ability != null" class="pb-4">
                Ability: {{ data.ability.name }}<br/>
                {{ data.ability.desc }}
            </div>
            <div v-for="attack in data.attack" :key="attack.name" class="pb-2">
                [{{ attack.energy }}] {{ attack.name }} <span v-if="attack.damage != null">{{ attack.damage }}</span> <br v-if="attack.desc != null"/>
                {{ attack.desc }}
            </div>
            <div v-if="data.trainer" class="pt-4">
                <p class="pb-2" v-for="line in data.trainer">{{ line }}</p>
                <p class="pb-2" v-if="data.subtype == 'Supporter'">You may play only 1 Supporter card during your turn.</p>
                <p class="pb-2" v-if="data.subtype == 'Item'">You may play as many Item cards as you like during your turn.</p>
                <p class="pb-2" v-if="data.subtype == 'Pokemon Tool'">You may attach any number of Pokemon Tools to your Pokemon during your turn. You may attach only 1 Pokemon Tool to each Pokemon, and it stays attached.</p>
                <p class="pb-2" v-if="data.subtype == 'Stadium'"></p>
            </div>
            <div v-if="data.trainer == null" class="pt-2">Weakness: {{ GetTypeByCode(data.weak)?.name }}</div>
            <div v-if="data.trainer == null">Resistance: {{ GetTypeByCode(data.resist)?.name }}</div>
            <div v-if="data.trainer == null">Retreat: {{ data.retreat }}</div>
        </div>
    </div>
</template>