import type { RGB } from "../../types/ColorTypes";
import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { debounce } from "../Utilities/MicroFunctionalities";

export const rgbPicker = (initialColor: RGB | null, elements: HTMLElement[]): HTMLElement => {
  const rgb = document.createElement('div');
  rgb.id = 'rgb';
  rgb.classList.add("rgbPicker", "colorPickers");
  
  // Template for the RGB picker UI
  rgb.innerHTML = `        
    <div class="preview">Preview</div>  
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="red">RED</label>
        <input type="text" class="text" name="red" id="redText" min="0" max="255" value="40">
      </div>
      <input type="range" class="slider sSlider" name="red" id="red" min="0" max="255" value="40">
    </div>   
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="green">GREEN</label>
        <input type="text" class="text" name="green" id="greenText" min="0" max="255" value="90">
      </div>
      <input type="range" class="slider sSlider" name="green" id="green" min="0" max="255" value="90">
    </div>   
    
    <div class="sliderContainer">
      <div class="colorIdentifyer">
        <label class="label" for="blue">BLUE</label>
        <input type="text" class="text" name="blue" id="blueText" min="0" max="255" value="100">
      </div>  
      <input type="range" class="slider sSlider" name="blue" id="blue" min="0" max="255" value="100">
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
          <h3 class="activeSelection">RGB</h3>
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
  const red = rgb.querySelector('#red') as HTMLInputElement;
  const redText = rgb.querySelector('#redText') as HTMLInputElement;
  const blue = rgb.querySelector('#blue') as HTMLInputElement;
  const blueText = rgb.querySelector('#blueText') as HTMLInputElement;
  const green = rgb.querySelector('#green') as HTMLInputElement;
  const greenText = rgb.querySelector('#greenText') as HTMLInputElement;
  const colorDisplay = rgb.querySelector('.preview') as HTMLElement;
  const colorNames = new NTC();

  // Function to create gradient backgrounds for sliders
  const rgbGradients = (channel: string, r: number, g: number, b: number): string => {
    let gradient = "linear-gradient(to right, ";
    
    for (let i = 0; i <= 255; i += 25) {
      let color: string;
      
      switch (channel) {
        case "red":
          color = ColorConverter.rgbToHex({ r: i, g, b });
          break;
        case "green":
          color = ColorConverter.rgbToHex({ r, g: i, b });
          break;
        case "blue":
          color = ColorConverter.rgbToHex({ r, g, b: i });
          break;
        default:
          color = "#000000"; // Fallback color
      }
      
      gradient += `${color} ${(i / 225) * 100}%, `;
    }
    
    return gradient.slice(0, -2) + ")";
  };

  // Function to sync text inputs with slider values
  const syncValuesWithSliders = (): void => {  
    redText.value = red.value;
    greenText.value = green.value;
    blueText.value = blue.value;
    rgbMain();
  };

  // Function to sync slider values with text inputs
  const syncValuesWithInputs = (): void => {  
    red.value = redText.value;
    green.value = greenText.value;
    blue.value = blueText.value;
    rgbMain();
  };

  // Main function to update colors and UI
  const rgbMain = debounce((): void => {
    const r = parseInt(red.value);
    const g = parseInt(green.value);
    const b = parseInt(blue.value);
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const rgb2hex = ColorConverter.rgbToHex({ r, g, b });
    const rgbColorName = colorNames.getColorName(rgb2hex);

    // Update color display
    colorDisplay.innerHTML = 
      `<span style="background: white; color: hsl(0, 0%, 20%); padding: 10px; border-radius: 15px;">
        ${rgbColorName}
      </span>`;

    // Update external elements
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty('color', rgbColor, 'important');
      } else {
        el.style.setProperty('background', rgbColor, 'important');
      }
    });

    // Update UI elements
    colorDisplay.style.background = rgbColor;
    red.style.background = rgbGradients('red', r, g, b);
    green.style.background = rgbGradients('green', r, g, b);
    blue.style.background = rgbGradients('blue', r, g, b);
    rgb.style.boxShadow = `0 0 .5rem ${rgbColor}`;
  }, 100);

  // Add event listeners
  red.addEventListener('input', syncValuesWithSliders);
  green.addEventListener('input', syncValuesWithSliders);
  blue.addEventListener('input', syncValuesWithSliders); 

  redText.addEventListener('input', syncValuesWithInputs);
  greenText.addEventListener('input', syncValuesWithInputs);
  blueText.addEventListener('input', syncValuesWithInputs);

  // If initial color is provided, set the values
  if (initialColor) {
    red.value = initialColor.r.toString();
    redText.value = initialColor.r.toString();
    
    green.value = initialColor.g.toString();
    greenText.value = initialColor.g.toString();
    
    blue.value = initialColor.b.toString();
    blueText.value = initialColor.b.toString();

    const initialRgbColor = `rgb(${initialColor.r}, ${initialColor.g}, ${initialColor.b})`;
    
    elements.forEach(el => {
      if (el.classList.contains("text")) {
        el.style.setProperty('color', initialRgbColor, 'important');
      } else {
        el.style.setProperty('background', initialRgbColor, 'important');
      }
    });
  }

  // Initialize with default values
  rgbMain();

  return rgb;
};