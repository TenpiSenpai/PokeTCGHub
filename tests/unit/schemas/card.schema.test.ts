/**
 * Unit tests for card schema validation
 */

import { describe, it, expect } from 'vitest';
import { validateCard, validateCardSet } from '../../../app/schemas';
import { EnergyTypeCode, EvolutionStage } from '../../../app/types';

describe('Card Schema', () => {
  describe('validateCard', () => {
    it('should validate a complete card', () => {
      const card = {
        num: '001',
        name: 'Pikachu',
        type: EnergyTypeCode.LIGHTNING,
        hp: 60,
        stage: EvolutionStage.BASIC,
        weak: EnergyTypeCode.FIGHTING,
        resist: EnergyTypeCode.METAL,
        retreat: 1,
        attack: [
          {
            energy: 'LC',
            name: 'Thunder Shock',
            damage: '30',
            desc: 'Flip a coin. If tails, this attack does nothing.',
          },
        ],
      };

      const result = validateCard(card);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Pikachu');
        expect(result.data.type).toBe(EnergyTypeCode.LIGHTNING);
      }
    });

    it('should validate a card with reference', () => {
      const card = {
        num: '047',
        ref: {
          set: 'jp_m3',
          num: '046',
          from: 'From JP Nihil Zero',
        },
      };

      const result = validateCard(card);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ref).toBeDefined();
        expect(result.data.ref?.set).toBe('jp_m3');
      }
    });

    it('should fail validation for invalid data', () => {
      const invalidCard = {
        num: '', // Empty string should fail
        type: 'INVALID_TYPE',
      };

      const result = validateCard(invalidCard);

      expect(result.success).toBe(false);
    });

    it('should validate HP as positive number', () => {
      const card = {
        num: '001',
        name: 'Test',
        hp: -10, // Negative HP should fail
      };

      const result = validateCard(card);

      expect(result.success).toBe(false);
    });

    it('should validate retreat cost as non-negative', () => {
      const card = {
        num: '001',
        name: 'Test',
        retreat: -1, // Negative retreat should fail
      };

      const result = validateCard(card);

      expect(result.success).toBe(false);
    });
  });

  describe('validateCardSet', () => {
    it('should validate a complete card set', () => {
      const cardSet = {
        set: 'en_por',
        desc: 'Perfect Order',
        cards: [
          {
            num: '001',
            name: 'Pikachu',
            type: EnergyTypeCode.LIGHTNING,
          },
        ],
      };

      const result = validateCardSet(cardSet);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.set).toBe('en_por');
        expect(result.data.cards).toHaveLength(1);
      }
    });

    it('should fail validation for missing required fields', () => {
      const invalidSet = {
        set: '',
        desc: '',
        cards: [],
      };

      const result = validateCardSet(invalidSet);

      expect(result.success).toBe(false);
    });

    it('should validate all cards in the set', () => {
      const cardSet = {
        set: 'test_set',
        desc: 'Test Set',
        cards: [
          {
            num: '001',
            name: 'Valid Card',
          },
          {
            num: '', // Invalid card
          },
        ],
      };

      const result = validateCardSet(cardSet);

      expect(result.success).toBe(false);
    });
  });
});
