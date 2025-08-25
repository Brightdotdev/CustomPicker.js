/**
 * Type definitions for RGB, HSL, and CMYK
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}
export interface NamedColor {
  hex: string;
  name: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}





// Union type for all color models
export type AnyColor = RGB | HSL | CMYK;


export interface ColorValue {
  pickerId: string;
  value: RGB;
}

export interface ContrastRatios {
  textToBg: string;
  textToAccent: string;
  textToMain: string;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

