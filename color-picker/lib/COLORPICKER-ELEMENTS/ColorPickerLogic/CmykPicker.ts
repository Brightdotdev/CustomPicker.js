import CmykHtmlContent from "../HtmlGnenrators/CmykHtmlContent"
import ExtraOptionsElements from "../HtmlGnenrators/ExtraOptionsElement"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce} from "../../Utilities/MicroFunctionalities"
import "../main.css"


import type {RGB ,CMYK} from "../../../types/ColorTypes"

type targetElementPorps = {
    targetElement : HTMLElement[] | HTMLElement | NodeListOf<HTMLDivElement> ,
    targetStylePorperty : "text" | "background"
}


interface PickerProps {
    colorPickerContainer? : HTMLElement;
    targetColorElements : targetElementPorps ;
    initialColor?: CMYK | null
} 



const CMYKELEMENTPICKER = ({colorPickerContainer,  targetColorElements,initialColor} : PickerProps ) : HTMLDivElement | void => {

let CmykElement : HTMLDivElement = CmykHtmlContent
CmykElement.appendChild(ExtraOptionsElements)

  const cyan = CmykElement.querySelector<HTMLInputElement>("#cyan")!;
  const cyanText = CmykElement.querySelector<HTMLInputElement>("#cyanText")!;
  const magenta = CmykElement.querySelector<HTMLInputElement>("#magenta")!;
  const magentaText = CmykElement.querySelector<HTMLInputElement>("#magentaText")!;
  const yellow = CmykElement.querySelector<HTMLInputElement>("#yellow")!;
  const yellowText = CmykElement.querySelector<HTMLInputElement>("#yellowText")!;
  const black = CmykElement.querySelector<HTMLInputElement>("#black")!;
  const blackText = CmykElement.querySelector<HTMLInputElement>("#blackText")!;
  const colorDisplay = CmykElement.querySelector<HTMLDivElement>(".preview")!;
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

  const handleTargetElementUpdate = (cmykUpdate: CMYK) => {
  // Normalize targetColorElements into a proper array of elements
  const elements = 
    targetColorElements.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(targetColorElements.targetElement)     // Convert NodeList to array
      : Array.isArray(targetColorElements.targetElement)  // If already an array, keep as is
        ? targetColorElements.targetElement
        : [targetColorElements.targetElement];            // Wrap single element into an array

  // Loop over each element and apply styles
  elements.forEach(el => {
    // Convert CMYK to RGB
    const rgb = ColorConverter.cmykToRgb(cmykUpdate);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    // Apply text color if element has "text" class, else apply background
    if (targetColorElements.targetStylePorperty === "text") {
      el.style.setProperty("color", rgbStr, "important");
    } else {
      el.style.setProperty("background", rgbStr, "important");
    }
  });
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

   
    cyan.style.background = cmykGradients("cyan", c, m, y, k);
    magenta.style.background = cmykGradients("magenta", c, m, y, k);
    yellow.style.background = cmykGradients("yellow", c, m, y, k);
    black.style.background = cmykGradients("black", c, m, y, k);

    
    handleTargetElementUpdate({c,m,y,k})

    // Update slider gradients

    CmykElement.style.boxShadow = `0 0 .5rem ${hex}`;
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
 
    handleTargetElementUpdate(initialColor)
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

  
  updateUI();

   colorPickerContainer !== undefined ? colorPickerContainer.appendChild(CmykElement) : CmykElement;
}

export default CMYKELEMENTPICKER