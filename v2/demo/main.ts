
import './style.css'

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

// import  CMYKELEMENTPICKER  from "../lib/COLORPICKER-ELEMENTS/ColorPickerLogic/CmykPicker";
import  CmykObject  from "../src/lib/COLORPICKER-ELEMENTS/ColorPickerLogic/CMYK-COLOR-PICKER";
import  HslObject  from "../src/lib/COLORPICKER-ELEMENTS/ColorPickerLogic/HSL-COLOR-PICKER";
import  RgbObject  from "../src/lib/COLORPICKER-ELEMENTS/ColorPickerLogic/RGB-COLOR-PICKER";
import  COLORPICKERCLASS  from "../src/lib/COLORPICKER-ELEMENTS/COLORPICKERCLASS";


// 1. Get container and target elements

const pickerContainer = document.getElementById("color-picker-container")!;
const pickerContainer2 = document.getElementById("color-picker-container2")!;
const pickerContainer3 = document.getElementById("color-picker-container3")!;
const pickerContainer4 = document.getElementById("color-picker-container4")!;
const primaryNodes2 = document.querySelectorAll<HTMLDivElement>(".color-preview2")!
const primaryNodes = document.querySelectorAll<HTMLDivElement>(".color-preview")!
const colorValues = document.querySelector<HTMLDivElement>(".firstOne")!
const colorValues2= document.querySelector<HTMLDivElement>(".firstOne2")!
const getColorElements= document.getElementById("getColorValues")!
const colorValues3 = document.querySelector<HTMLDivElement>(".firstOne3")!
// 2. Create a ColorPickers instance
/* 
const initialColorHsl = { h: 340, s: 39, l: 30};
const initialColorCmyk = {c :34, m:43 , y: 49, k: 10};
 */
const initialColorrgb = { r: 5, g: 9, b: 20};



/* 
const colorPicker2 = new COLORPICKERCLASS({
  colorPickerContainer: pickerContainer2,
  pickerId : "nigga",
  colorPickerProps: {
    targetElements: {
      targetElement: primaryNodes, 
      targetStylePorperty: "text"                     
    }
  }
});





const colorPicker = new COLORPICKERCLASS({
  colorPickerContainer: pickerContainer,
  pickerId : "nigga2",
  colorPickerProps: {
    targetElements: {
      targetElement: primaryNodes, 
      targetStylePorperty: "text"                     
    }
  }
});
 */

const thatPicker = new CmykObject({colorPickerContainer : pickerContainer , 
    targetElementProps: {
      targetElement: primaryNodes, 
      targetStylePorperty: "text"                     
    }})

new COLORPICKERCLASS({colorPickerContainer : pickerContainer4 , 
  colorPickerProps: {
    targetElementProps  : {
      targetElement : primaryNodes2,
      targetStylePorperty : "text"
    }                    
    }})

const thatPicker2 = new HslObject({colorPickerContainer : pickerContainer2 , 
   
  targetElementProps: {
      
      targetElement: primaryNodes, 
      targetStylePorperty : "background"               
    }})

    const thatPicker3 = new RgbObject({colorPickerContainer : pickerContainer3 , 
    targetElementProps: {
      targetElement: primaryNodes2, 
      targetStylePorperty: "background"                     
    }})

    thatPicker2.setExternalColor(initialColorrgb)


    getColorElements.addEventListener("click" , () =>{

      colorValues.innerText = JSON.stringify( thatPicker.getCurrentColor())
      colorValues2.innerText =  JSON.stringify(thatPicker2.getCurrentColor())
      colorValues3.innerText =  JSON.stringify(thatPicker3.getCurrentColor())
      })