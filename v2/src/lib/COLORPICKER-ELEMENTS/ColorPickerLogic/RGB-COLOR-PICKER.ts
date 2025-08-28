import ExtraOptionsContent from "../HtmlGnenrators/ExtraOptionsElement"
import RgbContent from "../HtmlGnenrators/RgbHtmlContent"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"
import "../main.css"

import type {RGB , AnyColor} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps,ColorPickerObject } from "../../../types/ColorPickerTypes"


export default class RgbObject implements ColorPickerObject<RGB>  {
    private colorPickerContainer! : PickerProps["colorPickerContainer"]
    private  targetElementProps! :  targetElementPorps
    private RgbElement : HTMLDivElement = this.initializeContent();
    private red! : HTMLInputElement;
    private redText! : HTMLInputElement;
    private green! : HTMLInputElement;
    private greenText! : HTMLInputElement;
    private blue! : HTMLInputElement;
    private blueText! : HTMLInputElement;
    private eyeDropperButton! : HTMLDivElement;
    private colorDisplay! : HTMLDivElement;
    private activeSelection! : HTMLElement;
    private copyButton! : HTMLDivElement;
    private  disbouceUpdateUi : () => void = debounce(this.updateUI,1000);
    
        constructor({colorPickerContainer,  targetElementProps} : PickerProps ){
             
    
            this.colorPickerContainer = colorPickerContainer
            this.targetElementProps = targetElementProps
         
            this.ProfilePicker()
         
            this.loadPicker();
            
            this.disbouceUpdateUi();
           

        }






private loadPicker(){
  if (this.colorPickerContainer) {
    this.colorPickerContainer.appendChild(this.RgbElement); // Append to DOM
  }

this. red.addEventListener("input", this.syncSlidersToText);
this.green.addEventListener("input", this.syncSlidersToText);
this.blue.addEventListener("input",this. syncSlidersToText);

this.redText.addEventListener("input",this.syncTextToSliders);
this.greenText.addEventListener("input",this.syncTextToSliders);
this.blueText.addEventListener("input",this.syncTextToSliders);



this.eyeDropperButton.addEventListener("click", this.handleEyeDropper);
this.copyButton.addEventListener("click", this.handleColorCopy);
this.activeSelection.innerText = "RGB"

this.updateUI()
}




    public getHtmlContent ()  : HTMLDivElement{
    return this.RgbElement;
}

    private initializeContent ()  : HTMLDivElement{
        
        
const RgbHtmlContent = document.createElement('div');
const ExtraOptionsElements = document.createElement("div")
    RgbHtmlContent.id = 'rgb'; 
    RgbHtmlContent.classList.add("rgbPicker", "colorPickers")
RgbHtmlContent.classList.add("RGBPicker", "colorPickers");
ExtraOptionsElements.classList.add("extraOptions")

RgbHtmlContent.innerHTML = RgbContent
ExtraOptionsElements.innerHTML = ExtraOptionsContent
RgbHtmlContent.appendChild(ExtraOptionsElements)
return  RgbHtmlContent
}



    
    public setExternalColor (externalColor : AnyColor) {
         console.log("We made it here", externalColor)
         const convertedColor = ColorConverter.toRGB(externalColor)
         const {r,g,b} = convertedColor

    if(externalColor && convertedColor){
        this.red.value = r.toString();
        this.redText.value = r.toString();

        this.green.value = g.toString();
        this.greenText.value = g.toString();

        this.blue.value = b.toString();
        this.blueText.value = b.toString();
        this.HandleUiUpdate(convertedColor);
    }
    }

    private ProfilePicker =() : void =>{

      
      this.activeSelection = this.RgbElement.querySelector<HTMLElement>('.activeSelection')!;

      this.red = this.RgbElement.querySelector<HTMLInputElement>("#red")!;
      this.redText = this.RgbElement.querySelector<HTMLInputElement>("#redText")!;
      this.green = this.RgbElement.querySelector<HTMLInputElement>("#green")!;
      this.greenText = this.RgbElement.querySelector<HTMLInputElement>("#greenText")!;
      this.blue = this.RgbElement.querySelector<HTMLInputElement>("#blue")!;
      this.blueText = this.RgbElement.querySelector<HTMLInputElement>("#blueText")!;
      this.colorDisplay = this.RgbElement.querySelector<HTMLDivElement>(".preview")!;
      this.eyeDropperButton = this.RgbElement.querySelector<HTMLDivElement>(".eyeDropperDiv")!;
      this.copyButton = this.RgbElement.querySelector<HTMLDivElement>(".copyDiv")!;}


    


      private  HandleUiUpdate = (colorUpdate : RGB) => {
           const colorNames = new NTC();

           const {r,g,b} = colorUpdate
       
            const RGB = `rgb(${r},${g},${b})`;
            const hex = ColorConverter.rgbToHex({r, g, b});
            const colorName = colorNames.getColorName(hex);
        
            this.colorDisplay.innerHTML = `<span style="background: white; color:hsl(0,0%,20%); padding:10px; border-radius:15px;">${colorName}</span>`;
            this.colorDisplay.style.background = RGB;
            this.RgbElement.style.boxShadow = `0 0 .5rem ${RGB}`;
        
            this.red.style.background = this.generateRGBGradients("red", r, g, b);
            this.green.style.background = this.generateRGBGradients("green", r, g, b);
            this.blue.style.background = this.generateRGBGradients("blue", r, g, b);
            this.handleTargetElementUpdate(colorUpdate);
      }



      


    private  generateRGBGradients = (channel: "red" | "green" | "blue", r: number, g: number, b: number): string => {
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



public destroyPicker(){

this. red.removeEventListener ("input", this.syncSlidersToText);
this.green.removeEventListener ("input", this.syncSlidersToText);
this.  blue.removeEventListener("input",this. syncSlidersToText);

this.redText.removeEventListener("input",this.syncTextToSliders);
this.greenText.removeEventListener ("input",this.syncTextToSliders);
this.blueText.removeEventListener("input",this.syncTextToSliders);
this.eyeDropperButton.removeEventListener("click", this.handleEyeDropper);
this.copyButton.removeEventListener("click", this.handleColorCopy);

    if (this.colorPickerContainer) {
    this.colorPickerContainer.removeChild(this.RgbElement); // Append to DOM
  }


}



      private handleTargetElementUpdate({r,g,b}: RGB ){
    const elements = 
    this.targetElementProps.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(this.targetElementProps.targetElement)     // Convert NodeList to array
      : Array.isArray(this.targetElementProps.targetElement)  // If already an array, keep as is
        ? this.targetElementProps.targetElement
        : [this.targetElementProps.targetElement];            // Wrap single element into an array

        elements.forEach(el => {
    
    const rgbStr = `rgb(${r}, ${g}, ${b})`;

    if (this.targetElementProps.targetStylePorperty === "text") {
      el.style.setProperty("color", rgbStr, "important");
    } else {
      el.style.setProperty("background", rgbStr, "important");
    }
  });
}



     private syncSlidersToText = () => {
    this.redText.value = this.red.value;
    this.greenText.value = this.green.value;
    this.blueText.value = this.blue.value;
    
    this.updateUI();
  };    
  
  
    private syncTextToSliders = () => {
    this.red.value = this.redText.value;
    this.green.value = this.greenText.value;
    this.blue.value = this.blueText.value;
    this.updateUI();
  };



  private handleEyeDropper = async () => {
      console.log("We are doing this in RGB")
      const color  = await pickColorWithEyeDropper()
          if(color === null) return
    
          const {r,g,b} =  ColorConverter.hexToRgb(color || "#000000")
      console.log("color converted from the cymk stuff" , {r,g,b})
        this.red.value = r.toString();
          this.redText.value = r.toString();
  
          this.green.value = g.toString();
          this.greenText.value = g.toString();

            this.blue.value = b.toString();
             this.blueText.value = b.toString();
          this.HandleUiUpdate({r,g,b}); 
    }

    
  private handleColorCopy = async () => {
   
    const color = `rgb(${this.redText.value}, ${this.greenText.value}, ${this.blueText.value})`
        const isCopied =  await copyToClipboard(color)

        if(isCopied){
           console.log(color)
            return console.log("Success")
        }else{
            console.log("omo")
        }
        
  }


    public getCurrentColor ()  : RGB{
        
      return {
          r : +this.red.value,
          g : +this.green.value,
          b : +this.blue.value}
}

    private updateUI() : void {
    
    const colorUpdate : RGB =  {r:  +this.red.value ,g: +this.green.value, b: +this.blue.value};
      this.HandleUiUpdate(colorUpdate);
    ;}


}
