import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    jp_m2a: defineCollection({
      type: 'data',
      source: 'sets/jp/m2a/**.yaml',
      schema: z.object({
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
          num: z.string()
        })
      })
    }),
    en_m3: defineCollection({
      type: 'data',
      source: 'sets/en/m3/**.yaml',
      schema: z.object({
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
          damage: z.number(),
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
          num: z.string()
        })
      })
    })
  }
})