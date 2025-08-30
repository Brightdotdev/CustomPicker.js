
import type {RGB, HSL ,CMYK} from "./ColorTypes"




type colorAbleElement = 
  | "color"                  // Text color
  | "background"             // Background shorthand
  | "background-color"       // Explicit background color
  | "border-color"           // Border colors
  | "border-top-color"
  | "border-right-color"
  | "border-bottom-color"
  | "border-left-color"
  | "outline-color"          // Outline/focus highlight
  | "caret-color"            // Text cursor color
  | "accent-color"           // Checkbox, radio, slider accent
  | "text-decoration-color"  // Underlines/strikethroughs
  | "column-rule-color"      // Multi-column rule
  | "box-shadow"             // Shadows behind elements
  | "text-shadow"            // Shadows behind text
  | "fill"                   // SVG fill
  | "stroke"                 // SVG stroke
  | "scrollbar-color"        // Scrollbar customization
  | "selection-bg"           // Selection highlight background
  | "selection-text";        // Selection text color



export type targetElementPorps = {
    targetElement : HTMLElement[] | HTMLElement | NodeListOf<HTMLDivElement> | SVGElement ,
    targetStylePorperty : colorAbleElement
    
}


export interface PickerProps {
    colorPickerContainer? : HTMLElement;
    targetElementProps : targetElementPorps;
} 

export interface CmykElements{
    cyan : HTMLInputElement;
    magenta : HTMLInputElement;
    yellow: HTMLInputElement;
    black: HTMLInputElement;
    cyanText: HTMLInputElement;
    magentaText: HTMLInputElement;
    yellowText: HTMLInputElement;
    blackText: HTMLInputElement;
    colorDisplay: HTMLDivElement;
    eyeDropperButton: HTMLDivElement;
    copyButton: HTMLDivElement;
    CmykElement: HTMLDivElement;
} 


export interface HslElements{
    hue : HTMLInputElement;
    saturation : HTMLInputElement;
    lightness: HTMLInputElement;
    
    hueText: HTMLInputElement;
    saturationText: HTMLInputElement;
    lightnessText: HTMLInputElement;
    colorDisplay: HTMLDivElement;
    eyeDropperButton: HTMLDivElement;
    copyButton: HTMLDivElement;
    HslElement: HTMLDivElement;
} 


export interface RgbElements{
    red : HTMLInputElement;
    green : HTMLInputElement;
    blue: HTMLInputElement;
    
    redText: HTMLInputElement;
    greenText: HTMLInputElement;
    blueText: HTMLInputElement;
    colorDisplay: HTMLDivElement;
    eyeDropperButton: HTMLDivElement;
    copyButton: HTMLDivElement;
    RgbElement: HTMLDivElement;
} 


export type anyColorType = CMYK | HSL | RGB







export interface ColorPickerObject<T extends anyColorType> {
  getHtmlContent  : ()  =>  HTMLDivElement;
  getCurrentColor : () =>   T ;
  setExternalColor: (externalColor: T) => void;
  destroyPicker: () => void

}