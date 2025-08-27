
import RgbElementPICKER  from "../COLORPICKER-ELEMENTS/ColorPickerLogic/RGB-COLOR-PICKER"
import CMYKELEMENTPICKER  from "../COLORPICKER-ELEMENTS/ColorPickerLogic/CMYK-COLOR-PICKER"
import HSLELEMENTPICKER  from "../COLORPICKER-ELEMENTS/ColorPickerLogic/HSL-COLOR-PICKER"
import type { PickerProps, ColorPickerObject } from "../../types/ColorPickerTypes"
import type { AnyColor, HSL, RGB } from "../../types/ColorTypes"
import {ColorConverter} from "../Utilities/ColorConverter"
import "./main.css"
import HslObject from "../COLORPICKER-ELEMENTS/ColorPickerLogic/HSL-COLOR-PICKER"
import RgbObject from "../COLORPICKER-ELEMENTS/ColorPickerLogic/RGB-COLOR-PICKER"
import CmykObjct from "../COLORPICKER-ELEMENTS/ColorPickerLogic/CMYK-COLOR-PICKER"



type PickerType = "HSL" | "RGB" | "CMYK"  | string ;

interface PickerOptions {
  colorPickerContainer: HTMLElement;
  pickerId : string;
  colorPickerProps : PickerProps
}

export default class COLORPICKERCLASS {

  private colorPickerContainer: HTMLElement;
  private colorPickerElement! : HslObject | RgbObject | CmykObjct;
  private activePicker: PickerType = "HSL";
  private colorPickerProps: PickerProps;
  private activeSelection! : HTMLElement;
  private sections!  : HTMLElement;
  private options! : NodeListOf<HTMLLIElement>;
  private activeSection! : HTMLElement ;
  private pickerId : string ;
  
                    
  
  constructor({ colorPickerContainer,pickerId, colorPickerProps }: PickerOptions) {
    this.colorPickerContainer = colorPickerContainer;
    this.pickerId = pickerId
    this.colorPickerProps = colorPickerProps;

    this.loadPicker();
    

  }


  private setPickerElement() {
    switch(this.activePicker){
      case "HSL" :
      this.colorPickerElement = new  HslObject({
    targetElementProps: {
      targetElement: this.colorPickerProps.targetElementProps.targetElement, 
      targetStylePorperty: this.colorPickerProps.targetElementProps.targetStylePorperty   
    }})  
    break
   case "RGB" :
      this.colorPickerElement = new  RgbObject({
    targetElementProps: {
      targetElement: this.colorPickerProps.targetElementProps.targetElement, 
      targetStylePorperty: this.colorPickerProps.targetElementProps.targetStylePorperty   
    }})
  break
  case "CMYK" :
      this.colorPickerElement = new  CmykObjct({
    targetElementProps: {
      targetElement: this.colorPickerProps.targetElementProps.targetElement, 
      targetStylePorperty: this.colorPickerProps.targetElementProps.targetStylePorperty   
    }})
    break
    default :
    throw new Error("Invalid color picker selection") 
  }
  }


  private loadPicker(): void {
    // Safely remove old picker
    if (
      this.colorPickerElement?.getHtmlContent() && 
      this.colorPickerContainer.contains(this.colorPickerElement.getHtmlContent())
    ) {
      console.log("We are here for some reason", this.pickerId)
      this.killEventListeners();
      this.colorPickerContainer.removeChild(this.colorPickerElement.getHtmlContent());

    }

      
    this.setPickerElement();

    console.log(this.activePicker)
    console.log(this.colorPickerElement?.getHtmlContent())
    console.log(this.pickerId)
    
    if (this.colorPickerElement?.getHtmlContent()) {
      console.log("do we?" ,this.pickerId)
      this.profileColorPicker()
      this.initializePicker();
      this.colorPickerContainer.appendChild(this.colorPickerElement.getHtmlContent())
    }else{
      console.log("Omooo")
    }
  }


  


  public setExternalColor(color: any): void {
    this.colorPickerElement.setExternalColor(color)
  }

  
  


  
  


  private profileColorPicker() {
     if (this.colorPickerElement?.getHtmlContent() && this.colorPickerElement.getHtmlContent() !== null) {  
      this.activeSelection = this.colorPickerElement?.getHtmlContent().querySelector('.activeSelection')!;
      this.sections = this.colorPickerElement?.getHtmlContent().querySelector('.sections')!;
      this.options  = this.colorPickerElement?.getHtmlContent().querySelectorAll('.option')!
      this.activeSection = this.colorPickerElement?.getHtmlContent().querySelector('.activeSection')!;

      console.log(this.activeSelection,this.sections,this.options,this.activeSection)
    }
  }


private initializePicker() {
     if (this.colorPickerElement?.getHtmlContent() && this.colorPickerElement.getHtmlContent() !== null){  
        
      // settting the inner text
      this.activeSelection.innerText = this.activePicker
                          
    this.activeSection.addEventListener('click', (event) =>{

      console.log("They are clicking me o")
                      this.sections.classList.add('active')
                      event.stopPropagation()});           
                            
                            
                  document.addEventListener('click',(event) =>  this.handleElementCLickOutside(event))

                  
                  this.options.forEach(option =>{
                    option.addEventListener('click',() => this.handleColorPickerSwitch(option))})


    }else{
      throw new Error("No color Picker Element Prodived")
    }
}


  private getCurrentValues  () : AnyColor {

    if (this.colorPickerElement?.getHtmlContent() && this.colorPickerElement.getHtmlContent() !== null) { 
    return this.colorPickerElement.getCurrentColor();
    }else {
    throw new Error("NO Color picker element provided")}}


  
private killEventListeners() {
 this.activeSection.removeEventListener('click', () =>{console.log("We removed acvie setions lisener too")});




 document.removeEventListener('click', () =>  { console.log("We removed this one too")})
 this.options.forEach((option) =>
      option.removeEventListener("click", () => {console.log("Succeccs?")}))
}







private  handleElementCLickOutside(event : any) {                 
if (this.sections.classList.contains('active') && event.target !== this.activeSection) {
  this.sections.classList.remove('active')}}


  private  handleColorPickerSwitch(option : HTMLLIElement) {
                  
                    const color = this.getCurrentValues();
                    const newElement  =  option.getAttribute("value")!
                    let finalColor : AnyColor; 
                    
                    console.log( "color gotten from the reader" , color)
                    if(newElement === "CMYK"){
                      finalColor = ColorConverter.toCMYK(color)
                      console.log("switching to Cmyk", finalColor)
                      }else if(newElement === "RGB"){
                        finalColor = ColorConverter.toRGB(color)
                        console.log("switching to rgb", finalColor)
                      }else{

                        
                        finalColor = ColorConverter.toHSL(color);
                        console.log("switching to hsl", finalColor)
                      }
                      console.log("the new element ", newElement)
                        this.activePicker = newElement
                        
                    this.loadPicker()
                    this.colorPickerElement.setExternalColor(finalColor)
                    this.sections.classList.remove('active');}




}
