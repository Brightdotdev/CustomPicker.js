import ExtraOptionsContent from "../ComponentGenerators/ExtraOptionsElement"
import RgbContent from "../ComponentGenerators/RgbHtmlContent"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"

import type {RGB , AnyColor} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps,ColorPickerObject } from "../../../types/ColorPickerTypes"
import CssElement from "../ComponentGenerators/ColorPickerCssGenerator"


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


    
    private static readonly STYLE_ID = 'brightdotdev-color-picker-styles';
    private static stylesInjected = false;



    private  disbouceUpdateUi : () => void = debounce(this.updateUI,1000);
    
        constructor({colorPickerContainer,  targetElementProps} : PickerProps ){
             
    
            this.colorPickerContainer = colorPickerContainer
            this.targetElementProps = targetElementProps

            this.injectStyles()
            this.ProfilePicker()
         
            this.loadPicker();
            
            this.disbouceUpdateUi();
           

        }



       private injectStyles(): void {
        // Skip if styles already injected
        if (RgbObject.stylesInjected) return;
        
        // Check if we're in a browser environment
        if (typeof document === 'undefined') {
            console.warn('Color Picker: Document not available (SSR environment)');
            return;
        }

        try {
            const style = document.createElement('style');
            style.id = RgbObject.STYLE_ID;
            style.textContent = this.initializeCss();

            // Remove existing styles if any (cleanup)
            const existing = document.getElementById(RgbObject.STYLE_ID);
            if (existing) {
                existing.remove();
            }

            // Inject into DOM
            document.head.appendChild(style);
            
            // Mark as injected (static so all instances know)
            RgbObject.stylesInjected = true;
            
            
        } catch (error) {
            console.error('Failed to inject Color Picker styles:', error);
        }
    }

private initializeCss() : string {
  return CssElement
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
    RgbHtmlContent.classList.add("brightdotdev-colorPickers")
    
ExtraOptionsElements.classList.add("brightdotdev-extraOptions")

RgbHtmlContent.innerHTML = RgbContent
ExtraOptionsElements.innerHTML = ExtraOptionsContent
RgbHtmlContent.appendChild(ExtraOptionsElements)
return  RgbHtmlContent
}



    
    public setExternalColor (externalColor : AnyColor) {
      
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

      
      
      this.red = this.RgbElement.querySelector<HTMLInputElement>("#red")!;
      this.redText = this.RgbElement.querySelector<HTMLInputElement>("#redText")!;
      this.green = this.RgbElement.querySelector<HTMLInputElement>("#green")!;
      this.greenText = this.RgbElement.querySelector<HTMLInputElement>("#greenText")!;
      this.blue = this.RgbElement.querySelector<HTMLInputElement>("#blue")!;
      this.blueText = this.RgbElement.querySelector<HTMLInputElement>("#blueText")!;

      
      this.colorDisplay = this.RgbElement.querySelector<HTMLDivElement>(".brightdotdev-preview")!;
      this.eyeDropperButton = this.RgbElement.querySelector<HTMLDivElement>(".brightdotdev-eyeDropperDiv")!;
      this.copyButton = this.RgbElement.querySelector<HTMLDivElement>(".brightdotdev-copyDiv")!;
      this.activeSelection = this.RgbElement.querySelector<HTMLElement>('.brightdotdev-activeSelection')!;
      
    }


    


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
    
      const color  = await pickColorWithEyeDropper()
          if(color === null) return
    
          const {r,g,b} =  ColorConverter.hexToRgb(color || "#000000")
    
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
        return
        }else{
         return alert("Unable to Coppy color code to clipboard")

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
