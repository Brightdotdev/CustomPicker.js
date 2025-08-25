import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";


// Define a type for RGB values
interface RGB {
  r: number;
  g: number;
  b: number;
}

// Define a type for HSV values
interface HSV {
  h: number;
  s: number;
  v: number;
}

/**
 * Hex Color Picker Component
 * Creates a color picker that lets users pick colors in HEX, RGB, or HSV format
 */
export const hexPicker = (externalColorInit?: RGB): HTMLDivElement  => {
  // Create the main container element
  const hexPickerDivElement = document.createElement("div");
  hexPickerDivElement.classList.add("hexColorPicker", "colorPickers");
  hexPickerDivElement.id = "hexColorPicker";

  // Add inner HTML for UI elements
  hexPickerDivElement.innerHTML = `
    <div class="saturationBrightnessWrapper">
      <canvas id="saturationBrightness" class="saturationBrightness" width="240" height="240"></canvas>
      <div class="saturationBrightnessCursor hexCursor" id="saturationBrightnessCursor"></div>
    </div>
    <div class="huePickerWrapper">
      <canvas id="huePicker" class="huePicker" width="240" height="20"></canvas>
      <div class="hueCursor hexCursor" id="hueCursor"></div>
    </div>
    <div class="colorCode" id="colorCode"><h6></h6></div>
    <div class="colorPreview preview" id="preview"><p style="padding: 0;margin: 0;">preview</p></div>
    <div class="extraOptions">
      <div class="sections">
        <ul class="options">
          <li value="hsl" class="option optionText">HSL</li>
          <li value="hex" class="option optionText">HEX (BETA)</li>
          <li value="cmyk" class="option optionText">CMYK</li>
          <li value="rgb" class="option optionText">RGB</li>
        </ul>
        <div class="activeSection">
          <h3 class="activeSelection">HEX (BETA)</h3>
          <svg xmlns="http://www.w3.org/2000/svg" id="chevron" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" 
            d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 
            5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 
            7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 
            8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 
            16.7071C12.3166 17.0976 11.6834 17.0976 
            11.2929 16.7071L4.29289 9.70711C3.90237 
            9.31658 3.90237 8.68342 4.29289 8.29289Z"/>
          </svg>
        </div>
      </div>
      <div class="extras">
        <svg id="copy" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
          <path d="M456 480H136a24 24 0 01-24-24V128a16 16 
          0 0116-16h328a24 24 0 0124 24v320a24 24 
          0 01-24 24z"/>
          <path d="M112 80h288V56a24 24 0 00-24-24H60a28 
          28 0 00-28 28v316a24 24 0 0024 24h24V112a32 
          32 0 0132-32z"/>
        </svg>
        <svg id="eyeDropper" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
          <path d="M480 96.22a63.84 63.84 0 00-18.95-45.61 
          65 65 0 00-45.71-19h-.76a61.78 61.78 0 00-44.22 
          19.09l-74.88 74.88-33.88-33.86-34.07 
          33.91-33.85 34 44 44L32 409.37V480h70.63l205.7-205.71L352 
          317.94l11.31-11.19c.11-.1 10.42-10.31 
          22.79-22.68l33.85-34-33.89-33.89L461 
          141.23a63.18 63.18 0 0019-45.01zM245 
          292.35L219.65 267l40.68-40.69 25.38 25.38z"/>
        </svg>
      </div>
    </div>
  `;

  // DOM element references
  const huePicker = hexPickerDivElement.querySelector<HTMLCanvasElement>("#huePicker")!;
  const saturationBrightness = hexPickerDivElement.querySelector<HTMLCanvasElement>("#saturationBrightness")!;
  const hueCtx = huePicker.getContext("2d", { willReadFrequently: true })!;
  const SBCtx = saturationBrightness.getContext("2d", { willReadFrequently: true })!;
  const hueCursor = hexPickerDivElement.querySelector<HTMLDivElement>("#hueCursor")!;
  const sbCursor = hexPickerDivElement.querySelector<HTMLDivElement>("#saturationBrightnessCursor")!;
  const preview = hexPickerDivElement.querySelector<HTMLDivElement>("#preview")!;
  const colorCode = hexPickerDivElement.querySelector<HTMLDivElement>("#colorCode")!;
  const colorNames = new NTC();

  // State variables
  let hue = 0, saturation = 1, brightness = 1;
  let isHueDragging = false, isColorDragging = false;

  /**
   * Converts RGB to HSV
   */
  const rgbToHsv = (r: number, g: number, b: number): HSV => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0, s = max === 0 ? 0 : delta / max, v = max;

    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h / 360, s, v };
  };

  /**
   * Converts HSV to RGB
   */
  const hsvToRgb = (hueParam: number, satParam: number, valParam: number): RGB => {
    hueParam = Math.min(1, Math.max(0, hueParam));
    satParam = Math.min(1, Math.max(0, satParam));
    valParam = Math.min(1, Math.max(0, valParam));
    const h = hueParam * 360;
    if (satParam === 0) {
      const gray = Math.round(valParam * 255);
      return { r: gray, g: gray, b: gray };
    }
    const i = Math.floor(h / 60) % 6;
    const f = h / 60 - Math.floor(h / 60);
    const p = valParam * (1 - satParam);
    const q = valParam * (1 - satParam * f);
    const t = valParam * (1 - satParam * (1 - f));
    let r = 0, g = 0, b = 0;
    switch (i) {
      case 0: [r, g, b] = [valParam, t, p]; break;
      case 1: [r, g, b] = [q, valParam, p]; break;
      case 2: [r, g, b] = [p, valParam, t]; break;
      case 3: [r, g, b] = [p, q, valParam]; break;
      case 4: [r, g, b] = [t, p, valParam]; break;
      case 5: [r, g, b] = [valParam, p, q]; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  /**
   * Updates the color preview
   */
  const updatePreviewColor = (): void => {
    const color = hsvToRgb(hue, saturation, brightness);
    const hex = ColorConverter.rgbToHex(color);
    hexPickerDivElement.style.boxShadow = `0 0 1rem ${hex}`;
    colorCode.querySelector("h6")!.innerText = hex;
    const hexName = colorNames.getColorName(hex);
    preview.innerHTML = `<span style="background: white;color:#333;padding:10px;border-radius:15px;">${hexName}</span>`;
    preview.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  /**
   * Draws the hue slider
   */
  const drawHuePicker = (): void => {
    const width = huePicker.width, height = huePicker.height;
    const imageData = hueCtx.createImageData(width, height);
    for (let x = 0; x < width; x++) {
      const hueVal = x / width;
      const color = hsvToRgb(hueVal, 1, 1);
      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4;
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = 255;
      }
    }
    hueCtx.putImageData(imageData, 0, 0);
  };

  /**
   * Draws saturation/brightness picker
   */
  const drawSBPicker = (): void => {
    const width = saturationBrightness.width, height = saturationBrightness.height;
    const imageData = SBCtx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const s = x / width, b = 1 - y / height;
        const color = hsvToRgb(hue, s, b);
        const index = (y * width + x) * 4;
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = 255;
      }
    }
    SBCtx.putImageData(imageData, 0, 0);
  };

  // Init drawing
  drawHuePicker();
  drawSBPicker();
  updatePreviewColor();

  // Sync if an external color is passed
  if (externalColorInit) {
    const hsv = rgbToHsv(externalColorInit.r, externalColorInit.g, externalColorInit.b);
    hue = hsv.h;
    saturation = hsv.s;
    brightness = hsv.v;
    drawSBPicker();
    updatePreviewColor();
  }

  return hexPickerDivElement;
};
