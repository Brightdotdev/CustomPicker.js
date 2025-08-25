import type { RGB } from "../../types/ColorTypes";
import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { debounce } from "../Utilities/MicroFunctionalities";


// 🔹 Define a type for elements that we will modify
type StyleElement = HTMLElement & { classList: DOMTokenList };

// 🔧 Helper: Generate slider gradient
const createGradient = (channel: "red" | "green" | "blue", r: number, g: number, b: number): string => {
  let gradient = "linear-gradient(to right, ";
  for (let i = 0; i <= 255; i += 25) {
    let color: string;
    let rgb : RGB = {r, g, b};
    switch (channel) {
      case "red":
        rgb = {r: i, g, b};
        color = ColorConverter.rgbToHex(rgb);
        break;
      case "green":
        rgb = {r, g: i, b};
        color = ColorConverter.rgbToHex(rgb);
        break;
      case "blue":
        rgb = {r, g, b: i};
        color = ColorConverter.rgbToHex(rgb);
        break;
    }
    gradient += `${color} ${(i / 225) * 100}%, `;
  }
  return gradient.slice(0, -2) + ")";
};

// 🔧 Helper: Apply color styles to elements
const applyColorStyles = (elements: StyleElement[], color: string): void => {
  elements.forEach((el) => {
    if (el.classList.contains("text")) {
      el.style.setProperty("color", color, "important");
    } else {
      el.style.setProperty("background", color, "important");
    }
  });
};

// 🔹 Main Component
export const RgbPicker = (initialColor: RGB | null, elements: StyleElement[]): HTMLDivElement => {
  // Create main container
  const container = document.createElement("div");
  container.id = "rgb";
  container.classList.add("rgbPicker", "colorPickers");
  container.innerHTML = `
    <div class="preview">Preview</div>
    ${["red", "green", "blue"].map(
      (color) => `
        <div class="sliderContainer">
          <div class="colorIdentifyer">
            <label class="label" for="${color}">${color.toUpperCase()}</label>
            <input type="text" class="text" id="${color}Text" min="0" max="255" value="0">
          </div>
          <input type="range" class="slider sSlider" id="${color}" min="0" max="255" value="0">
        </div>
      `
    ).join("")}
    <div class="extraOptions">
      <div class="sections">
        <ul class="options">
          <li value="hsl" class="option optionText">HSL</li>
          <li value="hex" class="option optionText">HEX</li>
          <li value="cmyk" class="option optionText">CMYK</li>
          <li value="rgb" class="option optionText">RGB</li>
        </ul>
        <div class="activeSection">
          <h3 class="activeSelection">RGB</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="chevron" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M4.29 8.29c.39-.39 1.02-.39 1.41 0L12 14.59l6.29-6.3c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-7 7c-.39.39-1.02.39-1.41 0l-7-7c-.39-.39-.39-1.02 0-1.41z"/>
          </svg>
        </div>
      </div>
    </div>
  `;

  // Get input references
  const preview = container.querySelector<HTMLDivElement>(".preview")!;
  const red = container.querySelector<HTMLInputElement>("#red")!;
  const green = container.querySelector<HTMLInputElement>("#green")!;
  const blue = container.querySelector<HTMLInputElement>("#blue")!;
  const redText = container.querySelector<HTMLInputElement>("#redText")!;
  const greenText = container.querySelector<HTMLInputElement>("#greenText")!;
  const blueText = container.querySelector<HTMLInputElement>("#blueText")!;
  const colorNames = new NTC();

  // 🔥 Core function to update UI
  const updateColors = debounce(() => {
    const r = parseInt(red.value, 10);
    const g = parseInt(green.value, 10);
    const b = parseInt(blue.value, 10);
    const RGB = `rgb(${r},${g},${b})`;
    const hex = ColorConverter.rgbToHex({r, g, b});
    const colorName = colorNames.getColorName(hex);

    preview.innerHTML = `<span style="background: white; color:hsl(0,0%,20%); padding:10px; border-radius:15px;">${colorName}</span>`;
    preview.style.background = RGB;
    container.style.boxShadow = `0 0 .5rem ${RGB}`;

    red.style.background = createGradient("red", r, g, b);
    green.style.background = createGradient("green", r, g, b);
    blue.style.background = createGradient("blue", r, g, b);

    applyColorStyles(elements, RGB);
  }, 100);

  // 🔧 Sync functions
  const syncSliders = () => {
    redText.value = red.value;
    greenText.value = green.value;
    blueText.value = blue.value;
    updateColors();
  };

  const syncInputs = () => {
    red.value = redText.value;
    green.value = greenText.value;
    blue.value = blueText.value;
    updateColors();
  };

  // 🎯 Attach listeners
  [red, green, blue].forEach((input) => input.addEventListener("input", syncSliders));
  [redText, greenText, blueText].forEach((input) => input.addEventListener("input", syncInputs));

  // 🎨 Set initial color if provided
  if (initialColor) {
    red.value = redText.value = initialColor.r.toString();
    green.value = greenText.value = initialColor.g.toString();
    blue.value = blueText.value = initialColor.b.toString();
    applyColorStyles(elements, `rgb(${initialColor.r},${initialColor.g},${initialColor.b})`);
  }

  updateColors();
  return container;
};
