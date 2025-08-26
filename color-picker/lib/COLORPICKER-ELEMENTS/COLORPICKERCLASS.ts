
import RgbElementPICKER  from "../COLORPICKER-ELEMENTS/ColorPickerLogic/RgbPicker"
import CMYKELEMENTPICKER  from "../COLORPICKER-ELEMENTS/ColorPickerLogic/CmykPicker"
import HSLELEMENTPICKER  from "../COLORPICKER-ELEMENTS/ColorPickerLogic/HslPicker"
import type { PickerProps, ColorPickerExport } from "../../types/ColorPickerTypes"
import type { AnyColor} from "../../types/ColorTypes"
import {ColorConverter} from "../Utilities/ColorConverter"



type PickerType = "HSL" | "RGB" | "CMYK";

interface PickerOptions {
  colorPickerContainer: HTMLElement;
  colorPickerProps : PickerProps
}

export default class COLORPICKERCLASS {
  private colorPickerContainer: HTMLElement;
  private activePicker: PickerType = "CMYK";
  private activePickerElement!: ColorPickerExport<any>; // full object
  private colorPickerProps: PickerProps;
  
  constructor({ colorPickerContainer, colorPickerProps }: PickerOptions) {
    this.colorPickerContainer = colorPickerContainer;
    this.colorPickerProps = colorPickerProps;

    this.loadPicker();
  }

  private loadPicker(): void {
    // Safely remove old picker
    if (
      this.activePickerElement?.ColorPickerElement && 
      this.colorPickerContainer.contains(this.activePickerElement.ColorPickerElement)
    ) {
      this.colorPickerContainer.removeChild(this.activePickerElement.ColorPickerElement);
    }

    // Choose picker and store the full object
    switch (this.activePicker) {
      case "HSL":
        this.activePickerElement = HSLELEMENTPICKER(this.colorPickerProps);
        break;
      case "RGB":
        this.activePickerElement = RgbElementPICKER(this.colorPickerProps);
        break;
      case "CMYK":
        this.activePickerElement = CMYKELEMENTPICKER(this.colorPickerProps);
        break;
    }

    // Append safely if we have a valid element
    if (this.activePickerElement?.ColorPickerElement) {
      this.colorPickerContainer.appendChild(this.activePickerElement.ColorPickerElement);
    }
  }

  // Optional: dynamic picker switching
  public setPicker(type: PickerType): void {
    this.activePicker = type;
    this.loadPicker();
  }

  // Optional: external color setter
  public setExternalColor(color: any): void {
    let finalColor : AnyColor ;
    console.log(color)
    if(this.activePicker === "CMYK"){
        console.log("Cmyk")
        finalColor = ColorConverter.toCMYK(color)
    }else if(this.activePicker === "RGB"){
       finalColor = ColorConverter.toRGB(color)
    }else{
        finalColor = ColorConverter.toHSL(color);
    } 
    this.activePickerElement?.setExternalColor(finalColor);
  }
}
