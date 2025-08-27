import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { CMYKPicker } from "./CMYK";
import { HsLPicker } from "./HSL";
import { RgbPicker } from "./RGB";

type PickerType = "HSL" | "RGB" | "CMYK";

interface PickerOptions {
  colorPickerContainer: HTMLElement;
  targetElements: HTMLElement | HTMLElement[];
  pickerId?: string;
  contrastDiv?: HTMLElement[];
}
export class ColorPicker {
  private colorPickerContainer: HTMLElement;
  private targetElements: HTMLElement[];
  private pickerId?: string;
  private contrastDiv?: HTMLElement[];
  private activePicker: PickerType = "RGB";
  private currentPicker!: HTMLDivElement;
  private selectedValues: any = {};

  constructor({ colorPickerContainer, targetElements, pickerId, contrastDiv } : PickerOptions) {
    this.colorPickerContainer = colorPickerContainer;
   this.targetElements = Array.isArray(targetElements) ? targetElements : [targetElements];
    this.pickerId = pickerId;
    this.contrastDiv = contrastDiv;

    this.loadPicker(this.activePicker);
  }

 private loadPicker(type: PickerType, values?: any): void {
  this.activePicker = type;
  if (this.currentPicker) this.colorPickerContainer.removeChild(this.currentPicker);

  switch (type) {
    case "HSL":
      this.currentPicker = HsLPicker(values, this.targetElements);
      break;
    case "RGB":
      this.currentPicker = RgbPicker(values, this.targetElements);
      break;
    case "CMYK":
      this.currentPicker = CMYKPicker(values, this.targetElements);
      break;
  }

  this.colorPickerContainer.appendChild(this.currentPicker);
  this.initEvents();
  this.updateColors();
}

  /** Syncs and updates the preview */
  private updateColors() {
    const values = this.getCurrentValues();
    this.selectedValues = values;

    const colorName = new NTC().getColorName(this.toHex(values));
    this.updatePreview(colorName, values);
  }

  /** Reads current input slider values */
  private getCurrentValues() {
    if (this.activePicker === "HSL") {
      return {
        h: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#hue")!.value),
        s: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#saturation")!.value),
        l: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#lightness")!.value),
      };
    }
    if (this.activePicker === "RGB") {
      return {
        r: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#red")!.value),
        g: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#green")!.value),
        b: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#blue")!.value),
      };
    }
    if (this.activePicker === "CMYK") {
      return {
        c: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#cyan")!.value) / 100,
        m: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#magenta")!.value) / 100,
        y: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#yellow")!.value) / 100,
        k: parseInt(this.currentPicker.querySelector<HTMLInputElement>("#black")!.value) / 100,
      };
    }
    return {};
  }

  /** Converts any color object to HEX */
  private toHex(values: any): string {
    if (this.activePicker === "HSL") {
      const rgb = ColorConverter.hslToRgb(values);
      return this.rgbToHex(rgb);
    }
    if (this.activePicker === "CMYK") {
      const rgb = ColorConverter.cmykToRgb(values);
      return this.rgbToHex(rgb);
    }
    return this.rgbToHex(values);
  }

  /** Convert RGB object to HEX */
  private rgbToHex(rgb: { r: number; g: number; b: number }): string {
    return (
      "#" +
      [rgb.r, rgb.g, rgb.b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  /** Update preview UI */
  private updatePreview(name: string, values: any) {
    const preview = this.currentPicker.querySelector(".preview") as HTMLElement;
    const rgb =
      this.activePicker === "RGB"
        ? values
        : this.activePicker === "HSL"
        ? ColorConverter.hslToRgb(values)
        : ColorConverter.cmykToRgb(values);

    preview.style.background = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    preview.innerHTML = `<span style="background:white;padding:5px;border-radius:8px">${name}</span>`;
  }

  /** Add input event listeners */
  private initEvents() {
    this.currentPicker.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => this.updateColors());
    });
  }

  /** Public method to switch picker type */
  public switchPicker(type: PickerType) {
    this.loadPicker(type, this.selectedValues);
  }
}
