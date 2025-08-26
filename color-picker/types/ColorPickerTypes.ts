
import type {RGB, HSL ,CMYK} from "./ColorTypes"

export type targetElementPorps = {
    targetElement : HTMLElement[] | HTMLElement | NodeListOf<HTMLDivElement> ,
    targetStylePorperty : "text" | "background"
}


export interface PickerProps {
    colorPickerContainer? : HTMLElement;
    targetElements : targetElementPorps;
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



export interface ColorPickerExport<T extends anyColorType> {
    ColorPickerElement: HTMLDivElement | null,
    setExternalColor: (externalColor: T) => void
}
