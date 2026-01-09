/**
 * Composable for energy type operations
 * Provides energy type utilities and formatting
 */

import { computed, type ComputedRef } from 'vue';
import { ENERGY_TYPES, getTypeByCode } from '../classes/types';
import type { EnergyType, EnergyTypeCode } from '../types';

export interface UseEnergyTypesReturn {
  energyTypes: ComputedRef<readonly EnergyType[]>;
  getType: (code: string) => EnergyType | undefined;
  formatEnergyString: (energyString: string) => string;
  getTypeColor: (code: string) => string;
  getTypeIcon: (code: string) => string;
}

/**
 * Color mapping for energy types
 */
const TYPE_COLORS: Record<string, string> = {
  G: 'bg-green-500',
  R: 'bg-red-500',
  W: 'bg-blue-500',
  L: 'bg-yellow-500',
  P: 'bg-purple-500',
  F: 'bg-orange-500',
  D: 'bg-gray-800',
  M: 'bg-gray-400',
  N: 'bg-gradient-to-r from-blue-500 to-red-500',
  C: 'bg-gray-300',
  T: 'bg-indigo-500',
  E: 'bg-pink-500',
};

/**
 * Composable for energy type operations
 * @returns Energy type utilities
 */
export function useEnergyTypes(): UseEnergyTypesReturn {
  const energyTypes = computed(() => ENERGY_TYPES);

  /**
   * Gets energy type by code
   */
  const getType = (code: string): EnergyType | undefined => {
    return getTypeByCode(code);
  };

  /**
   * Formats an energy string (e.g., "GCC" -> "Grass Colorless Colorless")
   */
  const formatEnergyString = (energyString: string): string => {
    return energyString
      .split('')
      .map((code) => getTypeByCode(code)?.name ?? code)
      .join(' ');
  };

  /**
   * Gets Tailwind color class for energy type
   */
  const getTypeColor = (code: string): string => {
    return TYPE_COLORS[code] ?? 'bg-gray-500';
  };

  /**
   * Gets icon representation for energy type
   */
  const getTypeIcon = (code: string): string => {
    return `[${code}]`;
  };

  return {
    energyTypes,
    getType,
    formatEnergyString,
    getTypeColor,
    getTypeIcon,
  };
}
