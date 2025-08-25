

import type { CMYK, HSL, RGB } from "../../types/ColorTypes";
import { ColorConverter } from "../Utilities/ColorConverter";
import { NTC } from "../Utilities/ColorName";
import { colorManagers, debounce } from "../Utilities/MicroFunctionalities";
import { cmykPicker } from "./CMYK";
import { hslPicker } from "./HSL";
import { rgbPicker } from "./RGB";



type ColorValue = RGB | HSL | CMYK;

interface EyeDropperResult {
    sRGBHex: string;
}

interface EyeDropper {
    open(): Promise<EyeDropperResult>;
}

declare global {
    interface Window {
        EyeDropper: new () => EyeDropper;
    }
}

export class ColorPickers {
    private colorPickerContainer: HTMLElement;
    private elementDiv: HTMLElement;
    private contrastDiv: HTMLElement[];
    private activePicker: string;
    private currentPicker: HTMLElement;
    private selectedValues: ColorValue;
    private pickerId?: string;
    private debouncedSelectedColors: () => void;
private sections!: HTMLElement;
private options!: NodeListOf<HTMLElement>;
private activeSection!: HTMLElement;
private activeSelection!: HTMLElement;
private eyeDropper!: HTMLElement;

    constructor(colorPickerContainer: HTMLElement, elementDiv: HTMLElement, pickerId: string, contrastDiv: HTMLElement[]) {
        this.colorPickerContainer = colorPickerContainer;
        this.elementDiv = elementDiv;
        this.contrastDiv = contrastDiv;
        this.activePicker = "HSL";
        this.currentPicker = this.setCurrentPicker(this.activePicker);
        this.colorPickerContainer.appendChild(this.currentPicker);
        this.currentPicker.querySelector('.activeSelection')!.textContent = this.activePicker;
        this.selectedValues = this.getSelectedColor("HSL");
        this.eventListeners();
        this.debouncedSelectedColors = debounce(this.getSelectedColorInit.bind(this), 1000);
        this.debouncedSelectedColors();
        
        if (typeof pickerId === "string") {
            this.pickerId = pickerId;

    
            colorManagers.updateColors(this.pickerId, ColorConverter.toRGB(this.selectedValues));
            this.updateContrast(this.pickerId, this.contrastDiv);
        }
    }

    private getCmykElement(selectedColors: CMYK): HTMLElement {
        return cmykPicker(selectedColors, [this.elementDiv]);
    }

    private getRgbElement(selectedColors: RGB): HTMLElement {
        return rgbPicker(selectedColors, [this.elementDiv]);
    }

    private getHslElement(selectedColors: HSL): HTMLElement {
        return hslPicker(selectedColors, [this.elementDiv]);
    }

    colorPickerStyling(): void {
        console.log("Not done with styling");
    }

    private setCurrentPicker(picker: string, selectedColors?: ColorValue): HTMLElement {
        this.activePicker = picker;
        
        if (picker === "HSL") {
            return this.getHslElement(selectedColors as HSL || { h: 20, s: 100, l: 50 });
        } else if (picker === "RGB") {
            return this.getRgbElement(selectedColors as RGB || { r: 40, g: 90, b: 100 });
        } else if (picker === "CMYK") {
            return this.getCmykElement(selectedColors as CMYK || { c: 20, m: 50, y: 70, k: 30 });
        }
        
        return this.getHslElement({ h: 20, s: 100, l: 50 });
    }

    private getSelectedColor(activeColor: string): ColorValue {
        if (activeColor === "HSL") {
            return {
                h: parseInt((this.currentPicker.querySelector('#hue') as HTMLInputElement).value, 10),
                s: parseInt((this.currentPicker.querySelector('#saturation') as HTMLInputElement).value, 10),
                l: parseInt((this.currentPicker.querySelector('#lightness') as HTMLInputElement).value, 10)
            };
        } else if (activeColor === "RGB") {
            return {
                r: parseInt((this.currentPicker.querySelector('#red') as HTMLInputElement).value, 10),
                g: parseInt((this.currentPicker.querySelector('#green') as HTMLInputElement).value, 10),
                b: parseInt((this.currentPicker.querySelector('#blue') as HTMLInputElement).value, 10)
            };
        } else if (activeColor === "CMYK") {
            return {
                c: parseInt((this.currentPicker.querySelector('#cyan') as HTMLInputElement).value, 10),
                m: parseInt((this.currentPicker.querySelector('#magenta') as HTMLInputElement).value, 10),
                y: parseInt((this.currentPicker.querySelector('#yellow') as HTMLInputElement).value, 10),
                k: parseInt((this.currentPicker.querySelector('#black') as HTMLInputElement).value, 10)
            };
        }
        
        return { h: 20, s: 100, l: 50 };
    }

    private getSelectedColorInit(): void {
        this.currentPicker.querySelectorAll("input").forEach(slider => {
            slider.addEventListener("input", () => {
                let values: RGB;

                const huePicker = this.currentPicker.querySelector('#hue') as HTMLInputElement;
                const saturationPicker = this.currentPicker.querySelector('#saturation') as HTMLInputElement;
                const lightnessPicker = this.currentPicker.querySelector('#lightness') as HTMLInputElement;
                const cyanPicker = this.currentPicker.querySelector('#cyan') as HTMLInputElement;
                const magentaPicker = this.currentPicker.querySelector('#magenta') as HTMLInputElement;
                const yellowPicker = this.currentPicker.querySelector('#yellow') as HTMLInputElement;
                const blackPicker = this.currentPicker.querySelector('#black') as HTMLInputElement;
                const redPicker = this.currentPicker.querySelector('#red') as HTMLInputElement;
                const bluePicker = this.currentPicker.querySelector('#blue') as HTMLInputElement;
                const greenPicker = this.currentPicker.querySelector('#green') as HTMLInputElement;

                if (huePicker && lightnessPicker && saturationPicker) {
                    const hslValues = {
                        h: parseInt(huePicker.value, 10),
                        s: parseInt(saturationPicker.value, 10),
                        l: parseInt(lightnessPicker.value, 10)
                    };
                    values = ColorConverter.hslToRgb(hslValues);
                } else if (cyanPicker && magentaPicker && yellowPicker && blackPicker) {
                    const cmykValues = {
                        c: parseInt(cyanPicker.value, 10),
                        m: parseInt(magentaPicker.value, 10),
                        y: parseInt(yellowPicker.value, 10),
                        k: parseInt(blackPicker.value, 10)
                    };
                    values = ColorConverter.cmykToRgb(cmykValues);
                } else if (redPicker && greenPicker && bluePicker) {
                    values = {
                        r: parseInt(redPicker.value, 10),
                        g: parseInt(greenPicker.value, 10),
                        b: parseInt(bluePicker.value, 10)
                    };
                } else {
                    values = { r: 40, g: 90, b: 100 };
                }

                this.selectedValues = values;
                if (this.pickerId) {
                    colorManagers.updateColors(this.pickerId, this.selectedValues);
                    this.updateContrast(this.pickerId, this.contrastDiv);
                }
            });
        });
    }

    private updateContrast(id: string, contrastDiv: HTMLElement[]): void {
        if (typeof contrastDiv !== "undefined") {
            contrastDiv.forEach(contrasts => {
                if (id === "mainPicker") {
                    contrasts.innerHTML = colorManagers.colorRatio[0].textToMain;
                } else if (id === "accentPicker") {
                    contrasts.innerHTML = colorManagers.colorRatio[0].textToAccent;
                } else if (id === "backgroundPicker") {
                    contrasts.innerHTML = colorManagers.colorRatio[0].textToBg;
                }
            });
        }
    }

    private rgbColorChange(colorChange: ColorValue): void {
        if ('r' in colorChange && 'g' in colorChange && 'b' in colorChange) {
            (this.currentPicker.querySelector('#red') as HTMLInputElement).value = colorChange.r.toString();
            (this.currentPicker.querySelector('#green') as HTMLInputElement).value = colorChange.g.toString();
            (this.currentPicker.querySelector('#blue') as HTMLInputElement).value = colorChange.b.toString();
            (this.currentPicker.querySelector('#redText') as HTMLInputElement).value = colorChange.r.toString();
            (this.currentPicker.querySelector('#greenText') as HTMLInputElement).value = colorChange.g.toString();
            (this.currentPicker.querySelector('#blueText') as HTMLInputElement).value = colorChange.b.toString();
            
            const preview = this.currentPicker.querySelector('.preview') as HTMLElement;
            preview.style.background = `rgb(${colorChange.r}, ${colorChange.g}, ${colorChange.b})`;
            
            const colorName = new NTC().getColorName(ColorConverter.rgbToHex(colorChange));
            preview.innerHTML = `<span style="background: white; color: hsl(0, 0%, 20%); padding: 10px; border-radius: 15px;">${colorName}</span>`;
        } else if ('c' in colorChange && 'm' in colorChange && 'y' in colorChange && 'k' in colorChange) {
            const cmykToRgb = ColorConverter.cmykToRgb(colorChange as CMYK);
            this.rgbColorChange(cmykToRgb);
        } else if ('h' in colorChange && 's' in colorChange && 'l' in colorChange) {
            const hslToRgb = ColorConverter.hslToRgb(colorChange as HSL);
            this.rgbColorChange(hslToRgb);
        }
    }

    private hslColorChange(colorChange: ColorValue): void {
        if ('h' in colorChange && 's' in colorChange && 'l' in colorChange) {
            (this.currentPicker.querySelector('#hue') as HTMLInputElement).value = colorChange.h.toString();
            (this.currentPicker.querySelector('#saturation') as HTMLInputElement).value = colorChange.s.toString();
            (this.currentPicker.querySelector('#lightness') as HTMLInputElement).value = colorChange.l.toString();
            (this.currentPicker.querySelector('#hueText') as HTMLInputElement).value = colorChange.h.toString();
            (this.currentPicker.querySelector('#saturationText') as HTMLInputElement).value = colorChange.s.toString();
            (this.currentPicker.querySelector('#lightnessText') as HTMLInputElement).value = colorChange.l.toString();
            
            const preview = this.currentPicker.querySelector('.preview') as HTMLElement;
            preview.style.background = `hsl(${colorChange.h}, ${colorChange.s}%, ${colorChange.l}%)`;
            
            const colorName = new NTC().getColorName(ColorConverter.hslToHex(colorChange));
            preview.innerHTML = `<span style="background: white; color: hsl(0, 0%, 20%); padding: 10px; border-radius: 15px;">${colorName}</span>`;
        } else if ('r' in colorChange && 'g' in colorChange && 'b' in colorChange) {
            const rgbToHsl = ColorConverter.rgbToHsl(colorChange);
            this.hslColorChange(rgbToHsl);
        } else if ('c' in colorChange && 'm' in colorChange && 'y' in colorChange && 'k' in colorChange) {
            const cmykToHsl = ColorConverter.cmykToHsl(colorChange as CMYK);
            this.hslColorChange(cmykToHsl);
        }
    }

    private cmykColorChange(colorChange: ColorValue): void {
        if ('c' in colorChange && 'm' in colorChange && 'y' in colorChange && 'k' in colorChange) {
            (this.currentPicker.querySelector('#cyan') as HTMLInputElement).value = colorChange.c.toString();
            (this.currentPicker.querySelector('#magenta') as HTMLInputElement).value = colorChange.m.toString();
            (this.currentPicker.querySelector('#yellow') as HTMLInputElement).value = colorChange.y.toString();
            (this.currentPicker.querySelector('#black') as HTMLInputElement).value = colorChange.k.toString();
            (this.currentPicker.querySelector('#cyanText') as HTMLInputElement).value = colorChange.c.toString();
            (this.currentPicker.querySelector('#magentaText') as HTMLInputElement).value = colorChange.m.toString();
            (this.currentPicker.querySelector('#yellowText') as HTMLInputElement).value = colorChange.y.toString();
            (this.currentPicker.querySelector('#blackText') as HTMLInputElement).value = colorChange.k.toString();
            
            const preview = this.currentPicker.querySelector('.preview') as HTMLElement;
            const cmyk2hex = ColorConverter.cmykToHex(colorChange);
            preview.style.background = cmyk2hex;
            
            const colorName = new NTC().getColorName(cmyk2hex);
            preview.innerHTML = `<span style="background: white; color: hsl(0, 0%, 20%); padding: 10px; border-radius: 15px;">${colorName}</span>`;
        } else if ('r' in colorChange && 'g' in colorChange && 'b' in colorChange) {
            const rgbToCmyk = ColorConverter.rgbToCmyk(colorChange as RGB);
            this.cmykColorChange(rgbToCmyk);
        } else if ('h' in colorChange && 's' in colorChange && 'l' in colorChange) {
            const hslToCmyk = ColorConverter.hslToCmyk(colorChange as HSL);
            this.cmykColorChange(hslToCmyk);
        }
    }

    setExternalColor(colorChange: ColorValue): void {
        if (typeof colorChange === "object") {
            if (this.activePicker === "HSL") {
                this.hslColorChange(colorChange);
            } else if (this.activePicker === "RGB") {
                this.rgbColorChange(colorChange);
            } else if (this.activePicker === "CMYK") {
                this.cmykColorChange(colorChange);
            }

            if (this.pickerId) {
                colorManagers.updateColors(this.pickerId, ColorConverter.toRGB(colorChange));
            }
        } else {
            console.log("Invalid data type");
        }
    }

    darkModeInit(): void {
        if (this.pickerId) {
            const selectedColor = this.getSelectedColor(this.activePicker);
            const colorToHsl = ColorConverter.toHSL(selectedColor);
            
            if (this.pickerId === "textPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l + 80));
            } else if (this.pickerId === "accentPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l - 20));
            } else if (this.pickerId === "backgroundPicker" || this.pickerId === "mainPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l - 40));
            } else if (this.pickerId === "secondaryPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l - 30));
            }

            this.setExternalColor(colorToHsl);
            colorManagers.updateColors(this.pickerId, ColorConverter.toRGB(colorToHsl));
            this.updateContrast(this.pickerId, this.contrastDiv);
        }
    }

    lightModeInit(): void {
        if (this.pickerId) {
            const selectedColor = this.getSelectedColor(this.activePicker);
            const colorToHsl = ColorConverter.toHSL(selectedColor);

            if (this.pickerId === "textPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l - 80));
            } else if (this.pickerId === "accentPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l + 20));
            } else if (this.pickerId === "backgroundPicker" || this.pickerId === "mainPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l + 40));
            } else if (this.pickerId === "secondaryPicker") {
                colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l + 30));
            }
            
            this.setExternalColor(colorToHsl);
            colorManagers.updateColors(this.pickerId, ColorConverter.toRGB(colorToHsl));
            this.updateContrast(this.pickerId, this.contrastDiv);
        }
    }

    private eventListeners(): void {
        this.sections = this.currentPicker.querySelector('.sections') as HTMLElement;
        this.options = this.currentPicker.querySelectorAll('.option') as NodeListOf<HTMLElement>;
        this.activeSection = this.currentPicker.querySelector('.activeSection') as HTMLElement;
        this.activeSelection = this.currentPicker.querySelector('.activeSelection') as HTMLElement;
        this.eyeDropper = this.currentPicker.querySelector('.eyeDropper') as HTMLElement;

        this.activeSection.addEventListener('click', (event) => {
            this.sections.classList.toggle('active');
            event.stopPropagation();
        });

        document.addEventListener('click', (event) => {
            if (this.sections.classList.contains('active') && 
                !this.sections.contains(event.target as Node) && 
                event.target !== this.activeSection) {
                this.sections.classList.remove('active');
            }
        });

        this.options.forEach(option => {
            option.addEventListener('click', () => {
                const selectedOption = option.getAttribute("value")?.toUpperCase() || "HSL";
                this.activeSelection.textContent = selectedOption;
                const selectedColor = this.getSelectedColor(this.activePicker);

                if (selectedOption === "HSL") {
                    this.activePicker = "HSL";
                    const colorChange = ColorConverter.toHSL(selectedColor);
                    const newPickerElement = this.setCurrentPicker(this.activePicker, colorChange);
                    this.switchPickers(newPickerElement);
                } else if (selectedOption === "RGB") {
                    this.activePicker = "RGB";
                    const colorChange = ColorConverter.toRGB(selectedColor);
                    const newPickerElement = this.setCurrentPicker(this.activePicker, colorChange);
                    this.switchPickers(newPickerElement);
                } else if (selectedOption === "CMYK") {
                    this.activePicker = "CMYK";
                    const colorChange = ColorConverter.toCMYK(selectedColor);
                    const newPickerElement = this.setCurrentPicker(this.activePicker, colorChange);
                    this.switchPickers(newPickerElement);
                }

                this.sections.classList.remove('active');
            });
        });

        this.eyeDropper.addEventListener('click', async () => {
            if (!window.EyeDropper) {
                alert("Your browser doesn't support the EyeDropper API");
                return;
            }

            const eyeDropper = new window.EyeDropper();
            try {
                const result = await eyeDropper.open();
                const rgb = ColorConverter.hexToRgb(result.sRGBHex);
                const hsl = ColorConverter.rgbToHsl(rgb);
                this.setExternalColor(hsl);
            } catch (error) {
                console.error("EyeDropper failed:", error);
            }
        });
    }

    private switchPickers(newPickerElement: HTMLElement): void {
        this.colorPickerContainer.replaceChild(newPickerElement, this.currentPicker);
        this.currentPicker = newPickerElement;
        this.eventListeners();
        this.debouncedSelectedColors();
    }
}


