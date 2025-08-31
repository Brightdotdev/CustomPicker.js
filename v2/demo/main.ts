

import  {COLORPICKERCLASS, RgbObject, HslObject,CmykObject} from "../src/index"
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



const initialColorrgb = { r: 5, g: 9, b: 20};


const thatPicker = new CmykObject({colorPickerContainer : pickerContainer , 
    targetElementProps: {
      targetElement: primaryNodes, 
      targetStylePorperty: "color"                     
    }})



const thatPicker2 = new HslObject({colorPickerContainer : pickerContainer2 , 
   
  targetElementProps: {
      
      targetElement: primaryNodes, 
      targetStylePorperty : "border-bottom-color"               
    }})

    const thatPicker3 = new RgbObject({colorPickerContainer : pickerContainer3 , 
    targetElementProps: {
      targetElement: primaryNodes2, 
      targetStylePorperty: "border-bottom-color"                     
    }})

    new COLORPICKERCLASS({colorPickerContainer : pickerContainer4 , 
  colorPickerProps: {
    targetElementProps  : {
      targetElement : primaryNodes2,
      targetStylePorperty : "selection-bg"
    }                    
    }})
    // thatPicker2.setExternalColor(initialColorrgb)


    getColorElements.addEventListener("click" , () =>{

      colorValues.innerText = JSON.stringify( thatPicker.getCurrentColor())
      colorValues2.innerText =  JSON.stringify(thatPicker2.getCurrentColor())
      colorValues3.innerText =  JSON.stringify(thatPicker3.getCurrentColor())
      })