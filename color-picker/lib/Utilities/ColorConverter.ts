import type { CMYK, HSL, RGB } from "../../types/ColorTypes";


export const ColorConverter = {


  
/**
 * Converts hex (#RRGGBB) to RGB.
 */
 hexToRgb(hex: string): RGB {
  // Remove leading # if present
  hex = hex.replace(/^#/, "");

  if (hex.length !== 6) {
    throw new Error("Invalid hex color format. Expected #RRGGBB");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}
,
/**
 * Converts hex (#RRGGBB) to HSL.
 */
 hexToHsl(hex: string): HSL {
  const { r, g, b } = this.hexToRgb(hex);

  // Normalize to [0, 1]
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts hex (#RRGGBB) to CMYK (percent values 0–100).
 */
,  hexToCmyk(hex: string): CMYK {
  const { r, g, b } = this.hexToRgb(hex);

  if (r === 0 && g === 0 && b === 0) {
    // Pure black
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

,

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
    const r = 255 * (1 - c / 100) * (1 - k/100);
    const g = 255 * (1 - m/100) * (1 - k/100);
    const b = 255 * (1 - y/100) * (1 - k/100);

    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
      .toString(16)
      .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
  },

  
  /**
   * 🔹 Convert CMYK to RGB
   */
  cmykToRgb(cmyk : CMYK): RGB {

    const {c,m,y,k} = cmyk

  const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
  const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
  const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));

  return { r, g, b };
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
    let {h,s,l} = hsl

   s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
  } else {
      r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
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
  const delta = max - min;

  let h = 0, s = 0, l = (max + min) / 2;

  if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      switch (max) {
          case r: h = ((g - b) / delta + (g < b ? 6 : 0)) * 60; break;
          case g: h = ((b - r) / delta + 2) * 60; break;
          case b: h = ((r - g) / delta + 4) * 60; break;
      }
  }

  return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
  };
  },

  
  
  /* hsl to cmyk */

  hslToCmyk(hsl : HSL): CMYK {
    const rgb = this.hslToRgb(hsl); // Convert HSL to RGB
    return this.rgbToCmyk(rgb);      // Convert RGB to CMYK
  }
  ,


  /**
 * Convert RGB to CMYK
 */

  /* 
  
  
  
  
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
    c: +(c * 100).toFixed(0),
    m: +(m * 100).toFixed(0),
    y: +(y * 100).toFixed(0),
    k: +(k * 100).toFixed(0),
  };
}

,

cmykToHsl(cmyk : CMYK) : HSL {
  const rgb = ColorConverter.cmykToRgb(cmyk); // Convert CMYK to RGB
  return ColorConverter.rgbToHsl(rgb); 
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

