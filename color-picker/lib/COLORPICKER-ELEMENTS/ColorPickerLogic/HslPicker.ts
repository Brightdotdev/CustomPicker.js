import HslHtmlContent from "../HtmlGnenrators/HslHtmlContent"
import ExtraOptionsElements from "../HtmlGnenrators/ExtraOptionsElement"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"


import type {HSL} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps,HslElements, ColorPickerExport } from "../../../types/ColorPickerTypes"



// Libaries



/* 
Profile hsl Element

*/

const ProfileHslElements =(HslElement : HTMLDivElement) : HslElements  =>{
    
  const hue = HslElement.querySelector<HTMLInputElement>("#hue")!;
  const hueText = HslElement.querySelector<HTMLInputElement>("#hueText")!;
  const saturation = HslElement.querySelector<HTMLInputElement>("#saturation")!;
  const saturationText = HslElement.querySelector<HTMLInputElement>("#saturationText")!;
  const lightness = HslElement.querySelector<HTMLInputElement>("#lightness")!;
  const lightnessText = HslElement.querySelector<HTMLInputElement>("#lightnessText")!;
  
  const colorDisplay = HslElement.querySelector<HTMLDivElement>(".preview")!;
  const eyeDropperButton = HslElement.querySelector<HTMLDivElement>(".eyeDropperDiv")!;
  const copyButton = HslElement.querySelector<HTMLDivElement>(".copyDiv")!;


  return {
    hue ,
    saturation ,
    lightness,
    
    hueText,
    saturationText,
    lightnessText,

    colorDisplay,
    HslElement,
    eyeDropperButton,
    copyButton
} 
}




  const handleTargetElementUpdate = (targetColorElement : targetElementPorps,hslUpdate : HSL ) => {
  // Normalize targetColorElements into a proper array of elements
  const elements = 
    targetColorElement.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(targetColorElement.targetElement)     // Convert NodeList to array
      : Array.isArray(targetColorElement.targetElement)  // If already an array, keep as is
        ? targetColorElement.targetElement
        : [targetColorElement.targetElement];            // Wrap single element into an array

  // Loop over each element and apply styles
  elements.forEach(el => {
    // Convert HSL to RGB
    const rgb = ColorConverter.hslToRgb(hslUpdate);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    // Apply text color if element has "text" class, else apply background
    if (targetColorElement.targetStylePorperty === "text") {
      el.style.setProperty("color", rgbStr, "important");
    } else {
      el.style.setProperty("background", rgbStr, "important");
    }
  });
};


const HandleUiUpdate = (colorUpdate : HSL , targetColorElement : targetElementPorps , HslElements : HslElements  ) => {
   
    const colorNames = new NTC();
    const { saturation,lightness , colorDisplay , HslElement} = HslElements
    const {h,s,l} = colorUpdate
    
    const hslColor = `hsl(${h}, ${s}%, ${l}%)`;
    const hslToHex = ColorConverter.hslToHex(colorUpdate);
    const name =  colorNames.getColorName(hslToHex);
    // Update slider backgrounds dynamically
    saturation.style.background = `linear-gradient(to right, 
      hsl(${h}, 0%, ${l}%),
      hsl(${h}, 100%, ${l}%))`;

    lightness.style.background = `linear-gradient(to right, 
      hsl(${h}, ${s}%, 0%),
      hsl(${h}, ${s}%, 50%))`;

    // Update preview
    colorDisplay.innerHTML = `<span style="background: white; color: #333; padding: 10px; border-radius: 15px;">${name}</span>`;
    colorDisplay.style.background = hslColor;
   

    
    
    handleTargetElementUpdate(targetColorElement, colorUpdate);
  
    if (l > 80 || s > 80) {
      HslElement.style.boxShadow = `0 0 .5rem black`;
    } else {
      HslElement.style.boxShadow = `0 0 .5rem ${hslColor}`;
    }
}







const HSLELEMENTPPICKER = ({colorPickerContainer,  targetColorElements} : PickerProps ) : ColorPickerExport<HSL> => {

const HslElement : HTMLDivElement = HslHtmlContent
HslElement.appendChild(ExtraOptionsElements)

const HslElements = ProfileHslElements(HslElement)

const  {
    hue ,
    saturation ,
    lightness,
    
    hueText,
    saturationText,
    lightnessText,  
    eyeDropperButton,
    copyButton,
} = HslElements

    /**
   * Updates text fields when sliders move.
   */
  const syncSlidersToText = () => {
    hueText.value = hue.value;
    saturationText.value = saturation.value;
    lightnessText.value = lightness.value;
    updateUI();
  };

  /**
   * Updates sliders when text fields change.
   */
  const syncTextToSliders = () => {
    hue.value = hueText.value;
    saturation.value = saturationText.value;
    lightness.value = lightnessText.value;
    updateUI();
  };

  const handleEyeDropper = async () => {
    const color  = await pickColorWithEyeDropper()
    console.log(color);
    const hslColor = ColorConverter.hexToHsl(color || "#000000") 
    console.log(hslColor)
     hue.value = hslColor.h.toString();
        hueText.value = hslColor.h.toString();

         saturation.value = hslColor.s.toString();
        saturationText.value = hslColor.s.toString();

          lightness.value = hslColor.l.toString();
              lightnessText.value = hslColor.l.toString();

              HandleUiUpdate(hslColor,targetColorElements,HslElements);
    
  }

  
  const handleColorCopy = async () => {
    
            const color = `hsl(${hueText.value}%, ${saturationText.value}%, ${lightnessText.value}%)`
        const isCopied =  await copyToClipboard(color)

        if(isCopied){
           console.log(color)
            return console.log("Success")
        }else{
            console.log("omo")
        }
        
    
  }


  // Event listeners
  hue.addEventListener("input", syncSlidersToText);
  saturation.addEventListener("input", syncSlidersToText);
  lightness.addEventListener("input", syncSlidersToText);

  
  hueText.addEventListener("input", syncTextToSliders);
  saturation.addEventListener("input", syncTextToSliders);
  lightness.addEventListener("input", syncTextToSliders);
  

  eyeDropperButton.addEventListener("click", handleEyeDropper);
  copyButton.addEventListener("click", handleColorCopy);





  /**
   * Main update function - updates preview color and gradients.
   */
  const updateUI = debounce(() => {

    const colorUpdate : HSL =  {h:  +hue.value ,s: +saturation.value, l: +lightness.value};
        HandleUiUpdate(colorUpdate,targetColorElements,
    HslElements);
}, 100);


updateUI();

  const setExternalColor = (externalColor : HSL) => {
    if(externalColor){
        hue.value = externalColor.h.toString();
        hueText.value = externalColor.h.toString();

         saturation.value = externalColor.s.toString();
        saturationText.value = externalColor.s.toString();

          lightness.value = externalColor.l.toString();
              lightnessText.value = externalColor.l.toString();

              HandleUiUpdate(externalColor,targetColorElements,HslElements);
    
    }}




  

return {

    ColorPickerElement :  colorPickerContainer !== undefined ? colorPickerContainer.appendChild(HslElement) : HslElement,
    setExternalColor

}


}

export default HSLELEMENTPPICKER