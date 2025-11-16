<script setup>
import { Types } from '~/classes/types';
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
const {data} = props;
</script>
<template>
    <div class="flex">
        <div>
            <div>
                <span class="font-bold">{{ data.name }}</span> - <span>{{ Types[data.type] }}</span><span v-if="data.hp != null"> - {{ data.hp }} HP</span>
            </div>
            <div>
                <span v-if="data.stage == 0">Basic Pokemon</span>
                <span v-if="data.stage > 0">Stage {{ data.stage }} Pokemon evolves from {{ data['evolve-from'] }}</span>
            </div>
            <div v-if="data.ability != null">
                Ability: {{ data.ability.name }}<br/>
                {{ data.ability.desc }}
            </div>
            <div v-for="attack in data.attack" :key="attack.name">
                [{{ attack.energy }}] {{ attack.name }} <span v-if="attack.damage > 0">{{ attack.damage }}</span> <br v-if="attack.desc != null"/>
                {{ attack.desc }}
            </div>
            <div>Weakness: {{ data.weak }}</div>
            <div>Resistance: {{ data.resist }}</div>
            <div>Retreat: {{ data.retreat }}</div>
        </div>
        <div>
            <img :src="'/imgs/sets' + data.img.jp" class="max-h-[300px]"></img>
        </div>
    </div>
</template>