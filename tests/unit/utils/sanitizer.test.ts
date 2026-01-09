/**
 * Unit tests for sanitizer utility
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHtml, escapeHtml, stripHtml, replaceEnergyTypes, formatCardText } from '../../../app/utils/sanitizer';

describe('Sanitizer', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';

      expect(escapeHtml(input)).toBe(expected);
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("It's")).toBe('It&#039;s');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove dangerous script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should allow safe tags', () => {
      const input = '<p><strong>Bold</strong> and <em>italic</em></p>';
      const result = sanitizeHtml(input);

      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
    });

    it('should remove event handlers', () => {
      const input = '<p onclick="alert()">Click me</p>';
      const result = sanitizeHtml(input);

      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });
  });

  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const expected = 'Hello world';

      expect(stripHtml(input)).toBe(expected);
    });

    it('should keep text content', () => {
      const input = '<div><span>Test</span></div>';

      expect(stripHtml(input)).toContain('Test');
    });
  });

  describe('replaceEnergyTypes', () => {
    it('should replace energy type codes with styled spans', () => {
      const input = 'Cost: [G][C][C]';
      const result = replaceEnergyTypes(input);

      expect(result).toContain('energy-icon');
      expect(result).toContain('[G]');
      expect(result).toContain('[C]');
    });

    it('should escape HTML before replacement', () => {
      const input = '<script>[G]</script>';
      const result = replaceEnergyTypes(input);

      expect(result).not.toContain('<script>');
      expect(result).toContain('[G]');
    });

    it('should handle empty string', () => {
      expect(replaceEnergyTypes('')).toBe('');
    });
  });

  describe('formatCardText', () => {
    it('should format text with energy types and line breaks', () => {
      const input = 'Attack [G][C]\nDoes 20 damage';
      const result = formatCardText(input);

      expect(result).toContain('[G]');
      expect(result).toContain('<br>');
    });

    it('should sanitize malicious content', () => {
      const input = '<script>alert("XSS")</script> [G]';
      const result = formatCardText(input);

      expect(result).not.toContain('<script>');
      expect(result).toContain('[G]');
    });

    it('should handle empty string', () => {
      expect(formatCardText('')).toBe('');
    });
  });
});
