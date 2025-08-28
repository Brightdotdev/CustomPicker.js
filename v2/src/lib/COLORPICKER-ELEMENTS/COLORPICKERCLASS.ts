import type { PickerProps } from "../../types/ColorPickerTypes"
import type { AnyColor } from "../../types/ColorTypes"
import { ColorConverter } from "../Utilities/ColorConverter"
import "./main.css"
import HslObject from "../COLORPICKER-ELEMENTS/ColorPickerLogic/HSL-COLOR-PICKER"
import RgbObject from "../COLORPICKER-ELEMENTS/ColorPickerLogic/RGB-COLOR-PICKER"
import CmykObject from "../COLORPICKER-ELEMENTS/ColorPickerLogic/CMYK-COLOR-PICKER"

type PickerType = "HSL" | "RGB" | "CMYK"

interface PickerOptions {
  colorPickerContainer: HTMLElement;
  
  colorPickerProps: PickerProps
}

// Factory pattern for picker creation
class PickerFactory {
  static createPicker(
    type: PickerType,
    targetElementProps: PickerProps['targetElementProps']
  ): HslObject | RgbObject | CmykObject {
    switch (type) {
      case "HSL":
        return new HslObject({ targetElementProps });
      case "RGB":
        return new RgbObject({ targetElementProps });
      case "CMYK":
        return new CmykObject({ targetElementProps });
      default:
        throw new Error(`Invalid color picker type: ${type}`);
    }
  }
}

// Type guard for PickerType
function isPickerType(value: string): value is PickerType {
  return ["HSL", "RGB", "CMYK"].includes(value);
}

export default class COLORPICKERCLASS {
  private colorPickerContainer: HTMLElement;
  private colorPickerElement!: HslObject | RgbObject | CmykObject;
  private activePicker: PickerType = "HSL";
  private colorPickerProps: PickerProps;
  private activeSelection!: HTMLElement;
  private sections!: HTMLElement;
  private options!: NodeListOf<HTMLLIElement>;
  private activeSection!: HTMLElement;
  

  // Bound event handlers for proper cleanup
  private boundHandleColorPickerSwitch: (option: HTMLLIElement) => void;
  private boundAddSectionClassName: (e: MouseEvent) => void;
  private boundHandleClickOutside: (e: MouseEvent) => void;

  constructor({ colorPickerContainer,  colorPickerProps }: PickerOptions) {
    this.colorPickerContainer = colorPickerContainer;
    this.colorPickerProps = colorPickerProps;

    // Bind event handlers
    this.boundHandleColorPickerSwitch = this.handleColorPickerSwitch.bind(this);
    this.boundAddSectionClassName = this.addSectionClassName.bind(this);
    this.boundHandleClickOutside = this.handleElementCLickOutside.bind(this);

    this.loadPicker();
  }

  private setPickerElement(): void {
    this.colorPickerElement = PickerFactory.createPicker(
      this.activePicker,
      this.colorPickerProps.targetElementProps
    );
  }

  private loadPicker(): void {
    // Safely remove old picker if it exists
    this.destroyPicker();

    this.setPickerElement();

    const htmlContent = this.colorPickerElement?.getHtmlContent();
    if (!htmlContent) {
      console.error("Failed to create color picker element");
      return;
    }

    this.profileColorPicker();
    this.initializePicker();
    this.colorPickerContainer.appendChild(htmlContent);
  }

  public setExternalColor(color: AnyColor): void {
    try {
      this.colorPickerElement.setExternalColor(color);
    } catch (error) {
      console.error("Failed to set external color:", error);
    }
  }

  private profileColorPicker(): void {
    const htmlContent = this.colorPickerElement.getHtmlContent();
    if (!htmlContent) {
      throw new Error("No color picker HTML content available");
    }

    this.activeSelection = htmlContent.querySelector('.activeSelection')!;
    this.sections = htmlContent.querySelector('.sections')!;
    this.options = htmlContent.querySelectorAll('.option')!;
    this.activeSection = htmlContent.querySelector('.activeSection')!;

    // Validate that all required elements were found
    if (!this.activeSelection || !this.sections || !this.activeSection || this.options.length === 0) {
      throw new Error("Required DOM elements not found in color picker");
    }
  }

  private initializePicker(): void {
    // Set the inner text
    this.activeSelection.textContent = this.activePicker;

    // Add event listeners
    this.activeSection.addEventListener('click', this.boundAddSectionClassName);
    document.addEventListener('click', this.boundHandleClickOutside);

    this.options.forEach(option => {
      option.addEventListener('click', () => this.boundHandleColorPickerSwitch(option));
    });
  }

  private getCurrentValues(): AnyColor {
    if (!this.colorPickerElement) {
      throw new Error("No color picker element provided");
    }
    
    try {
      return this.colorPickerElement.getCurrentColor();
    } catch (error) {
      console.error("Failed to get current color values:", error);
      // Return a default color as fallback
      return { h: 0, s: 0, l: 0 }; // Default HSL
    }
  }

  private addSectionClassName(event: MouseEvent): void {
    this.sections.classList.add('active');
    event.stopPropagation();
  }

  public destroyPicker(): void {
    // Only destroy if we have an active picker
    if (!this.colorPickerElement) return;

    // Remove event listeners
    if (this.activeSection) {
      this.activeSection.removeEventListener('click', this.boundAddSectionClassName);
    }
    
    document.removeEventListener('click', this.boundHandleClickOutside);

    if (this.options) {
      this.options.forEach(option => {
        option.removeEventListener('click', () => this.boundHandleColorPickerSwitch(option));
      });
    }

    // Destroy the picker and remove from DOM
    try {
      const htmlContent = this.colorPickerElement.getHtmlContent();
      if (htmlContent && this.colorPickerContainer.contains(htmlContent)) {
        this.colorPickerContainer.removeChild(htmlContent);
      }
      this.colorPickerElement.destroyPicker();
    } catch (error) {
      console.error("Error during picker destruction:", error);
    }
  }

  private handleElementCLickOutside(event: MouseEvent): void {
    if (this.sections?.classList.contains('active') && 
        event.target !== this.activeSection && 
        !this.sections.contains(event.target as Node)) {
      this.sections.classList.remove('active');
    }
  }

  private handleColorPickerSwitch(option: HTMLLIElement): void {
    const newElement = option.getAttribute("value");
    
    if (!newElement || !isPickerType(newElement)) {
      console.error("Invalid or missing value attribute:", newElement);
      return;
    }

    try {
      const currentColor = this.getCurrentValues();
      let finalColor: AnyColor;

      // Convert current color to the new color space
      switch (newElement) {
        case "CMYK":
          finalColor = ColorConverter.toCMYK(currentColor);
          break;
        case "RGB":
          finalColor = ColorConverter.toRGB(currentColor);
          break;
        case "HSL":
          finalColor = ColorConverter.toHSL(currentColor);
          break;
        default:
          finalColor = currentColor;
      }

      this.activePicker = newElement;
      this.loadPicker();
      this.colorPickerElement.setExternalColor(finalColor);
      
      if (this.sections) {
        this.sections.classList.remove("active");
      }
    } catch (error) {
      console.error("Failed to switch color picker:", error);
    }
  }

  // Cleanup method to call when the component is no longer needed
  public dispose(): void {
    this.destroyPicker();
    // Remove any other resources here
  }
}