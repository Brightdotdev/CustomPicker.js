import type { CMYK, HSL, RGB } from "../../types/ColorTypes";


export const ColorConverter = {
  /**
   * 🔹 Convert HSL to HEX
   */
  hslToHex(hsl : HSL): string {
    let { h, s, l } = hsl;
  
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * 🔹 Convert CMYK to HEX
   */
  cmykToHex(cmyk : CMYK): string {

    const { c, m, y, k } = cmyk;
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - cmyk.k);

    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
      .toString(16)
      .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
  },

  /**
   * 🔹 Convert CMYK (0-100) to HEX
   */
  cmykToHexInit(cmyk : CMYK): string {
    return this.cmykToHex({ c: cmyk.c / 100, m: cmyk.m / 100, y: cmyk.y / 100, k: cmyk.k / 100});
  },

  /**
   * 🔹 Convert CMYK to RGB
   */
  cmykToRgb(cmyk : CMYK): RGB {
    const { c, m, y, k } = cmyk;
    return {
      r: Math.round(255 * (1 - c) * (1 - k)),
      g: Math.round(255 * (1 - m) * (1 - k)),
      b: Math.round(255 * (1 - y) * (1 - k)),
    };
  },

  /**
   * 🔹 Convert RGB to HEX
   */
  rgbToHex(rgb : RGB): string {
    const { r, g, b } = rgb;
    const toHex = (val: number) => Math.round(val).toString(16).padStart(2, "0").toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * 🔹 Convert HSL to RGB
   */
  hslToRgb(hsl : HSL): RGB {
    let { h, s, l } = hsl;
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  },

  /**
   * 🔹 Convert RGB to HSL
   */
  rgbToHsl(rgb : RGB): HSL {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  },

  /**
   * 🔹 Convert HEX to RGB
   */
  hexToRgb(hex: string): RGB {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  },


  /* hsl to cmyk */

  hslToCmyk(hsl : HSL): CMYK {
    const { h, s, l } = hsl;

    // Step 1: Normalize inputs
  const hue = h % 360; // Wrap hue within 0–359
  const saturation = s / 100; // Convert % to [0,1]
  const lightness = l / 100; // Convert % to [0,1]

  // Step 2: Convert HSL to RGB
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation; // Chroma
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1)); // Intermediate value
  const m = lightness - c / 2;

  let r = 0, g = 0, b = 0; // Temp RGB values in [0,1]

  if (hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  // Add match value to shift from [0,c] to [0,1]
  r = r + m;
  g = g + m;
  b = b + m;

  // Step 3: Convert RGB to CMYK
  const k = 1 - Math.max(r, g, b);
  const cyan = (1 - r - k) / (1 - k) || 0;
  const magenta = (1 - g - k) / (1 - k) || 0;
  const yellow = (1 - b - k) / (1 - k) || 0;

  return {
    c: parseFloat(cyan.toFixed(4)),
    m: parseFloat(magenta.toFixed(4)),
    y: parseFloat(yellow.toFixed(4)),
    k: parseFloat(k.toFixed(4))
  };
  }
  ,


  /**
 * Convert RGB to CMYK
 */
  rgbToCmyk(rgb : RGB) : CMYK {
  const { r, g, b } = rgb;
    // Normalize RGB to 0–1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Calculate K (black key)
  const k = 1 - Math.max(rNorm, gNorm, bNorm);

  if (k === 1) {
    // Black shortcut
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  // Calculate CMY
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: +(c * 100).toFixed(2),
    m: +(m * 100).toFixed(2),
    y: +(y * 100).toFixed(2),
    k: +(k * 100).toFixed(2),
  };
}

,

cmykToHsl(cmyk : CMYK) : HSL {
  const {c,m,y,k} = cmyk
  // 1. Normalize CMYK values from percentages to 0–1 range
  const C = c / 100;
  const M = m / 100;
  const Y = y / 100;
  const K = k / 100;

  // 2. Convert CMYK to RGB (0–1 range)
  const r = 1 - Math.min(1, C * (1 - K) + K);
  const g = 1 - Math.min(1, M * (1 - K) + K);
  const b = 1 - Math.min(1, Y * (1 - K) + K);

  // 3. Find min and max RGB values to calculate lightness and saturation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // 4. Calculate Lightness
  const l = (max + min) / 2;

  // 5. Calculate Saturation
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  // 6. Calculate Hue
  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  // 7. Convert s and l to percentage
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

,

/**
 * Universal conversion to HSL
 */toHSL(color: RGB | CMYK | HSL): HSL {
  if ("h" in color && "s" in color && "l" in color) return color; // Already HSL
  if ("r" in color && "g" in color && "b" in color) return ColorConverter.rgbToHsl(color); // RGB -> HSL
  if ("c" in color && "m" in color && "y" in color && "k" in color) return ColorConverter.cmykToHsl(color); // CMYK -> HSL
  throw new Error("Unsupported color format");
}
,
/**
 * Universal conversion to RGB
 */
 toRGB(color: HSL | CMYK | RGB): RGB {
  if ("r" in color && "g" in color && "b" in color) return color; // Already RGB
  if ("h" in color && "s" in color && "l" in color) return ColorConverter.hslToRgb(color); // HSL -> RGB
  if ("c" in color && "m" in color && "y" in color && "k" in color) return ColorConverter.cmykToRgb(color); // CMYK -> RGB
  throw new Error("Unsupported color format");
}

/**
 * Universal conversion to CMYK
 */
  ,
   toCMYK(color : HSL | RGB | CMYK): CMYK {
  if ("c" in color && "m" in color && "y" in color && "k" in color) return color; // Already CMYK
  if ("h" in color && "s" in color && "l" in color) return ColorConverter.hslToCmyk(color); // HSL -> CMYK
  if ("r" in color && "g" in color && "b" in color) return ColorConverter.rgbToCmyk(color); // RGB -> CMYK
  throw new Error("Unsupported color format");
}
}

