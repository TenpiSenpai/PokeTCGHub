import { defineStore } from 'pinia'
import type { Card, Set } from '~/utils/types'

export const useCardStore = defineStore('CardStore', () => {
    const cardSets = ref<Map<string, Set>>(new Map())

    const getSet = async (setName: string): Promise<Set> => {
        const { data: setinfo } = await useAsyncData(
            setName.toString(),
            (): Promise<Set | null> => {
                return queryCollection('card_db').where('set', '=', setName).first()
            }
        )
        if (setinfo.value == null) {
            throw createError({ status: 404, statusText: setName + ' does not exist.' })
        }
        return setinfo.value
    }

    const findSet = async (setName: string): Promise<Set> => {
        let s: Set | null = cardSets.value.get(setName) ?? null
        if (s == null) {
            s = await getSet(setName)
            cardSets.value.set(setName, s)
        }
        return s
    }

    const sortCards = (set: Set) =>
        set.cards.sort((a, b) => {
            return (+a.num || 0) - (+b.num || 0)
        })

    const findCard = async (set: string, num: string): Promise<Card> => {
        const setFind = await findSet(set)

        const f = setFind.cards.find((item: Card) => parseInt(item.num) == parseInt(num))
        if (f == null || f == undefined) {
            throw createError({ status: 404, statusText: set + ':' + num + ' does not exist.' })
        }
        return f
    }

    const buildSet = async (setName: string): Promise<Set> => {
        if (!setName)
            throw createError({ status: 500, statusText: 'Parameter setName must be defined.' })
        const set = await findSet(setName)
        for (let i = 0; i < set.cards.length; i++) {
            const card = set.cards[i]!
            if (card.ref != null && card.ref.num != null) {
                if (!card.ref.set && card.ref.num) card.ref.set = set.set
                let f = await findCard(card.ref.set, card.ref.num)
                let found = { ...f }
                if (f.img && f.ref && f.ref.num) {
                    if (!f.ref.set) f.ref.set = card.ref.set
                    f = await findCard(f.ref.set, f.ref.num)
                    f.img = found.img
                    found = { ...f }
                } else if (f.ref && f.ref.set) {
                    f = await findCard(f.ref.set, f.ref.num)
                    found = { ...f }
                }
                found.ref = card.ref
                found.title = card.title
                found.num = card.num
                found.alt = card.alt
                if (card.img) {
                    found.img = card.img
                }
                set.cards[i] = found
            }
        }
        set.cards = sortCards(set)
        console.log(set)
        return set
    }

    return {
        findSet,
        buildSet
    }
})
