import { defineCollection, defineContentConfig } from '@nuxt/content'
import z from 'zod';

const cardSchema = z.strictObject({
  name: z.string(),
  num: z.string(),
  type: z.string(),
  subtype: z.string(),
  hp: z.number(),
  stage: z.number(),
  'evolve-from': z.string(),
  ability: z.strictObject({
    name: z.string(),
    desc: z.string()
  }),
  attack: z.array(z.strictObject({
    energy: z.string(),
    name: z.string(),
    damage: z.string(),
    desc: z.string()
  })),
  trainer: z.array(z.string()),
  weak: z.string(),
  resist: z.string(),
  retreat: z.number(),
  img: z.strictObject({
    jp: z.string(),
    en: z.string()
  }),
  title: z.string(),
  ref: z.strictObject({
    set: z.string(),
    num: z.string(),
    from: z.string()
  })
});

export const setSchema = z.strictObject({
  set: z.string(),
  desc: z.string(),
  cards: z.array(cardSchema)
});

function newCollection(source: string) {
  return defineCollection({
      type: 'data',
      source: source,
      schema: setSchema
    })
}

export default defineContentConfig({
  collections: {
    card_db: newCollection('sets/**/*.yaml'),
  }
})
