/**
 * HTML sanitization utilities
 * Prevents XSS attacks by sanitizing HTML content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitization configuration
 */
const SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
};

/**
 * Sanitizes HTML content to prevent XSS
 * @param html - HTML string to sanitize
 * @param config - Optional custom configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string, config?: DOMPurify.Config): string {
  const finalConfig = config ?? SANITIZE_CONFIG;
  return DOMPurify.sanitize(html, finalConfig);
}

/**
 * Escapes HTML special characters
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}

/**
 * Strips all HTML tags from a string
 * @param html - HTML string
 * @returns Plain text
 */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Safely replaces energy type codes with styled spans
 * This is a safe alternative to v-html for card descriptions
 * @param text - Text containing energy type codes in brackets (e.g., [G], [R])
 * @returns Sanitized HTML string
 */
export function replaceEnergyTypes(text: string): string {
  if (!text) return '';

  const escaped = escapeHtml(text);

  // Replace energy type codes with safe HTML
  return escaped.replace(/\[([GRWLPFDMNCT])\]/g, (match, code) => {
    return `<span class="energy-icon energy-${code.toLowerCase()}">[${code}]</span>`;
  });
}

/**
 * Safely formats card text with energy types and preserves line breaks
 * @param text - Card description text
 * @returns Sanitized and formatted HTML
 */
export function formatCardText(text: string): string {
  if (!text) return '';

  // Escape HTML first
  let formatted = escapeHtml(text);

  // Replace energy types
  formatted = formatted.replace(/\[([GRWLPFDMNCT])\]/g, (match, code) => {
    return `<span class="energy-icon energy-${code.toLowerCase()}">[${code}]</span>`;
  });

  // Preserve line breaks
  formatted = formatted.replace(/\n/g, '<br>');

  // Final sanitization pass (should be a no-op now, but safety first)
  return sanitizeHtml(formatted, {
    ALLOWED_TAGS: ['span', 'br'],
    ALLOWED_ATTR: ['class'],
  });
}
