import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const setSchema = z.object({
  name: z.string(),
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
      schema: setSchema
    })
}

export default defineContentConfig({
  collections: {
    jp_m2a: newCollection('sets/jp/m2a/**.yaml'),
    jp_mc: newCollection('sets/jp/mc/**.yaml'),
    jp_mp1: newCollection('sets/jp/mp1/**.yaml'),
    jp_promo: newCollection('sets/jp/promo/**.yaml'),

    en_twm: newCollection('sets/en/twm/**.yaml'),
    en_pre: newCollection('sets/en/pre/**.yaml'),
    en_dri: newCollection('sets/en/dri/**.yaml'),
    en_blk: newCollection('sets/en/blk/**.yaml'),
    en_meg: newCollection('sets/en/meg/**.yaml'),
    en_pfl: newCollection('sets/en/pfl/**.yaml'),
    en_asc: newCollection('sets/en/asc/**.yaml'),
  }
})