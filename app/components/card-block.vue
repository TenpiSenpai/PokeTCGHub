<script lang="ts" setup>
import { GetTypeByCode } from '~/classes/types';
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
const {data} = props;
function replaceTypes(text: string) {
    if (text == null || text == undefined) return null;
    return text.replace(/\[+([^\][]+)]+/g, '<span class="font-ptcg">$1</span>');
}
function replaceNames(text: string) {
    if (text == null || text == undefined) return null;
    text = text.replace(/ ex/g, ' <span class="font-ptcg">e</span>');
    text = replaceTypes(text)!;
    return text;
}
</script>
<template>
    <div class="flex border-t border-b md:flex-row flex-col" :type="GetTypeByCode(data.type)?.code">
        <div class="md:p-8 p-4 pb-0 flex shrink-0">
            <Lazyimage v-if="data.img.jp != null && data.img.en == null" :source="'/PokeTCGHub/images/sets' + data.img.jp" class-name="md:h-[300px] md:w-[215px] h-150px w-[112px] rounded-[8px] md:rounded-[12px]" :alt-text="data.name"/>
            <Lazyimage v-if="data.img.en != null" :source="'/PokeTCGHub/images/sets' + data.img.en" class-name="md:h-[300px] md:w-[215px] h-[150px] w-[112px] rounded-[8px] md:rounded-[12px]" :alt-text="data.name"/>
        </div>
        <div class="grow md:p-8 p-4 flex flex-col">
            <div v-if="data.ref?.from != null" class="italic text-sm">{{ data.ref.from }}</div>
            <div>
                <span>{{ data.num }}</span>: <span class="font-bold" v-html="replaceNames(data.name)"></span> - <span><span class="font-ptcg" v-if="data.type != 'T' && data.type != 'E'">{{data.type}}</span> {{ GetTypeByCode(data.type)?.name }}</span>
                <span v-if="data.hp != null"> - {{ data.hp }} HP</span>
                <span v-if="data.subtype != null"> - {{ data.subtype }}</span>
            </div>
            <div v-if="data.trainer == null" class="pb-4">
                <span v-if="data.stage == 0">Basic Pokemon</span>
                <span v-if="data.stage > 0">Stage {{ data.stage }} Pokemon evolves from {{ data['evolve-from'] }}</span>
            </div>
            <div v-if="data.ability != null" class="pb-4">
                Ability: {{ data.ability.name }}<br/>
                <span v-html="replaceTypes(data.ability.desc)"></span>
            </div>
            <div v-for="attack in data.attack" :key="attack.name" class="pb-2">
                <span class="font-ptcg tracking-widest">[{{ attack.energy }}]</span> {{ attack.name }} <span v-if="attack.damage != null">{{ attack.damage }}</span> <br v-if="attack.desc != null"/>
                <span v-html="replaceTypes(attack.desc)"></span>
            </div>
            <div v-if="data.trainer" class="pt-4">
                <p class="pb-2" v-for="line in data.trainer" v-html="replaceTypes(line)"></p>
                <p class="pb-2" v-if="data.subtype == 'Supporter'">You may play only 1 Supporter card during your turn.</p>
                <p class="pb-2" v-if="data.subtype == 'Item'">You may play as many Item cards as you like during your turn.</p>
                <p class="pb-2" v-if="data.subtype == 'Pokemon Tool'">You may attach any number of Pokemon Tools to your Pokemon during your turn. You may attach only 1 Pokemon Tool to each Pokemon, and it stays attached.</p>
                <p class="pb-2" v-if="data.subtype == 'Stadium'">You may play only 1 Stadium card during your turn. Put it next to the Active Spot, and discard it if another Stadium comes into play. A Stadium with the same name can't be played.</p>
            </div>
            <div v-if="data.trainer == null" class="pt-2">Weakness: <span class="font-ptcg">{{data.weak}}</span> {{ GetTypeByCode(data.weak)?.name }}</div>
            <div v-if="data.trainer == null">Resistance: <span class="font-ptcg">{{data.resist}}</span> {{ GetTypeByCode(data.resist)?.name }}</div>
            <div v-if="data.trainer == null">Retreat: <span class="font-ptcg tracking-widest" v-for="i in data.retreat">C</span></div>
        </div>
    </div>
</template>