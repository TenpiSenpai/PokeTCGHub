/**
 * Zod validation schemas for card data
 * Provides runtime type safety and data validation
 */

import { z } from 'zod';
import { EnergyTypeCode, EvolutionStage } from '../types';

/**
 * Energy type code schema
 */
export const energyTypeCodeSchema = z.nativeEnum(EnergyTypeCode);

/**
 * Evolution stage schema
 */
export const evolutionStageSchema = z.nativeEnum(EvolutionStage);

/**
 * Card ability schema
 */
export const cardAbilitySchema = z.object({
  name: z.string().min(1, 'Ability name is required'),
  desc: z.string().min(1, 'Ability description is required'),
});

/**
 * Card attack schema
 */
export const cardAttackSchema = z.object({
  energy: z.string().min(1, 'Energy cost is required'),
  name: z.string().min(1, 'Attack name is required'),
  damage: z.string().default(''),
  desc: z.string().default(''),
});

/**
 * Card images schema
 */
export const cardImagesSchema = z.object({
  en: z.string().url().optional(),
  jp: z.string().url().optional(),
});

/**
 * Card reference schema
 */
export const cardReferenceSchema = z.object({
  set: z.string().min(1, 'Set code is required'),
  num: z.string().min(1, 'Card number is required'),
  from: z.string().min(1, 'Source description is required'),
});

/**
 * Card schema
 */
export const cardSchema = z.object({
  num: z.string().min(1, 'Card number is required'),
  name: z.string().optional(),
  type: energyTypeCodeSchema.optional(),
  subtype: z.string().optional(),
  hp: z.number().int().positive().optional(),
  stage: evolutionStageSchema.optional(),
  'evolve-from': z.string().optional(),
  ability: cardAbilitySchema.optional(),
  attack: z.array(cardAttackSchema).optional(),
  trainer: z.array(z.string()).optional(),
  weak: energyTypeCodeSchema.optional(),
  resist: energyTypeCodeSchema.optional(),
  retreat: z.number().int().nonnegative().optional(),
  img: cardImagesSchema.optional(),
  ref: cardReferenceSchema.optional(),
});

/**
 * Card set schema
 */
export const cardSetSchema = z.object({
  set: z.string().min(1, 'Set code is required'),
  desc: z.string().min(1, 'Set description is required'),
  cards: z.array(cardSchema),
});

/**
 * Validates a card object and returns typed result
 */
export function validateCard(data: unknown): z.SafeParseReturnType<unknown, z.infer<typeof cardSchema>> {
  return cardSchema.safeParse(data);
}

/**
 * Validates a card set and returns typed result
 */
export function validateCardSet(data: unknown): z.SafeParseReturnType<unknown, z.infer<typeof cardSetSchema>> {
  return cardSetSchema.safeParse(data);
}

/**
 * Validates an array of cards
 */
export function validateCards(data: unknown): z.SafeParseReturnType<unknown, z.infer<typeof cardSchema>[]> {
  return z.array(cardSchema).safeParse(data);
}

// Export inferred types from schemas
export type CardSchemaType = z.infer<typeof cardSchema>;
export type CardSetSchemaType = z.infer<typeof cardSetSchema>;
export type CardAbilitySchemaType = z.infer<typeof cardAbilitySchema>;
export type CardAttackSchemaType = z.infer<typeof cardAttackSchema>;
