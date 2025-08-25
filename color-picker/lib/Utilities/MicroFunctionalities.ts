// src/colorUtils.ts

// ----------------------
// Interfaces & Types
// ----------------------

// ----------------------
// External Conversion Functions
// ----------------------
// NOTE: These are assumed to be implemented elsewhere.
// We'll type them so TypeScript knows their signatures.

import type { AnyColor, CMYK, ColorValue, ContrastRatios, HSL, RGB } from "../../types/ColorTypes.js";

import { ColorConverter } from "./ColorConverter.js";



// ----------------------
// Utility Functions
// ----------------------

/**
 * Calculate luminance of an RGB color.
 */
export const getLuminance = (rgb: RGB): number => {
  let { r, g, b } = rgb;

  [r, g, b] = [r, g, b].map((channel) => {
    channel /= 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two RGB colors.
 */
export const getContrastRatio = (color1: RGB, color2: RGB): number => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Return an SVG icon representing the contrast quality.
 */
export const getContrast = (ratio: number): string => {
  const neutralColor = "#757575";
  const size = "15";
  const viewBox = "0 0 24 24";

  const baseCircle = `<circle cx="12" cy="12" r="10" stroke="${neutralColor}" stroke-width="2" fill="none"/>`;

  if (ratio >= 7.0) {
    // Excellent
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
      ${baseCircle}
      <path d="M8 12.3333L10.4615 15L16 9" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else if (ratio >= 4.5) {
    // Good
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
      ${baseCircle}
      <path d="M9 12L11 14L15 10" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else if (ratio >= 3.0) {
    // Sufficient
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
      ${baseCircle}
      <line x1="8" y1="12" x2="16" y2="12" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  } else {
    // Poor
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
      ${baseCircle}
      <path d="M15 9L9 15M9 9L15 15" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
};

/**
 * Simple debounce utility.
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ----------------------
// Color Conversion Initializers
// ----------------------

/**
 * Normalize any color object to RGB.
 */
export const colorsToRgb = (color: AnyColor): RGB => {
  if ("r" in color && "g" in color && "b" in color) return color;
  if ("h" in color && "s" in color && "l" in color)
    return ColorConverter.hslToRgb(color as HSL);
  return ColorConverter.cmykToRgb(color as CMYK);
};

/**
 * Normalize any color object to RGB for color change operations.
 */
export const rgbColorChangeInit = (color: AnyColor): RGB => colorsToRgb(color);

/**
 * Normalize any color object to CMYK.
 */
export const cmykColorChangeInit = (color: AnyColor): CMYK => {
  if ("c" in color && "m" in color && "y" in color && "k" in color)
    return color;
  if ("r" in color && "g" in color && "b" in color)
    return ColorConverter.rgbToCmyk(color as RGB);
  return ColorConverter.hslToCmyk(color as HSL);
};

/**
 * Normalize any color object to HSL.
 */
export const hslColorChangeInit = (color: AnyColor): HSL => {
  if ("h" in color && "s" in color && "l" in color) return color;
  if ("r" in color && "g" in color && "b" in color)
    return ColorConverter.rgbToHsl(color as RGB);
  return ColorConverter.cmykToHsl(color as CMYK);
};

/**
 * Convert any color object to HSL explicitly.
 */
export const colorsToHsl = (color: AnyColor): HSL => hslColorChangeInit(color);

// ----------------------
// Color Manager
// ----------------------


export const colorManagers = {
  colorValues: [] as ColorValue[],
  colorRatio: [] as ContrastRatios[],

  /**
   * Update a color value by picker ID.
   */
  updateColors(pickerId: string, value: RGB): void {
    const existingIndex = this.colorValues.findIndex(
      (picker) => picker.pickerId === pickerId
    );

    if (existingIndex !== -1) {
      this.colorValues[existingIndex].value = value;
    } else {
      this.colorValues.push({ pickerId, value });
    }

    console.log(`Color values updated for picker ${pickerId}:`, value);
    this.updateRatios();
  },

  /**
   * Calculate and return contrast ratios between colors.
   */
  checkContrast(): ContrastRatios {
    const defaultColor: RGB = { r: 0, g: 0, b: 0 };

    const getColor = (id: string): RGB =>
      this.colorValues.find((p) => p.pickerId === id)?.value || defaultColor;

    const textColor = getColor("textPicker");
    const bgColor = getColor("backgroundPicker");
    const mainColor = getColor("mainPicker");
    const accentColor = getColor("accentPicker");

    const textBgRatio = getContrast(getContrastRatio(textColor, bgColor));
    const textAccentRatio = getContrast(getContrastRatio(textColor, accentColor));
    const textMainRatio = getContrast(getContrastRatio(textColor, mainColor));

    return { textToBg: textBgRatio, textToAccent: textAccentRatio, textToMain: textMainRatio };
  },

  /**
   * Update stored contrast ratios.
   */
  updateRatios(): void {
    this.colorRatio = [];
    this.colorRatio.push(this.checkContrast());
    console.log("Updated Contrast Ratios:", this.colorRatio);
  },
};




