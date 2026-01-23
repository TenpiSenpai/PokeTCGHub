import type { Collections } from '@nuxt/content'

interface Set {
    set: string
    desc: string
    cards: Card[]
}
interface Card {
    name: string
    alt: string
    num: string
    rarity: string
    type: string
    subtype: string
    hp: number
    stage: number
    'evolve-from': string
    ability: CardAbility
    attack: CardAttack[]
    trainer: string[]
    weak: string
    resist: string
    retreat: number
    img: CardImage
    title: string
    ref: CardRef
}
interface CardAbility {
    name: string
    desc: string
}
interface CardAttack {
    energy: string
    name: string
    damage: string
    desc: string
}
interface CardImage {
    jp: string
    en: string
}
interface CardRef {
    set: string
    num: string
    from: string
}

export {
    type Collections,
    type Set,
    type Card,
    type CardAbility,
    type CardAttack,
    type CardImage,
    type CardRef
}
