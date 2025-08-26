import RgbHtmlContent from "../HtmlGnenrators/RgbHtmlContent"
import ExtraOptionsElements from "../HtmlGnenrators/ExtraOptionsElement"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"
import "../main.css"


import type {RGB} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps,RgbElements, ColorPickerExport } from "../../../types/ColorPickerTypes"



// Libaries



/* 
Profile RGB Element

*/

const ProfileRgbElements =(RgbElement : HTMLDivElement) : RgbElements  =>{
    
    
  const red = RgbElement.querySelector<HTMLInputElement>("#red")!;
  const green = RgbElement.querySelector<HTMLInputElement>("#green")!;
  const blue = RgbElement.querySelector<HTMLInputElement>("#blue")!;
  const redText = RgbElement.querySelector<HTMLInputElement>("#redText")!;
  const greenText = RgbElement.querySelector<HTMLInputElement>("#greenText")!;
  const blueText = RgbElement.querySelector<HTMLInputElement>("#blueText")!;
  
  const colorDisplay = RgbElement.querySelector<HTMLDivElement>(".preview")!;
  const eyeDropperButton = RgbElement.querySelector<HTMLDivElement>(".eyeDropperDiv")!;
  const copyButton = RgbElement.querySelector<HTMLDivElement>(".copyDiv")!;


  return {
    red ,
    green ,
    blue,
    
    redText,
    greenText,
    blueText,

    colorDisplay,
    RgbElement,
    eyeDropperButton,
    copyButton
} 
}




  const handleTargetElementUpdate = (targetColorElement : targetElementPorps,rgbUpdate : RGB ) => {
  // Normalize targetElements into a proper array of elements
  const elements = 
    targetColorElement.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(targetColorElement.targetElement)     // Convert NodeList to array
      : Array.isArray(targetColorElement.targetElement)  // If already an array, keep as is
        ? targetColorElement.targetElement
        : [targetColorElement.targetElement];            // Wrap single element into an array

  // Loop over each element and apply styles
  elements.forEach(el => {
    // Convert RGB to RGB
    
    const rgbStr = `rgb(${rgbUpdate.r}, ${rgbUpdate.g}, ${rgbUpdate.b})`;

    // Apply text color if element has "text" class, else apply background
    if (targetColorElement.targetStylePorperty === "text") {
      el.style.setProperty("color", rgbStr, "important");
    } else {
      el.style.setProperty("background", rgbStr, "important");
    }
  });
};



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



const HandleUiUpdate = (colorUpdate : RGB , targetColorElement : targetElementPorps , RgbElements : RgbElements  ) => {
   
    const colorNames = new NTC();
    const {red, green,blue , colorDisplay , RgbElement} = RgbElements
    const {r,g,b} = colorUpdate

     const RGB = `rgb(${r},${g},${b})`;
     const hex = ColorConverter.rgbToHex({r, g, b});
     const colorName = colorNames.getColorName(hex);
 
     colorDisplay.innerHTML = `<span style="background: white; color:hsl(0,0%,20%); padding:10px; border-radius:15px;">${colorName}</span>`;
     colorDisplay.style.background = RGB;
     RgbElement.style.boxShadow = `0 0 .5rem ${RGB}`;
 
     red.style.background = createGradient("red", r, g, b);
     green.style.background = createGradient("green", r, g, b);
     blue.style.background = createGradient("blue", r, g, b);
     handleTargetElementUpdate(targetColorElement, colorUpdate);
}







const RgbElementPICKER = ({colorPickerContainer,  targetElements} : PickerProps ) : ColorPickerExport<RGB> => {

let RgbElement : HTMLDivElement = RgbHtmlContent
RgbElement.appendChild(ExtraOptionsElements)

const RgbElements = ProfileRgbElements(RgbElement)

const  {
    red ,
    green ,
    blue,
    
    redText,
    greenText,
    blueText,  
    eyeDropperButton,
    copyButton,
} = RgbElements

    /**
   * Updates text fields when sliders move.
   */
  const syncSlidersToText = () => {
    redText.value = red.value;
    greenText.value = green.value;
    blueText.value = blue.value;
    updateUI();
  };

  /**
   * Updates sliders when text fields change.
   */
  const syncTextToSliders = () => {
    red.value = redText.value;
    green.value = greenText.value;
    blue.value = blueText.value;
    
    updateUI();
  };

  const handleEyeDropper = async () => {
    const color  = await pickColorWithEyeDropper()
    console.log(color);
    const rgbColor = ColorConverter.hexToRgb(color || "#000000") 
    console.log(rgbColor)
     red.value = rgbColor.r.toString();
        redText.value = rgbColor.r.toString();

         green.value = rgbColor.g.toString();
        greenText.value = rgbColor.g.toString();

          blue.value = rgbColor.b.toString();
              blueText.value = rgbColor.b.toString();

              HandleUiUpdate(rgbColor,targetElements,RgbElements);
    
  }
  const handleColorCopy = async () => {
 
    
    const color = `rgb(${redText.value}, ${greenText.value}, ${blueText.value})`
        const isCopied =  await copyToClipboard(color)

        if(isCopied){
           console.log(color)
            return console.log("Success")
        }else{
            console.log("omo")
        }
        
    
  }


  // Event listeners
  red.addEventListener("input", syncSlidersToText);
  green.addEventListener("input", syncSlidersToText);
  blue.addEventListener("input", syncSlidersToText);

  
  redText.addEventListener("input", syncTextToSliders);
  green.addEventListener("input", syncTextToSliders);
  blue.addEventListener("input", syncTextToSliders);
  

  eyeDropperButton.addEventListener("click", handleEyeDropper);
  copyButton.addEventListener("click", handleColorCopy);





  /**
   * Main update function - updates preview color and gradients.
   */
  const updateUI = debounce(() => {

    const colorUpdate : RGB =  {r:  +red.value ,g: +green.value, b: +blue.value};
        HandleUiUpdate(colorUpdate,targetElements,
    RgbElements);
}, 100);


updateUI();

  const setExternalColor = (externalColor : RGB) => {
    if(externalColor){
        red.value = externalColor.r.toString();
        redText.value = externalColor.r.toString();

         green.value = externalColor.g.toString();
        greenText.value = externalColor.g.toString();

          blue.value = externalColor.b.toString();
              blueText.value = externalColor.b.toString();

              HandleUiUpdate(externalColor,targetElements,RgbElements);
    
    }}


  if (colorPickerContainer) {
    colorPickerContainer.appendChild(RgbElement); // Append to DOM
  }


  

return {

    ColorPickerElement :  RgbElement,
    setExternalColor

}


}

export default RgbElementPICKER