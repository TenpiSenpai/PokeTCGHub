import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const cardSchema = z.object({
  name: z.string(),
  num: z.string(),
  type: z.string(),
  subtype: z.string(),
  hp: z.number(),
  stage: z.number(),
  'evolve-from': z.string(),
  ability: z.object({
    name: z.string(),
    desc: z.string()
  }),
  attack: z.array(z.object({
    energy: z.string(),
    name: z.string(),
    damage: z.string(),
    desc: z.string()
  })),
  trainer: z.array(z.string()),
  weak: z.string(),
  resist: z.string(),
  retreat: z.number(),
  img: z.object({
    jp: z.string(),
    en: z.string()
  }),
  title: z.string(),
  ref: z.object({
    set: z.string(),
    num: z.string(),
    from: z.string()
  })
});

function newCollection(source: string) {
  return defineCollection({
      type: 'data',
      source: source,
      schema: z.object({
        set: z.string(),
        desc: z.string(),
        cards: z.array(cardSchema)
      })
    })
}

export default defineContentConfig({
  collections: {
    card_db: newCollection('sets/**/*.yaml'),
  }
})