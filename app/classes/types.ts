/**
 * Legacy compatibility layer for card types
 * @deprecated Use app/types/card.types.ts instead
 * This file is maintained for backwards compatibility during migration
 */

import { EnergyTypeCode, type EnergyType } from '../types';

/**
 * Energy types with their display information
 */
export const ENERGY_TYPES: ReadonlyArray<EnergyType> = [
  { code: EnergyTypeCode.GRASS, name: 'Grass', order: 0 },
  { code: EnergyTypeCode.FIRE, name: 'Fire', order: 1 },
  { code: EnergyTypeCode.WATER, name: 'Water', order: 2 },
  { code: EnergyTypeCode.LIGHTNING, name: 'Lightning', order: 3 },
  { code: EnergyTypeCode.PSYCHIC, name: 'Psychic', order: 4 },
  { code: EnergyTypeCode.FIGHTING, name: 'Fighting', order: 5 },
  { code: EnergyTypeCode.DARKNESS, name: 'Darkness', order: 6 },
  { code: EnergyTypeCode.METAL, name: 'Metal', order: 7 },
  { code: EnergyTypeCode.DRAGON, name: 'Dragon', order: 8 },
  { code: EnergyTypeCode.COLORLESS, name: 'Colorless', order: 9 },
  { code: EnergyTypeCode.TRAINER, name: 'Trainer', order: 10 },
  { code: EnergyTypeCode.SPECIAL_ENERGY, name: 'Special Energy', order: 11 },
] as const;

/**
 * Gets energy type information by code
 * @param code - Energy type code
 * @returns Energy type information or undefined if not found
 */
export function getTypeByCode(code: string): EnergyType | undefined {
  return ENERGY_TYPES.find((type) => type.code === code);
}

/**
 * Validates if a string is a valid energy type code
 * @param code - String to validate
 * @returns True if valid energy type code
 */
export function isValidEnergyTypeCode(code: string): code is EnergyTypeCode {
  return Object.values(EnergyTypeCode).includes(code as EnergyTypeCode);
}

/**
 * Legacy export - CardType class
 * @deprecated Use EnergyType interface from app/types instead
 */
export class CardType implements EnergyType {
  public readonly code: EnergyTypeCode;
  public readonly name: string;
  public readonly order: number;

  constructor(code: EnergyTypeCode, name: string, order: number) {
    this.code = code;
    this.name = name;
    this.order = order;
  }
}

/**
 * Legacy export - Types array
 * @deprecated Use ENERGY_TYPES constant instead
 */
export const Types = ENERGY_TYPES;

/**
 * Legacy export - GetTypeByCode function
 * @deprecated Use getTypeByCode instead (lowercase)
 */
export const GetTypeByCode = getTypeByCode;
