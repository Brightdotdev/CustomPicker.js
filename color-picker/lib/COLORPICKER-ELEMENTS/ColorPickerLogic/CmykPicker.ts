import CmykHtmlContent from "../HtmlGnenrators/CmykHtmlContent"
import ExtraOptionsElements from "../HtmlGnenrators/ExtraOptionsElement"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"
import "../main.css"


import type {RGB ,CMYK} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps,CmykElements, ColorPickerExport } from "../../../types/ColorPickerTypes"


// Libaries



/* 
Profile Cmyk Element

*/

const ProfileCmykElements =(CmykElement : HTMLDivElement) : CmykElements  =>{
    
  const cyan = CmykElement.querySelector<HTMLInputElement>("#cyan")!;
  const cyanText = CmykElement.querySelector<HTMLInputElement>("#cyanText")!;
  const magenta = CmykElement.querySelector<HTMLInputElement>("#magenta")!;
  const magentaText = CmykElement.querySelector<HTMLInputElement>("#magentaText")!;
  const yellow = CmykElement.querySelector<HTMLInputElement>("#yellow")!;
  const yellowText = CmykElement.querySelector<HTMLInputElement>("#yellowText")!;
  const black = CmykElement.querySelector<HTMLInputElement>("#black")!;
  const blackText = CmykElement.querySelector<HTMLInputElement>("#blackText")!;
  const colorDisplay = CmykElement.querySelector<HTMLDivElement>(".preview")!;
  const eyeDropperButton = CmykElement.querySelector<HTMLDivElement>(".eyeDropperDiv")!;
  const copyButton = CmykElement.querySelector<HTMLDivElement>(".copyDiv")!;


  return {
    cyan ,
    magenta ,
    yellow,
    black,
    cyanText,
    magentaText,
    yellowText,
    blackText,
    colorDisplay,
    CmykElement,
    eyeDropperButton,
    copyButton
} 
}


/**
   * Generates gradient for a slider based on its channel.
   */
  const generateCmykGradients = (channel: string, c: number, m: number, y: number, k: number): string => {
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





const HandleUiUpdate = (colorUpdate : CMYK , targetColorElement : targetElementPorps , cmykElements : CmykElements  ) => {
   
    const colorNames = new NTC();
    const {cyan, magenta,yellow,black, colorDisplay , CmykElement} = cmykElements

    const c = colorUpdate.c / 100;
    const m = colorUpdate.m / 100;
    const y = colorUpdate.y / 100;
    const k = colorUpdate.k / 100;

    const CMYK = { c, m, y, k };
    
    const hex = ColorConverter.cmykToHex(CMYK);
    const name = colorNames.getColorName(hex);

    // Update preview
    colorDisplay.innerHTML = `<span style="background: white; color: #333; padding: 10px; border-radius: 15px;">${name}</span>`;
    colorDisplay.style.background = hex;
   
    cyan.style.background = generateCmykGradients("cyan", c, m, y, k);
    magenta.style.background = generateCmykGradients("magenta", c, m, y, k);
    yellow.style.background = generateCmykGradients("yellow", c, m, y, k);
    black.style.background = generateCmykGradients("black", c, m, y, k);

    
    handleTargetElementUpdate(targetColorElement, {c,m,y,k})

    // Update slider gradients

    CmykElement.style.boxShadow = `0 0 .5rem ${hex}`;
}



  const handleTargetElementUpdate = (targetColorElement : targetElementPorps,cmykUpdate : CMYK ) => {
  // Normalize targetElements into a proper array of elements
  const elements = 
    targetColorElement.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(targetColorElement.targetElement)     // Convert NodeList to array
      : Array.isArray(targetColorElement.targetElement)  // If already an array, keep as is
        ? targetColorElement.targetElement
        : [targetColorElement.targetElement];            // Wrap single element into an array

  // Loop over each element and apply styles
  elements.forEach(el => {
    // Convert CMYK to RGB
    const rgb = ColorConverter.cmykToRgb(cmykUpdate);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    // Apply text color if element has "text" class, else apply background
    if (targetColorElement.targetStylePorperty === "text") {
      el.style.setProperty("color", rgbStr, "important");
    } else {
      el.style.setProperty("background", rgbStr, "important");
    }
  });
};




const CMYKELEMENTPICKER = ({colorPickerContainer,  targetElements} : PickerProps ) : ColorPickerExport<CMYK> => {

let CmykElement : HTMLDivElement = CmykHtmlContent
CmykElement.appendChild(ExtraOptionsElements)

const cmykElements = ProfileCmykElements(CmykElement)

const  {
    cyan ,
    magenta ,
    yellow,
    black,
    cyanText,
    magentaText,
    yellowText,
    blackText,
   eyeDropperButton,
    copyButton,
} = cmykElements

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

  const handleEyeDropper = async () => {
    const color  = await pickColorWithEyeDropper()
    console.log(color);
    const cmykColor = ColorConverter.hexToCmyk(color || "#000000") 
    console.log(cmykColor)
     cyan.value = cmykColor.c.toString();
        cyanText.value = cmykColor.c.toString();

         magenta.value = cmykColor.m.toString();
        magentaText.value = cmykColor.m.toString();

          yellow.value = cmykColor.y.toString();
              yellowText.value = cmykColor.y.toString();

            black.value = cmykColor.k.toString();
        blackText.value = cmykColor.k.toString();
        HandleUiUpdate(cmykColor,targetElements,cmykElements);
    
  }
  const handleColorCopy = async () => {
 
    
        const color = `cmyk(${cyanText.value}%, ${magentaText.value}%, ${yellowText.value}%, ${blackText.value}%)`
        const isCopied =  await copyToClipboard(color)

        if(isCopied){
           console.log(color)
            return console.log("Success")
        }else{
            console.log("omo")
        }
        
    
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


  eyeDropperButton.addEventListener("click", handleEyeDropper);
  copyButton.addEventListener("click", handleColorCopy);





  /**
   * Main update function - updates preview color and gradients.
   */
  const updateUI = debounce(() => {

    const colorUpdate : CMYK =  {c:  +cyan.value ,m : +magenta.value, y: +yellow.value, k : +black.value};
        HandleUiUpdate(colorUpdate,targetElements,
    cmykElements);
    
}, 100);


updateUI();

  const setExternalColor = (externalColor : CMYK) => {
    console.log("We made it here")
    console.log(externalColor)
    if(externalColor){
        cyan.value = externalColor.c.toString();
        cyanText.value = externalColor.c.toString();

         magenta.value = externalColor.m.toString();
        magentaText.value = externalColor.m.toString();

          yellow.value = externalColor.y.toString();
              yellowText.value = externalColor.y.toString();

            black.value = externalColor.k.toString();
        blackText.value = externalColor.k.toString();
        HandleUiUpdate(externalColor,targetElements,cmykElements);
    
    }}



  if (colorPickerContainer) {
    colorPickerContainer.appendChild(CmykElement); // Append to DOM
  }

  

return {

    ColorPickerElement :CmykElement,
    setExternalColor

}


}

export default CMYKELEMENTPICKER