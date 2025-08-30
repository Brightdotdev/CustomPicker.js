

import type { RGB } from "../../types/ColorTypes.js";




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







/**
 * Launches the EyeDropper API and returns the picked color as a hex string (#RRGGBB).
 * 
 * @returns Promise<string | null> - The hex color string (e.g. "#ff5733"), 
 *                                   or null if cancelled or unsupported.
 */
export async function pickColorWithEyeDropper(): Promise<string | null> {
 
  
  if (!("EyeDropper" in window)) {
    alert("EyeDropper API is not supported in this browser.");
    return null;
  }

  try {
    
    const eyeDropper = new (window as any).EyeDropper();
    const result: { sRGBHex: string } = await eyeDropper.open();
    return result.sRGBHex;
  } catch (error) {
    alert("EyeDropper cancelled or failed");
    return null;
  }
}


/**
 * Copies a given text string to the clipboard.
 * 
 * @param text - The string to copy.
 * @returns Promise<boolean> - true if successful, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern API (works in most browsers)
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn("Clipboard API failed, trying fallback...", error);

    // Fallback for older browsers
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.error("Copy to clipboard failed:", err);
      return false;
    }
  }
}
