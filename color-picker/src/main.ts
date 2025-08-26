
// import './style.css'

/* 
import { ColorPicker } from "../lib/COLORPICKERELEMENT";

const mainComponentElements = Array.from(document.querySelectorAll<HTMLDivElement>(".colorPickerElement"));

const colorPickerContainer = document.getElementById("colorPickerContainer");
if (!colorPickerContainer) throw new Error("Color picker container not found");


const testPicker = new ColorPicker({
  colorPickerContainer,
  targetElements: mainComponentElements
});

mainComponentElements.forEach((element) => {
  element.style.width = "200px";
  element.style.backgroundColor = "red";
  element.style.color = "white";
  element.style.padding = "10px";
  element.style.margin = "10px";
  element.style.borderRadius = "8px";
}); */

// import { ColorPickers } from "../lib/Color-picker-deep/COLORPICKER";

import  HSLCOLORPICKERELEMENT  from "../lib/COLORPICKER-ELEMENTS/ColorPickerLogic/HslPicker";

// 1. Get container and target elements

const pickerContainer = document.getElementById("color-picker-container")!;
const primaryNodes = document.querySelectorAll<HTMLDivElement>(".color-preview")!

// 2. Create a ColorPickers instance
const initialColor = { h: 210, s: 100, l: 50 };

HSLCOLORPICKERELEMENT({colorPickerContainer : pickerContainer,
  targetColorElements : {  targetElement : primaryNodes, targetStylePorperty : "background"}}).setExternalColor(initialColor)

  