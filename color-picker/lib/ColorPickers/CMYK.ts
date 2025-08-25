import type { RGB } from "../../types/ColorTypes";
import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { debounce } from "../Utilities/MicroFunctionalities";


interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

/**
 * Creates a CMYK color picker UI component.
 * @param initialColor - Initial CMYK values or null.
 * @param elements - Array of elements to update with chosen color.
 * @returns HTMLElement - The constructed CMYK color picker.
 */
export const CMYKPicker = (initialColor: CMYK | null, elements: HTMLElement[]): HTMLDivElement   => {
  const cmyk = document.createElement("div");
  cmyk.id = "cmyk";
  cmyk.classList.add("cmykPicker", "colorPickers");

  // Inner HTML for sliders and controls
  cmyk.innerHTML = `
    <div class="preview">Preview</div>
    ${createSlider("cyan", 20)}
    ${createSlider("magenta", 50)}
    ${createSlider("yellow", 70)}
    ${createSlider("black", 30)}
    ${extraOptionsHTML()}
  `;

  // Query all necessary elements
  const cyan = cmyk.querySelector<HTMLInputElement>("#cyan")!;
  const cyanText = cmyk.querySelector<HTMLInputElement>("#cyanText")!;
  const magenta = cmyk.querySelector<HTMLInputElement>("#magenta")!;
  const magentaText = cmyk.querySelector<HTMLInputElement>("#magentaText")!;
  const yellow = cmyk.querySelector<HTMLInputElement>("#yellow")!;
  const yellowText = cmyk.querySelector<HTMLInputElement>("#yellowText")!;
  const black = cmyk.querySelector<HTMLInputElement>("#black")!;
  const blackText = cmyk.querySelector<HTMLInputElement>("#blackText")!;
  const colorDisplay = cmyk.querySelector<HTMLDivElement>(".preview")!;
  const colorNames = new NTC();

  /**
   * Generates gradient for a slider based on its channel.
   */
  const cmykGradients = (channel: string, c: number, m: number, y: number, k: number): string => {
    let gradient = "linear-gradient(to right, ";
    for (let i = 0; i <= 100; i += 10) {
      const value = i / 100;
      let rgb: RGB = {r:0, g:0, b:0};
        let cmyk : CMYK = {c, m, y, k};
      switch (channel) {
        case "cyan": 
         cmyk = {c: value, m, y, k};
        rgb = ColorConverter.cmykToRgb(cmyk); 
        break;
        case "magenta": 
         cmyk ={c, m : value,y, k};
        rgb = ColorConverter.cmykToRgb(cmyk); 
        break;
        case "yellow": 
        cmyk = {c, m, y : value, k};
        rgb = ColorConverter.cmykToRgb(cmyk); 
        break;
        case "black": 
        cmyk = {c, m, y, k : value};
        rgb = ColorConverter.cmykToRgb(cmyk);
        break;
      }

      gradient += `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) ${i}%, `;
    }
    return gradient.slice(0, -2) + ")";
  };

  /**
   * Updates text fields when sliders move.
   */
  const syncSlidersToText = () => {
    cyanText.value = cyan.value;
    magentaText.value = magenta.value;
    yellowText.value = yellow.value;
    blackText.value = black.value;
    updateUI();
  };

  /**
   * Updates sliders when text fields change.
   */
  const syncTextToSliders = () => {
    cyan.value = cyanText.value;
    magenta.value = magentaText.value;
    yellow.value = yellowText.value;
    black.value = blackText.value;
    updateUI();
  };

  /**
   * Main update function - updates preview color and gradients.
   */
  const updateUI = debounce(() => {
    const c = +cyan.value / 100;
    const m = +magenta.value / 100;
    const y = +yellow.value / 100;
    const k = +black.value / 100;
    const CMYK = { c, m, y, k };
    const hex = ColorConverter.cmykToHex(CMYK);
    const name = colorNames.getColorName(hex);

    // Update preview
    colorDisplay.innerHTML = `<span style="background: white; color: #333; padding: 10px; border-radius: 15px;">${name}</span>`;
    colorDisplay.style.background = hex;

    // Apply color to target elements
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty("color", hex, "important");
      } else {
        el.style.setProperty("background", hex, "important");
      }
    });

    // Update slider gradients
    cyan.style.background = cmykGradients("cyan", c, m, y, k);
    magenta.style.background = cmykGradients("magenta", c, m, y, k);
    yellow.style.background = cmykGradients("yellow", c, m, y, k);
    black.style.background = cmykGradients("black", c, m, y, k);

    cmyk.style.boxShadow = `0 0 .5rem ${hex}`;
  }, 100);

  // Apply initial color if provided
  if (initialColor) {
    cyan.value = initialColor.c.toString();
    magenta.value = initialColor.m.toString();
    yellow.value = initialColor.y.toString();
    black.value = initialColor.k.toString();

    cyanText.value = cyan.value;
    magentaText.value = magenta.value;
    yellowText.value = yellow.value;
    blackText.value = black.value;

    elements.forEach(el => {
      const rgb = ColorConverter.cmykToRgb(initialColor);
        const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

      if (el.classList.contains("text")) {
        el.style.setProperty("color", rgbStr, "important");
      } else {
        el.style.setProperty("background", rgbStr, "important");
      }
    });
  }

  // Event listeners
  cyan.addEventListener("input", syncSlidersToText);
  magenta.addEventListener("input", syncSlidersToText);
  yellow.addEventListener("input", syncSlidersToText);
  black.addEventListener("input", syncSlidersToText);

  cyanText.addEventListener("input", syncTextToSliders);
  magentaText.addEventListener("input", syncTextToSliders);
  yellowText.addEventListener("input", syncTextToSliders);
  blackText.addEventListener("input", syncTextToSliders);

  // Initialize
  updateUI();
  return cmyk;
};

/**
 * Creates a slider container for a CMYK channel.
 */
function createSlider(channel: string, value: number): string {
  return `
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="${channel}">${channel.toUpperCase()}</label>
        <input type="text" class="text" id="${channel}Text" min="0" max="100" value="${value}">
      </div>
      <input type="range" class="slider sSlider" id="${channel}" min="0" max="100" value="${value}">
    </div>
  `;
}

/**
 * HTML for extra options (copy button, eyedropper, etc.)
 */
function extraOptionsHTML(): string {
  return `
    <div class="extraOptions">
      <div class="sections">
        <ul class="options">
          <li value="hsl" class="option optionText">HSL</li>
          <li value="hex" class="option optionText">HEX</li>
          <li value="cmyk" class="option optionText">CMYK</li>
          <li value="rgb" class="option optionText">RGB</li>
        </ul>
        <div class="activeSection">
          <h3 class="activeSelection">CMYK</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="chevron" viewBox="0 0 24 24"><path d="M4.29 8.29c.39-.39 1.02-.39 1.41 0L12 14.59l6.29-6.3c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-7 7a1 1 0 01-1.41 0l-7-7c-.39-.39-.39-1.02 0-1.41z"/></svg>
        </div>
      </div>
      <div class="extras">
        <div class="copyDiv"><svg class="copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M456 480H136a24 24 0 01-24-24V128a16 16 0 0116-16h328a24 24 0 0124 24v320a24 24 0 01-24 24z"/><path d="M112 80h288V56a24 24 0 00-24-24H60a28 28 0 00-28 28v316a24 24 0 0024 24h24V112a32 32 0 0132-32z"/></svg></div>
        <div class="eyeDropperDiv"><svg class="eyeDropper" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 96.22a63.84 63.84 0 00-18.95-45.61 65 65 0 00-45.71-19h-.76a61.78 61.78 0 00-44.22 19.09l-74.88 74.88-33.88-33.86-34.07 33.91-33.85 34 44 44L32 409.37V480h70.63l205.7-205.71L352 317.94l11.31-11.19c.11-.1 10.42-10.31 22.79-22.68l33.85-34-33.89-33.89L461 141.23a63.18 63.18 0 0019-45.01zM245 292.35L219.65 267l40.68-40.69 25.38 25.38z"/></svg></div>
      </div>
    </div>
  `;
}
