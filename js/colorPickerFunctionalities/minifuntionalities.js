import { rgbToCmykReturnsObject,hslToCmykReturnsObject,hslToRgbReturnsObject,cmykToHslReturnsObject,cmykToRgbReturnsObject,rgbToHslReturnsObject } from "./colorConversion.js";


const getLuminance = (rgb) => {
    let { r, g, b } = rgb;


    [r, g, b] = [r, g, b].map(function (channel) {
        channel /= 255;
        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
   
const getContrastRatio = (color1,color2)=>  {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
}

const getContrast = (ratio) => {
    const neutralColor = "#757575"; // A mid-gray that works well on both light and dark backgrounds
    const size = "15";
    const viewBox = "0 0 24 24";
    
    const baseCircle = `<circle cx="12" cy="12" r="10" stroke="${neutralColor}" stroke-width="2" fill="none"/>`;
    
    if (ratio >= 7.0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
            ${baseCircle}
            <path d="M8 12.3333L10.4615 15L16 9" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`; // Excellent contrast
    } else if (ratio >= 4.5) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
            ${baseCircle}
            <path d="M9 12L11 14L15 10" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`; // Good contrast
    } else if (ratio >= 3.0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
            ${baseCircle}
            <line x1="8" y1="12" x2="16" y2="12" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round"/>
        </svg>`; // Sufficient contrast
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none">
            ${baseCircle}
            <path d="M15 9L9 15M9 9L15 15" stroke="${neutralColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`; // Poor contrast   
    }
}

const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

const colorsToRgb =  (colorToRgb) =>{
    
if(colorToRgb.hasOwnProperty("r") 
    && colorToRgb.hasOwnProperty("g")
    && colorToRgb.hasOwnProperty("b")){
    return colorToRgb
    }
    else if(colorToRgb.hasOwnProperty("h") 
        && colorToRgb.hasOwnProperty("s")
        && colorToRgb.hasOwnProperty("l")){
        const hslTorgb =  hslToRgbReturnsObject(colorToRgb); 
    return hslTorgb
        }   
    else if(colorToRgb.hasOwnProperty("c") 
        && colorToRgb.hasOwnProperty("m")
        && colorToRgb.hasOwnProperty("y")
        && colorToRgb.hasOwnProperty("k")
        )
        {
        const cmykToRgb = cmykToRgbReturnsObject(colorToRgb);     
        return cmykToRgb
    }
    }


const rgbColorChangeInit =  (colorChange) => {  
    if(colorChange.hasOwnProperty("r") 
        && colorChange.hasOwnProperty("g")
        && colorChange.hasOwnProperty("b")){
            return colorChange
        }
    else if(colorChange.hasOwnProperty("c") 
    && colorChange.hasOwnProperty("m")
    && colorChange.hasOwnProperty("y")
    && colorChange.hasOwnProperty("k")
    ){
    const cmykToRgb = cmykToRgbReturnsObject(colorChange);
        return cmykToRgb;
    }
    else if(colorChange.hasOwnProperty("h") 
    && colorChange.hasOwnProperty("s")
    && colorChange.hasOwnProperty("l")){
    const hslToRgb = hslToRgbReturnsObject(colorChange);
    return hslToRgb
    }
}


    const  cmykColorChangeInit  = (colorChange) =>  { 
  if(colorChange.hasOwnProperty("c") 
    && colorChange.hasOwnProperty("m")
    && colorChange.hasOwnProperty("y")
    && colorChange.hasOwnProperty("k")
    ){     
    return colorChange;
        }
    else if(colorChange.hasOwnProperty("r") 
    && colorChange.hasOwnProperty("g")
    && colorChange.hasOwnProperty("b")){
    
    const rgbToCmyk = rgbToCmykReturnsObject(colorChange);
    return rgbToCmyk;
    }
    else if(colorChange.hasOwnProperty("h") 
    && colorChange.hasOwnProperty("s")
    && colorChange.hasOwnProperty("l")){
    const hslToCmyk = hslToCmykReturnsObject(colorChange);
    return hslToCmyk
        }
    }


const hslColorChangeInit = (colorChange) =>  { 
                  
if(colorChange.hasOwnProperty("h") 
    && colorChange.hasOwnProperty("s")
    && colorChange.hasOwnProperty("l")){
        return colorChange
    }

    else if(colorChange.hasOwnProperty("r") 
    && colorChange.hasOwnProperty("g")
    && colorChange.hasOwnProperty("b")){
    const rgbToHsl = rgbToHslReturnsObject(colorChange);
    return rgbToHsl
    }
    else  
    if(colorChange.hasOwnProperty("c") 
        && colorChange.hasOwnProperty("m")
        && colorChange.hasOwnProperty("y")
        && colorChange.hasOwnProperty("k")
        ){
        const cmykToHsl = cmykToHslReturnsObject(colorChange);
        return cmykToHsl;
        }
 }

 const colorsToHsl =  (colorToHsl) => {

    if(colorToHsl.hasOwnProperty("h") 
    && colorToHsl.hasOwnProperty("s")
    && colorToHsl.hasOwnProperty("l")){
    return colorToHsl
    }
    else if(colorToHsl.hasOwnProperty("r") 
        && colorToHsl.hasOwnProperty("g")
        && colorToHsl.hasOwnProperty("b")){
        const rgbToHsl =  rgbToHslReturnsObject(colorToHsl); 
    return rgbToHsl
        }   
    else if(colorToHsl.hasOwnProperty("c") 
        && colorToHsl.hasOwnProperty("m")
        && colorToHsl.hasOwnProperty("y")
        && colorToHsl.hasOwnProperty("k")
        )
        {
        const cmykTOHsl = cmykToHslReturnsObject(colorToHsl);     
        return cmykTOHsl
    }
            }

const colorManagers = {

    colorValues: [],
    colorRatio: [],

    updateColors(pickerId, value){

        const existingPicker =  this.colorValues.findIndex(picker => picker.pickerId ===pickerId);

        if(existingPicker !== -1){
            this.colorValues[existingPicker].value = value;
        }else{
             this.colorValues.push({pickerId,value});
            }

        console.log(`Color values updated for picker ${pickerId}:`, value);
        console.log(this.colorValues)
        this.updateRatios()
    },

    checkContrast(){
        const defaultColor = "rgb(0,0,0)"; // Default fallback color

        const textPicker = this.colorValues.find(picker => picker.pickerId === "textPicker");
        const textColor = textPicker ? textPicker.value : defaultColor;

        const backgroundPicker = this.colorValues.find(picker => picker.pickerId === "backgroundPicker");
        const bgColor = backgroundPicker ? backgroundPicker.value : defaultColor;

        const mainPicker = this.colorValues.find(picker => picker.pickerId === "mainPicker");
        const mainColor = mainPicker ? mainPicker.value : defaultColor;

        const accentPicker = this.colorValues.find(picker => picker.pickerId === "accentPicker");
        const accentColor = accentPicker ? accentPicker.value : defaultColor;

        const textBgContrast = getContrastRatio(textColor, bgColor);
        const textAccentContrast = getContrastRatio(textColor, accentColor);
        const textMainContrast = getContrastRatio(textColor, mainColor);

        const textBgRatio = getContrast(textBgContrast);
        const textAccentRatio = getContrast(textAccentContrast);
        const textMainRatio = getContrast(textMainContrast);
       
        return{
            textBgRatio,
            textAccentRatio,
            textMainRatio
        }
},

   updateRatios(){
        const ratios = this.checkContrast()
        this.colorRatio = []

        this.colorRatio.push({
            textToBg : ratios.textBgRatio,
            textToAccent : ratios.textAccentRatio,
            textToMain: ratios.textMainRatio
        })

        console.log("Updated Contrast Ratios:", this.colorRatio);
   }

}


  export{
    debounce,
    colorManagers,
    colorsToRgb,
    rgbColorChangeInit,
    cmykColorChangeInit,
    hslColorChangeInit,
    colorsToHsl ,
    getContrast,
    getContrastRatio,
    getLuminance
  }