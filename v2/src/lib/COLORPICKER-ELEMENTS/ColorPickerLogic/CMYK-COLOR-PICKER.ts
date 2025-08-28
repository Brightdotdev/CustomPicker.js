import ExtraOptionsContent from "../HtmlGnenrators/ExtraOptionsElement"
import CmykContent from "../HtmlGnenrators/CmykHtmlContent"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"
import "../main.css"

import type {RGB ,CMYK, AnyColor} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps, ColorPickerObject } from "../../../types/ColorPickerTypes"






export default class CmykObject  implements ColorPickerObject<CMYK> {
    private colorPickerContainer! : PickerProps["colorPickerContainer"]
    private  targetElementProps! :  targetElementPorps
    private CmykElement : HTMLDivElement = this.initializeContent();
    private cyan! : HTMLInputElement;
    private cyanText! : HTMLInputElement;
    private magenta! : HTMLInputElement;
    private magentaText! : HTMLInputElement;
    private yellow! : HTMLInputElement;
    private yellowText! : HTMLInputElement;
    private black! : HTMLInputElement;
    private blackText! : HTMLInputElement;
    private eyeDropperButton! : HTMLDivElement;
    private colorDisplay! : HTMLDivElement;
    private activeSelection! : HTMLElement;
    private copyButton! : HTMLDivElement;
    private  disbouceUpdateUi : () => void = debounce(this.updateUI,1000);
    
        constructor({colorPickerContainer,  targetElementProps} : PickerProps ){
             
    
            this.colorPickerContainer = colorPickerContainer
            this.targetElementProps = targetElementProps
         
            this.profilePicker()
         
            this.loadPicker();
            
            this.disbouceUpdateUi();
           

        }






private loadPicker(){
  if (this.colorPickerContainer) {
    this.colorPickerContainer.appendChild(this.CmykElement); // Append to DOM
  }

this. cyan.addEventListener("input", this.syncSlidersToText);
this.magenta.addEventListener("input", this.syncSlidersToText);
this.  yellow.addEventListener("input",this. syncSlidersToText);
this. black.addEventListener("input", this.syncSlidersToText);

this.cyanText.addEventListener("input",this.syncTextToSliders);
this.magentaText.addEventListener("input",this.syncTextToSliders);
this.yellowText.addEventListener("input",this.syncTextToSliders);
this.blackText.addEventListener("input",this. syncTextToSliders);


this.eyeDropperButton.addEventListener("click", this.handleEyeDropper);
this.copyButton.addEventListener("click", this.handleColorCopy);
this.activeSelection.innerText = "CMYK"

this.updateUI()
}




public destroyPicker(){

this. cyan.removeEventListener ("input", this.syncSlidersToText);
this.magenta.removeEventListener ("input", this.syncSlidersToText);
this.  yellow.removeEventListener("input",this. syncSlidersToText);
this. black.removeEventListener("input", this.syncSlidersToText);

this.cyanText.removeEventListener("input",this.syncTextToSliders);
this.magentaText.removeEventListener ("input",this.syncTextToSliders);
this.yellowText.removeEventListener("input",this.syncTextToSliders);
this.blackText.removeEventListener ("input",this. syncTextToSliders);


this.eyeDropperButton.removeEventListener("click", this.handleEyeDropper);
this.copyButton.removeEventListener("click", this.handleColorCopy);
this.activeSelection.innerText = "CMYK"

    if (this.colorPickerContainer) {
    this.colorPickerContainer.removeChild(this.CmykElement); // Append to DOM
  }


}


    public getHtmlContent ()  : HTMLDivElement{
      return this.CmykElement;
}


    private initializeContent ()  : HTMLDivElement{
        
const CmykHtmlContent  = document.createElement('div');
const ExtraOptionsElements = document.createElement("div")
CmykHtmlContent.id = 'cmyk';

CmykHtmlContent.classList.add("cmykPicker", "colorPickers");
ExtraOptionsElements.classList.add("extraOptions")

CmykHtmlContent.innerHTML = CmykContent
ExtraOptionsElements.innerHTML = ExtraOptionsContent
CmykHtmlContent.appendChild(ExtraOptionsElements)
return  CmykHtmlContent
}


    public getCurrentColor ()  : CMYK{
        
      return {
          c : +this.cyan.value,
          m : +this.magenta.value,
          y : +this.yellow.value,
          k : +this.black.value,
        }
}





    
    public setExternalColor (externalColor : AnyColor) :void {
         console.log("We made it here", externalColor)
         const convertedColor = ColorConverter.toCMYK(externalColor)
         const {c,m,y,k} = convertedColor

    if(externalColor && convertedColor){
        this.cyan.value = c.toString();
        this.cyanText.value = c.toString();

        this.magenta.value = m.toString();
        this.magentaText.value = m.toString();

            this.yellow.value = y.toString();
            this.yellowText.value = y.toString();

            this.black.value = k.toString();
            this.blackText.value = k.toString();
    
        this.HandleUiUpdate(convertedColor);
    }
    }

    private profilePicker =() : void =>{

      
      this.activeSelection = this.CmykElement.querySelector<HTMLElement>('.activeSelection')!;

      this.cyan = this.CmykElement.querySelector<HTMLInputElement>("#cyan")!;
      this.cyanText = this.CmykElement.querySelector<HTMLInputElement>("#cyanText")!;
      this.magenta = this.CmykElement.querySelector<HTMLInputElement>("#magenta")!;
      this.magentaText = this.CmykElement.querySelector<HTMLInputElement>("#magentaText")!;
      this.yellow = this.CmykElement.querySelector<HTMLInputElement>("#yellow")!;
      this.yellowText = this.CmykElement.querySelector<HTMLInputElement>("#yellowText")!;
      this.black = this.CmykElement.querySelector<HTMLInputElement>("#black")!;
      this.blackText = this.CmykElement.querySelector<HTMLInputElement>("#blackText")!;
      this.colorDisplay = this.CmykElement.querySelector<HTMLDivElement>(".preview")!;
      this.eyeDropperButton = this.CmykElement.querySelector<HTMLDivElement>(".eyeDropperDiv")!;
      this.copyButton = this.CmykElement.querySelector<HTMLDivElement>(".copyDiv")!;}


    


      private  HandleUiUpdate = (colorUpdate : CMYK) => {

          const colorNames = new NTC();
          
          const   { c, m, y, k } : CMYK = colorUpdate;

          console.log("The cmyk we are generating the gradient for " ,{ c, m, y, k })
          
          const hex = ColorConverter.cmykToHex(colorUpdate);
          console.log("cmyk hex", hex)
          const name = colorNames.getColorName(hex);
      
          // Update preview
          this.colorDisplay.innerHTML = `<span style="background: white; color: #333; padding: 10px; border-radius: 15px;">${name}</span>`;
          this.colorDisplay.style.background = hex;
         
          this.cyan.style.background = this.generateGradients("cyan", c, m, y, k);
          this.magenta.style.background = this.generateGradients("magenta", c, m, y, k);
          this.yellow.style.background = this.generateGradients("yellow", c, m, y, k);
          this.black.style.background = this.generateGradients("black", c, m, y, k);
      
          
          this.handleTargetElementUpdate({c,m,y,k})  
          this.CmykElement.style.boxShadow = `0 0 .5rem ${hex}`;
      }



      


    private  generateGradients = (channel: string, c: number, m: number, y: number, k: number): string => {
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





      private handleTargetElementUpdate({c,m,y,k}: CMYK ){
    const elements = 
    this.targetElementProps.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(this.targetElementProps.targetElement)     // Convert NodeList to array
      : Array.isArray(this.targetElementProps.targetElement)  // If already an array, keep as is
        ? this.targetElementProps.targetElement
        : [this.targetElementProps.targetElement];            // Wrap single element into an array

  // Loop over each element and apply styles
  elements.forEach(el => {
    // Convert CMYK to RGB
    const rgb = ColorConverter.cmykToRgb({c,m,y,k});
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    // Apply text color if element has "text" class, else apply background
    if (this.targetElementProps.targetStylePorperty === "text") {
      el.style.setProperty("color", rgbStr, "important");
    } else {
      el.style.setProperty("background", rgbStr, "important");
    }
  });
}

     private syncSlidersToText = () => {
    this.cyanText.value = this.cyan.value;
    this.magentaText.value = this.magenta.value;
    this.yellowText.value = this.yellow.value;
    this.blackText.value = this.black.value;
    this.updateUI();
  };        
    private syncTextToSliders = () => {
    this.cyan.value = this.cyanText.value;
    this.magenta.value = this.magentaText.value;
    this.yellow.value = this.yellowText.value;
    this.black.value = this.blackText.value;
    this.updateUI();
  };



  private handleEyeDropper = async () => {
      console.log("We are doing this in cmyk")
      const color  = await pickColorWithEyeDropper()
          if(color === null) return
    
          const {c,m,y,k} =  ColorConverter.hexToCmyk(color || "#000000")
      console.log("color converted from the cymk stuff" , {c,m,y,k})
        this.cyan.value = c.toString();
          this.cyanText.value = c.toString();
  
          this.magenta.value = m.toString();
          this.magentaText.value = m.toString();
  
            this.yellow.value = y.toString();
             this.yellowText.value = y.toString();
  
            this.black.value = k.toString();
          this.blackText.value = k.toString();
          this.HandleUiUpdate({c,m,y,k}); 
    }

    
  private handleColorCopy = async () => {
        const color = `cmyk(${this.cyanText.value}%, ${this.magentaText.value}%, ${this.yellowText.value}%, ${this.blackText.value}%)`

        const isCopied =  await copyToClipboard(color)

        if(isCopied){
              console.log(color)
            return console.log("Success")
        }else{
            console.log("omo")
        }
        
    
  }



    private updateUI() : void {
      
        

    const colorUpdate : CMYK =  {c:  +this.cyan.value ,m : +this.magenta.value, y: +this.yellow.value, k : +this.black.value};
        this.HandleUiUpdate(colorUpdate);}


}
