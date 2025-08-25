import type {HSL} from "../../types/ColorTypes"
import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { debounce } from "../Utilities/MicroFunctionalities";



export const hslPicker = (initialColor: HSL | null, elements: HTMLElement[]): HTMLElement => {
  const hsl = document.createElement('div');
  hsl.id = 'hsl';
  hsl.classList.add("hslPicker", "colorPickers");
  
  // Template for the HSL picker UI
  hsl.innerHTML = `
    <div class="preview">preview</div>
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="hue">HUE</label>
        <input type="text" class="text" name="hue" id="hueText" min="0" max="360" value="20">
      </div>
      <input type="range" class="slider" name="hue" id="hue" min="0" max="360" value="20">
    </div>
    
    <div class="sliderContainer">    
      <div class="colorIdentifyer">
        <label class="label" for="saturation">SATURATION</label>
        <input type="text" class="text" name="saturation" id="saturationText" min="0" max="100" value="100">
      </div>
      <input type="range" class="slider sSlider" name="saturation" id="saturation" min="0" max="100" value="100">
    </div>

    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="lightness">LIGHTNESS</label>
        <input type="text" class="text" name="lightness" id="lightnessText" min="0" max="100" value="50">
      </div>
      <input type="range" class="slider sSlider" name="lightness" id="lightness" min="0" max="100" value="50">
    </div>

    <div class="extraOptions">
      <div class="sections">
        <ul class="options">
          <li value="hsl" class="option optionText">HSL</li>
          <li value="hex" class="option optionText">HEX (BETA)</li>
          <li value="cmyk" class="option optionText">CMYK</li>
          <li value="rgb" class="option optionText">RGB</li>
        </ul>
        <div class="activeSection">
          <h3 class="activeSelection">HSL</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="chevron" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"/>
          </svg>
        </div>
      </div>
      <div class="extras">
        <div class="copyDiv">
          <svg class="copy" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
            <path d="M456 480H136a24 24 0 01-24-24V128a16 16 0 0116-16h328a24 24 0 0124 24v320a24 24 0 01-24 24z"/>
            <path d="M112 80h288V56a24 24 0 00-24-24H60a28 28 0 00-28 28v316a24 24 0 0024 24h24V112a32 32 0 0132-32z"/>
          </svg>
        </div>
        <div class="eyeDropperDiv">
          <svg class="eyeDropper" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
            <path d="M480 96.22a63.84 63.84 0 00-18.95-45.61 65 65 0 00-45.71-19h-.76a61.78 61.78 0 00-44.22 19.09l-74.88 74.88-33.88-33.86-34.07 33.91-33.85 34 44 44L32 409.37V480h70.63l205.7-205.71L352 317.94l11.31-11.19c.11-.1 10.42-10.31 22.79-22.68l33.85-34-33.89-33.89L461 141.23a63.18 63.18 0 0019-45.01zM245 292.35L219.65 267l40.68-40.69 25.38 25.38z"/>
          </svg>
        </div>
      </div>
    </div>
  `;

  // Get references to DOM elements with proper typing
  const hue = hsl.querySelector('#hue') as HTMLInputElement;
  const hueText = hsl.querySelector('#hueText') as HTMLInputElement;
  const lightness = hsl.querySelector('#lightness') as HTMLInputElement;
  const lightnessText = hsl.querySelector('#lightnessText') as HTMLInputElement;
  const saturation = hsl.querySelector('#saturation') as HTMLInputElement;
  const saturationText = hsl.querySelector('#saturationText') as HTMLInputElement;
  const colorDisplay = hsl.querySelector('.preview') as HTMLElement;
  const colorNames = new NTC();

  // Function to sync text inputs with slider values
  const syncValuesWithSliders = (): void => {
    hueText.value = hue.value;
    saturationText.value = saturation.value;
    lightnessText.value = lightness.value;
    hslMain();
  };

  // Function to sync slider values with text inputs
  const syncValuesWithInputs = (): void => {
    hue.value = hueText.value;
    saturation.value = saturationText.value;
    lightness.value = lightnessText.value;
    hslMain();
  };

  // Main function to update colors and UI
  const hslMain = debounce((): void => {
    const h = parseInt(hue.value);
    const s = parseInt(saturation.value);
    const l = parseInt(lightness.value);
    const HSL = `hsl(${h}, ${s}%, ${l}%)`;
    
    // Update slider backgrounds
    saturation.style.background = 
      `linear-gradient(to right, 
        hsl(${h}, 0%, ${l}%),
        hsl(${h}, 100%, ${l}%))`;
    
    lightness.style.background = 
      `linear-gradient(to right, 
        hsl(${h}, ${s}%, 0%), 
        hsl(${h}, ${s}%, 50%))`;

    // Update external elements
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty('color', HSL, 'important');
      } else {
        el.style.setProperty('background', HSL, 'important');
      }
    });

    // Update color display
    colorDisplay.style.background = HSL;
    const hexColor = ColorConverter.hslToHex({h, s, l});  
    const hslName = colorNames.getColorName(hexColor);
    
    colorDisplay.innerHTML = 
      `<span style="background: white; color: hsl(0, 0%, 20%); padding: 10px; border-radius: 15px;">
        ${hslName}
      </span>`;

    // Update shadow based on lightness and saturation
    if (l > 80 || s > 80) {
      hsl.style.boxShadow = `0 0 .5rem black`;
    } else if (l < 80 || s < 80) {
      hsl.style.boxShadow = `0 0 .5rem ${hexColor}`;
    }
  }, 50);

  // Add event listeners
  hue.addEventListener('input', syncValuesWithSliders);
  saturation.addEventListener('input', syncValuesWithSliders);
  lightness.addEventListener('input', syncValuesWithSliders);
  
  hueText.addEventListener('input', syncValuesWithInputs);
  saturationText.addEventListener('input', syncValuesWithInputs);
  lightnessText.addEventListener('input', syncValuesWithInputs);

  // Initialize with default values
  hslMain();

  // If initial color is provided, set the values
  if (initialColor) {
    hue.value = initialColor.h.toString();
    hueText.value = initialColor.h.toString();
    
    saturation.value = initialColor.s.toString();
    saturationText.value = initialColor.s.toString();
    
    lightness.value = initialColor.l.toString();
    lightnessText.value = initialColor.l.toString();
    
    const initialHSL = `hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%)`;
    
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty('color', initialHSL, 'important');
      } else {
        el.style.setProperty('background', initialHSL, 'important');
      }
    });
  }

  return hsl;
};