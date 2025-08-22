// colorUtils.js
// General utilities for colors, contrast, and debounce

/**
 * Convert RGB values to relative luminance
 * @param {{r:number,g:number,b:number}} rgb 
 * @returns {number}
 */
export const getLuminance = ({ r, g, b }) => {
  [r, g, b] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two RGB colors
 * @param {{r,g,b}} color1 
 * @param {{r,g,b}} color2 
 * @returns {number} contrast ratio
 */
export const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Generate SVG icon representing contrast level
 * @param {number} ratio
 * @returns {string} SVG string
 */
export const getContrastIcon = (ratio) => {
  const neutral = "#757575";
  const base = `<circle cx="12" cy="12" r="10" stroke="${neutral}" stroke-width="2" fill="none"/>`;

  if (ratio >= 7) return `<svg width="24" height="24" viewBox="0 0 24 24">${base}<path d="M8 12.333L10.462 15L16 9" stroke="${neutral}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (ratio >= 4.5) return `<svg width="24" height="24" viewBox="0 0 24 24">${base}<path d="M9 12L11 14L15 10" stroke="${neutral}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (ratio >= 3) return `<svg width="24" height="24" viewBox="0 0 24 24">${base}<line x1="8" y1="12" x2="16" y2="12" stroke="${neutral}" stroke-width="2" stroke-linecap="round"/></svg>`;
  return `<svg width="24" height="24" viewBox="0 0 24 24">${base}<path d="M15 9L9 15M9 9L15 15" stroke="${neutral}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

/**
 * Debounce function
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
