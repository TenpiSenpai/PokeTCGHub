/**
 * Card type definitions for PokeTCGHub
 * Enterprise-level type safety for Pokemon TCG card data
 */

/**
 * Energy type codes used in Pokemon TCG
 */
export enum EnergyTypeCode {
  GRASS = 'G',
  FIRE = 'R',
  WATER = 'W',
  LIGHTNING = 'L',
  PSYCHIC = 'P',
  FIGHTING = 'F',
  DARKNESS = 'D',
  METAL = 'M',
  DRAGON = 'N',
  COLORLESS = 'C',
  TRAINER = 'T',
  SPECIAL_ENERGY = 'E',
}

/**
 * Represents a Pokemon TCG energy type
 */
export interface EnergyType {
  readonly code: EnergyTypeCode;
  readonly name: string;
  readonly order: number;
}

/**
 * Pokemon card evolution stages
 */
export enum EvolutionStage {
  BASIC = 0,
  STAGE_1 = 1,
  STAGE_2 = 2,
  MEGA = 3,
}

/**
 * Card subtypes (primarily for trainer cards)
 */
export enum CardSubtype {
  SUPPORTER = 'Supporter',
  ITEM = 'Item',
  POKEMON_TOOL = 'Pokémon Tool',
  STADIUM = 'Stadium',
  ENERGY = 'Energy',
  BASIC_ENERGY = 'Basic Energy',
  SPECIAL_ENERGY = 'Special Energy',
}

/**
 * Represents a Pokemon ability
 */
export interface CardAbility {
  name: string;
  desc: string;
}

/**
 * Represents a Pokemon attack
 */
export interface CardAttack {
  energy: string; // Energy cost (e.g., "GCC" for 1 Grass + 2 Colorless)
  name: string;
  damage: string; // Can be empty, numeric, or with modifiers (e.g., "60+", "30x")
  desc: string;
}

/**
 * Image URLs for different locales
 */
export interface CardImages {
  en?: string;
  jp?: string;
}

/**
 * Reference to another card (used for reprints/linked cards)
 */
export interface CardReference {
  set: string; // Set code
  num: string; // Card number in the referenced set
  from: string; // Human-readable source description
}

/**
 * Complete Pokemon TCG card definition
 */
export interface Card {
  num: string; // Card number (e.g., "047")
  name?: string;
  type?: EnergyTypeCode;
  subtype?: string;
  hp?: number;
  stage?: EvolutionStage;
  'evolve-from'?: string;
  ability?: CardAbility;
  attack?: CardAttack[];
  trainer?: string[];
  weak?: EnergyTypeCode;
  resist?: EnergyTypeCode;
  retreat?: number;
  img?: CardImages;
  ref?: CardReference; // If this card is a reference to another set's card
}

/**
 * A complete card set
 */
export interface CardSet {
  set: string; // Set code (e.g., "en_por", "jp_m3")
  desc: string; // Set name (e.g., "Perfect Order", "Nihil Zero")
  cards: Card[];
}

/**
 * Locale types
 */
export enum Locale {
  EN = 'en',
  JP = 'jp',
}

/**
 * Set metadata
 */
export interface SetMetadata {
  code: string;
  name: string;
  locale: Locale;
  cardCount?: number;
}

/**
 * Type guard to check if a card has a reference to another card
 */
export function isCardReference(card: Card): card is Required<Pick<Card, 'ref'>> & Card {
  return card.ref !== undefined;
}

/**
 * Type guard to check if a card is a complete card definition
 */
export function isCompleteCard(card: Card): card is Required<Pick<Card, 'name' | 'type'>> & Card {
  return card.name !== undefined && card.type !== undefined;
}

/**
 * Type guard to check if a card has an ability
 */
export function hasAbility(card: Card): card is Required<Pick<Card, 'ability'>> & Card {
  return card.ability !== undefined;
}

/**
 * Type guard to check if a card has attacks
 */
export function hasAttacks(card: Card): card is Required<Pick<Card, 'attack'>> & Card {
  return card.attack !== undefined && card.attack.length > 0;
}
