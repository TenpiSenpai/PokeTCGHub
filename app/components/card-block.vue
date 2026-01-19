<script lang="ts" setup>
import { GetTypeByCode } from '~/classes/types'
import type { Card } from '~/utils/types'

interface Props {
    card: Card
}
const props = defineProps<Props>()
function replaceTypes(text: string) {
    if (text == null || text == undefined) return null
    return text.replace(/\[+([^\][]+)]+/g, '<span class="font-ptcg">$1</span>')
}
function replaceNames(text: string) {
    if (text == null || text == undefined) return null
    text = text.replace(/ ex/g, ' <span class="font-ptcg">e</span>')
    text = replaceTypes(text)!
    return text
}
</script>

<template>
    <div
        class="flex border-t border-b md:flex-row flex-col"
        :type="GetTypeByCode(props.card.type)?.code"
    >
        <div class="md:p-8 p-4 pb-0 flex shrink-0">
            <Lazyimage
                v-if="props.card.img.jp != null && props.card.img.en == null"
                :source="'/PokeTCGHub/images/sets' + props.card.img.jp"
                class-name="md:h-[300px] md:w-[215px] h-150px w-[112px] rounded-[8px] md:rounded-[12px]"
                :alt-text="props.card.name"
            />
            <Lazyimage
                v-if="props.card.img.en != null"
                :source="'/PokeTCGHub/images/sets' + props.card.img.en"
                class-name="md:h-[300px] md:w-[215px] h-[150px] w-[112px] rounded-[8px] md:rounded-[12px]"
                :alt-text="props.card.name"
            />
        </div>
        <div class="grow md:p-8 p-4 flex flex-col">
            <div v-if="props.card.ref?.from != null" class="italic text-sm">
                {{ props.card.ref.from }}
            </div>
            <div>
                <span>{{ props.card.num }}</span
                >: <span class="font-bold" v-html="replaceNames(props.card.name)" /> -
                <span
                    ><span
                        v-if="props.card.type != 'T' && props.card.type != 'E'"
                        class="font-ptcg"
                        >{{ props.card.type }}</span
                    >
                    {{ GetTypeByCode(props.card.type)?.name }}</span
                >
                <span v-if="props.card.hp != null"> - {{ props.card.hp }} HP</span>
                <span v-if="props.card.subtype != null"> - {{ props.card.subtype }}</span>
            </div>
            <div v-if="props.card.trainer == null" class="pb-4">
                <span v-if="props.card.stage == 0">Basic Pokemon</span>
                <span v-if="props.card.stage > 0"
                    >Stage {{ props.card.stage }} Pokemon evolves from
                    {{ props.card['evolve-from'] }}</span
                >
            </div>
            <div v-if="props.card.ability != null" class="pb-4">
                Ability: {{ props.card.ability.name }}<br />
                <span v-html="replaceTypes(props.card.ability.desc)" />
            </div>
            <div v-for="attack in props.card.attack" :key="attack.name" class="pb-2">
                <span class="font-ptcg tracking-widest">[{{ attack.energy }}]</span>
                {{ attack.name }} <span v-if="attack.damage != null">{{ attack.damage }}</span>
                <br v-if="attack.desc != null" />
                <span v-html="replaceTypes(attack.desc)" />
            </div>
            <div v-if="props.card.trainer" class="pt-4">
                <p
                    v-for="line in props.card.trainer"
                    :key="line"
                    class="pb-2"
                    v-html="replaceTypes(line)"
                />
                <p v-if="props.card.subtype == 'Supporter'" class="pb-2">
                    You may play only 1 Supporter card during your turn.
                </p>
                <p v-if="props.card.subtype == 'Item'" class="pb-2">
                    You may play as many Item cards as you like during your turn.
                </p>
                <p v-if="props.card.subtype == 'Pokemon Tool'" class="pb-2">
                    You may attach any number of Pokemon Tools to your Pokemon during your turn. You
                    may attach only 1 Pokemon Tool to each Pokemon, and it stays attached.
                </p>
                <p v-if="props.card.subtype == 'Stadium'" class="pb-2">
                    You may play only 1 Stadium card during your turn. Put it next to the Active
                    Spot, and discard it if another Stadium comes into play. A Stadium with the same
                    name can't be played.
                </p>
            </div>
            <div v-if="props.card.trainer == null" class="pt-2">
                Weakness: <span class="font-ptcg">{{ props.card.weak }}</span>
                {{ GetTypeByCode(props.card.weak)?.name }}
            </div>
            <div v-if="props.card.trainer == null">
                Resistance: <span class="font-ptcg">{{ props.card.resist }}</span>
                {{ GetTypeByCode(props.card.resist)?.name }}
            </div>
            <div v-if="props.card.trainer == null">
                Retreat:
                <span v-for="i in props.card.retreat" :key="i" class="font-ptcg tracking-widest"
                    >C</span
                >
            </div>
        </div>
    </div>
</template>
