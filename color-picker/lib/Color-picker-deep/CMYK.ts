import type { CMYK , RGB } from "../../types/ColorTypes";
import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { debounce } from "../Utilities/MicroFunctionalities";


export const cmykPicker = (initialColor: CMYK | null, elements: HTMLElement[]): HTMLElement => {
  const cmyk = document.createElement('div');
  cmyk.id = 'cmyk';
  cmyk.classList.add("cmykPicker", "colorPickers");
  
  // Template for the CMYK picker UI
  cmyk.innerHTML = `
    <div class="preview">preview</div>
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="cyan">CYAN</label>
        <input type="text" class="text" name="cyan" id="cyanText" min="0" max="100" value="20">
      </div>
      <input type="range" class="slider sSlider" name="cyan" id="cyan" min="0" max="100" value="20">
    </div>
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="magenta">MAGENTA</label>
        <input type="text" class="text" name="magenta" id="magentaText" min="0" max="100" value="50">
      </div>
      <input type="range" class="slider sSlider" name="magenta" id="magenta" min="0" max="100" value="50">
    </div>
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="yellow">YELLOW</label>
        <input type="text" class="text" name="yellow" id="yellowText" min="0" max="100" value="70">
      </div>
      <input type="range" class="slider sSlider" name="yellow" id="yellow" min="0" max="100" value="70">
    </div>
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="black">BLACK</label>
        <input type="text" class="text" name="black" id="blackText" min="0" max="100" value="30">
      </div>
      <input type="range" class="slider sSlider" name="black" id="black" min="0" max="100" value="30">
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
          <h3 class="activeSelection">CMYK</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="chevron" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#000000"/>
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
  const cyan = cmyk.querySelector('#cyan') as HTMLInputElement;
  const cyanText = cmyk.querySelector('#cyanText') as HTMLInputElement;
  const magenta = cmyk.querySelector('#magenta') as HTMLInputElement;
  const magentaText = cmyk.querySelector('#magentaText') as HTMLInputElement;
  const yellow = cmyk.querySelector('#yellow') as HTMLInputElement;
  const yellowText = cmyk.querySelector('#yellowText') as HTMLInputElement;
  const black = cmyk.querySelector('#black') as HTMLInputElement;
  const blackText = cmyk.querySelector('#blackText') as HTMLInputElement;
  const colorDisplay = cmyk.querySelector('.preview') as HTMLElement;
  const colorNames = new NTC();

  // Function to create gradient backgrounds for sliders
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


  // Function to sync text inputs with slider values
  const syncValuesWithSliders = (): void => {  
    cyanText.value = cyan.value;
    magentaText.value = magenta.value;
    yellowText.value = yellow.value;
    blackText.value = black.value;
    cmykMain();
  };

  // Function to sync slider values with text inputs
  const syncValuesWithInputs = (): void => {  
    cyan.value = cyanText.value;
    magenta.value = magentaText.value;
    yellow.value = yellowText.value;
    black.value = blackText.value;
    cmykMain();
  };

  // Main function to update colors and UI
  const cmykMain = debounce((): void => {
    const c = parseInt(cyan.value) / 100;
    const m = parseInt(magenta.value) / 100;
    const y = parseInt(yellow.value) / 100;
    const k = parseInt(black.value) / 100;

    const cmyk2hex = ColorConverter.cmykToHex({c, m, y, k});
    const cmykName = colorNames.getColorName(cmyk2hex);
    
    // Update color display
    colorDisplay.innerHTML = 
      `<span style="background: white; color: hsl(0, 0%, 20%); padding: 10px; border-radius: 15px;">
        ${cmykName}
      </span>`;
    
    colorDisplay.style.background = cmyk2hex;
    
    // Update external elements
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty('color', cmyk2hex, 'important');
      } else {
        el.style.setProperty('background', cmyk2hex, 'important');
      }
    });
    
    // Update slider backgrounds
    cyan.style.background = cmykGradients('cyan', c, m, y, k);
    magenta.style.background = cmykGradients('magenta', c, m, y, k);
    yellow.style.background = cmykGradients('yellow', c, m, y, k);
    black.style.background = cmykGradients('black', c, m, y, k);
    
    // Update shadow
    cmyk.style.boxShadow = `0 0 .5rem ${cmyk2hex}`;
  }, 100);

  // If initial color is provided, set the values
  if (initialColor) {
    cyan.value = initialColor.c.toString();
    cyanText.value = initialColor.c.toString();
    
    magenta.value = initialColor.m.toString();
    magentaText.value = initialColor.m.toString();
    
    yellow.value = initialColor.y.toString();
    yellowText.value = initialColor.y.toString();
    
    black.value = initialColor.k.toString();
    blackText.value = initialColor.k.toString();
    
    const initialRgbColor = ColorConverter.cmykToRgb(
 {   c:  initialColor.c / 100, 
      m : initialColor.m / 100, 
     y :  initialColor.y / 100, 
     k : initialColor.k / 100}
    );
    const rgbString = `rgb(${initialRgbColor.r},${initialRgbColor.g},${initialRgbColor.b},)`
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty('color', rgbString, 'important');
      } else {
        el.style.setProperty('background', rgbString, 'important');
      }
    });
  }

  // Add event listeners
  cyan.addEventListener('input', syncValuesWithSliders);
  magenta.addEventListener('input', syncValuesWithSliders);
  yellow.addEventListener('input', syncValuesWithSliders);
  black.addEventListener('input', syncValuesWithSliders);
  
  cyanText.addEventListener('input', syncValuesWithInputs);
  magentaText.addEventListener('input', syncValuesWithInputs);
  yellowText.addEventListener('input', syncValuesWithInputs);
  blackText.addEventListener('input', syncValuesWithInputs);

  // Initialize with default values
  cmykMain();

  return cmyk;
};