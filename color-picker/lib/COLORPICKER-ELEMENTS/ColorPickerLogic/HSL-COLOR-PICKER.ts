import ExtraOptionsContent from "../HtmlGnenrators/ExtraOptionsElement"
import HslContent from "../HtmlGnenrators/HslHtmlContent"
import {NTC} from "../../Utilities/ColorName"
import {ColorConverter} from "../../Utilities/ColorConverter"
import {debounce, pickColorWithEyeDropper,copyToClipboard} from "../../Utilities/MicroFunctionalities"
import "../main.css"

import type { HSL, AnyColor} from "../../../types/ColorTypes"
import type {targetElementPorps ,PickerProps ,ColorPickerObject } from "../../../types/ColorPickerTypes"


export default class HslObject  implements ColorPickerObject<HSL> {
    private colorPickerContainer! : PickerProps["colorPickerContainer"]
    private  targetElementProps! :  targetElementPorps
    private HslElement : HTMLDivElement =  this.initializeContent();;
    private hue! : HTMLInputElement;
    private hueText! : HTMLInputElement;
    private saturation! : HTMLInputElement;
    private saturationText! : HTMLInputElement;
    private lightness! : HTMLInputElement;
    private lightnessText! : HTMLInputElement;
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
    this.colorPickerContainer.appendChild(this.HslElement); // Append to DOM
  }

this. hue.addEventListener("input", this.syncSlidersToText);
this.saturation.addEventListener("input", this.syncSlidersToText);
this.  lightness.addEventListener("input",this. syncSlidersToText);

this.hueText.addEventListener("input",this.syncTextToSliders);
this.saturationText.addEventListener("input",this.syncTextToSliders);
this.lightnessText.addEventListener("input",this.syncTextToSliders);



this.eyeDropperButton.addEventListener("click", this.handleEyeDropper);
this.copyButton.addEventListener("click", this.handleColorCopy);

this.activeSelection.innerText = "HSL"
this.updateUI()
}




    public getHtmlContent ()  : HTMLDivElement{
      return  this.HslElement}




    private initializeContent ()  : HTMLDivElement{
     const HslHtmlContent = document.createElement('div');
     const ExtraOptionsElements = document.createElement("div")
     HslHtmlContent.id = 'hsl';
     HslHtmlContent.classList.add("hslPicker", "colorPickers")
    HslHtmlContent.classList.add("cmykPicker", "colorPickers");


ExtraOptionsElements.classList.add("extraOptions")

HslHtmlContent.innerHTML = HslContent
ExtraOptionsElements.innerHTML = ExtraOptionsContent

HslHtmlContent.appendChild(ExtraOptionsElements)
return HslHtmlContent
}

public destroyPicker(){

this.hue.removeEventListener ("input", this.syncSlidersToText);
this.saturation.removeEventListener ("input", this.syncSlidersToText);
this.lightness.removeEventListener("input",this. syncSlidersToText);


this.hueText.removeEventListener("input",this.syncTextToSliders);
this.saturationText.removeEventListener ("input",this.syncTextToSliders);
this.lightnessText.removeEventListener("input",this.syncTextToSliders);
this.eyeDropperButton.removeEventListener("click", this.handleEyeDropper);
this.copyButton.removeEventListener("click", this.handleColorCopy);


    if (this.colorPickerContainer) {
    this.colorPickerContainer.removeChild(this.HslElement); // Append to DOM
  }


}

    
    public setExternalColor (externalColor : AnyColor) {
         console.log("We made it here", externalColor)
         const convertedColor = ColorConverter.toHSL(externalColor)
         const {h,s,l} = convertedColor

    if(externalColor && convertedColor){
        this.hue.value = h.toString();
        this.hueText.value = h.toString();

        this.saturation.value = s.toString();
        this.saturationText.value = s.toString();

            this.lightness.value = l.toString();
            this.lightnessText.value = l.toString();

    
            
    
        this.HandleUiUpdate(convertedColor);
    }
    }

    private ProfilePicker =() : void =>{
      this.activeSelection = this.HslElement.querySelector<HTMLElement>('.activeSelection')!;
        
      this.hue = this.HslElement.querySelector<HTMLInputElement>("#hue")!;
      this.hueText = this.HslElement.querySelector<HTMLInputElement>("#hueText")!;
      this.saturation = this.HslElement.querySelector<HTMLInputElement>("#saturation")!;
      this.saturationText = this.HslElement.querySelector<HTMLInputElement>("#saturationText")!;
      this.lightness = this.HslElement.querySelector<HTMLInputElement>("#lightness")!;
      this.lightnessText = this.HslElement.querySelector<HTMLInputElement>("#lightnessText")!;
        this.colorDisplay = this.HslElement.querySelector<HTMLDivElement>(".preview")!;
      this.eyeDropperButton = this.HslElement.querySelector<HTMLDivElement>(".eyeDropperDiv")!;
      this.copyButton = this.HslElement.querySelector<HTMLDivElement>(".copyDiv")!;}


    


      private  HandleUiUpdate = (colorUpdate : HSL) => {

        const colorNames = new NTC();
      
        const {h,s,l} = colorUpdate
        
        const hslColor = `hsl(${h}, ${s}%, ${l}%)`;
        const hslToHex = ColorConverter.hslToHex(colorUpdate);
        const name =  colorNames.getColorName(hslToHex);
        // Update slider backgrounds dynamically
        this.saturation.style.background = `linear-gradient(to right, 
          hsl(${h}, 0%, ${l}%),
          hsl(${h}, 100%, ${l}%))`;
    
        this.lightness.style.background = `linear-gradient(to right, 
          hsl(${h}, ${s}%, 0%),
          hsl(${h}, ${s}%, 50%))`;
    
        // Update preview
       this.colorDisplay.innerHTML = `<span style="background: white; color: #333; padding: 10px; border-radius: 15px;">${name}</span>`;
       this.colorDisplay.style.background = hslColor;
       
    
        
        
        this.handleTargetElementUpdate(colorUpdate);
      
        if (l > 80 || s > 80) {
          this.HslElement.style.boxShadow = `0 0 .5rem black`;
        } else {
          this.HslElement.style.boxShadow = `0 0 .5rem ${hslColor}`;
        }
      }




    public getCurrentColor ()  : HSL{
        
      return {
          h : +this.hue.value,
          s : +this.saturation.value,
          l : +this.lightness.value}
}



      private handleTargetElementUpdate({h,s,l}: HSL ){
   const elements = 
    this.targetElementProps.targetElement instanceof NodeList // Check if it's a NodeList
      ? Array.from(this.targetElementProps.targetElement)     // Convert NodeList to array
      : Array.isArray(this.targetElementProps.targetElement)  // If already an array, keep as is
        ? this.targetElementProps.targetElement
        : [this.targetElementProps.targetElement];            // Wrap single element into an array

  // Loop over each element and apply styles
  elements.forEach(el => {
    // Convert HSL to RGB
    const rgb = ColorConverter.hslToRgb({h,s,l});
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
    this.hueText.value = this.hue.value;
    this.saturationText.value = this.saturation.value;
    this.lightnessText.value = this.lightness.value;
    this.updateUI();
  };        
    private syncTextToSliders = () => {
    this.hue.value = this.hueText.value;
    this.saturation.value = this.saturationText.value;
    this.lightness.value = this.lightnessText.value;
    this.updateUI();
  };



  private handleEyeDropper = async () => {
      console.log("We are doing this in hsl")
      const color  = await pickColorWithEyeDropper()
          if(color === null) return
    
          const {h,s,l} =  ColorConverter.hexToHsl(color || "#000000")
      console.log("color converted from the cymk stuff" , {h,s,l})
        this.hue.value = h.toString();
          this.hueText.value = h.toString();
  
          this.saturation.value = s.toString();
          this.saturationText.value = s.toString();
  
            this.lightness.value = l.toString();
             this.lightnessText.value = l.toString();

          this.HandleUiUpdate({h,s,l}); 
    }

    
  private handleColorCopy = async () => {
            const color = `hsl(${this.hueText.value}, ${this.saturationText.value}%, ${this.lightnessText.value}%)`
        const isCopied =  await copyToClipboard(color)

        if(isCopied){
           console.log(color)
            return console.log("Success")
        }else{
            console.log("omo")
        }
        
    
    
  }



    private updateUI() : void {
        
            const colorUpdate : HSL =  {h:  +this.hue.value ,s: +this.saturation.value, l: +this.lightness.value};
          this.HandleUiUpdate(colorUpdate);

    }


}
