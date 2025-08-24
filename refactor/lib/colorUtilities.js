// color-utils.js

/** -----------------------
 *  Helper Functions
 * ----------------------- **/

/**
 * Clamp a value between min and max
 */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Parse a hex string into RGB
 */
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length !== 6) throw new Error("Invalid HEX color");
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

/**
 * Debounce a function
 */
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/** -----------------------
 *  Color Conversions
 * ----------------------- **/

// RGB → HEX
const rgbToHex = (r, g, b) =>
  `#${[r, g, b].map(c => clamp(Math.round(c), 0, 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()).join('')}`;

// HEX → RGB (returns {r,g,b})
// Already implemented above: hexToRgb()

// RGB → HSL
const rgbToHsl = ({ r, g, b }) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// HSL → RGB
const hslToRgb = ({ h, s, l }) => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r=0,g=0,b=0;

  if (h >= 0 && h < 60) { r=c; g=x; }
  else if (h < 120) { r=x; g=c; }
  else if (h < 180) { g=c; b=x; }
  else if (h < 240) { g=x; b=c; }
  else if (h < 300) { r=x; b=c; }
  else { r=c; b=x; }

  return { r: Math.round((r+m)*255), g: Math.round((g+m)*255), b: Math.round((b+m)*255) };
};

// RGB → CMYK
const rgbToCmyk = ({ r, g, b }) => {
  const rP = r/255, gP = g/255, bP = b/255;
  const k = 1 - Math.max(rP,gP,bP);
  const c = (1 - rP - k) / (1 - k) || 0;
  const m = (1 - gP - k) / (1 - k) || 0;
  const y = (1 - bP - k) / (1 - k) || 0;
  return { c: Math.round(c*100), m: Math.round(m*100), y: Math.round(y*100), k: Math.round(k*100) };
};

// CMYK → RGB
const cmykToRgb = ({ c, m, y, k }) => ({
  r: Math.round(255 * (1 - c/100) * (1 - k/100)),
  g: Math.round(255 * (1 - m/100) * (1 - k/100)),
  b: Math.round(255 * (1 - y/100) * (1 - k/100)),
});

// CMYK → HSL
const cmykToHsl = (cmyk) => rgbToHsl(cmykToRgb(cmyk));

// HSL → CMYK
const hslToCmyk = (hsl) => rgbToCmyk(hslToRgb(hsl));

/** -----------------------
 *  Color Utilities
 * ----------------------- **/

// Luminance
const getLuminance = ({ r, g, b }) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4);
  };
  return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
};

// Contrast ratio between 2 colors
const getContrastRatio = (rgb1, rgb2) => {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter+0.05)/(darker+0.05);
};

/** -----------------------
 *  Export all
 * ----------------------- **/
export {
  clamp,
  debounce,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  cmykToRgb,
  cmykToHsl,
  hslToCmyk,
  getLuminance,
  getContrastRatio
};
