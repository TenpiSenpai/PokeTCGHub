import { defineStore } from "pinia";
import { GetTypeByCode } from "~/classes/types";
import type { Set } from "~/utils/types";

export const useCardStore = defineStore("CardStore", () => {
    const cardSets = ref<Map<string, Set>>(new Map());

    const getSet = async (setName: string): Promise<Set> => {
        const {data: setinfo} = await useAsyncData(setName.toString(), (): Promise<Set  | null> => {
            return queryCollection('card_db').where('set', '=', setName).first()
        });
        if (setinfo.value == null) {
            throw createError({status: 404, statusText: setName + ' does not exist'});
        }
        return setinfo.value;
    }

    const findSet = async(setName: string): Promise<Set> => {
        var s: Set | null = cardSets.value.get(setName) ?? null;
        if (s == null) {
            s = await getSet(setName);
            cardSets.value.set(setName, s);
        }
        return s;
    }

    const sortCards = (set: Set) => set.cards.sort((a, b) => {
        return (GetTypeByCode(a.type)?.order || 0) - (GetTypeByCode(b.type)?.order || 0)
    });

    const buildSet = async(setName: string): Promise<Set> => {
        const set = await findSet(setName);
        for(let i = 0; i < set.cards.length; i++) {
            const card = set.cards[i]!;
            if (card.ref != null && card.ref.num != null) {
                let setFind = await findSet(card.ref.set);
                
                let f = setFind.cards.find((item: any) => parseInt(item.num) == parseInt(card.ref.num));
                if (f == null) {
                    throw createError({ status: 404, statusText: card.ref.set + ':' + card.ref.num + ' does not exists.'});
                }
                var found = { ...f }
                found.ref = card.ref;
                found.title = card.title;
                found.num = card.num;
                set.cards[i] = found;
            }
        }
        set.cards = sortCards(set);
        return set;
    }

    return {
        findSet,
        buildSet
    }
});