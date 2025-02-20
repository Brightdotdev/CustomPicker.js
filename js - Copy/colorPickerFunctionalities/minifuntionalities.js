import { rgbToCmykReturnsObject,hslToCmykReturnsObject,hslToRgbReturnsObject,cmykToHslReturnsObject,cmykToRgbReturnsObject,rgbToHslReturnsObject } from "./colorConversion.js";


const getLuminance = (rgb) => {
    let { r, g, b } = rgb;

    // Normalize the values to the 0-1 range
    [r, g, b] = [r, g, b].map(function (channel) {
        channel /= 255;
        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    // Calculate and return the luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
   
const getContrastRatio = (color1,color2)=>  {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (lighter + 0.05) / (darker + 0.05);
}

const getContrast = (ratio) =>  {
    if (ratio >= 7.0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none">
<path d="M8 12.3333L10.4615 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#010101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`; // Excellent contrast
    } else if (ratio >= 4.5) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none">
<path d="M8 12.3333L10.4615 15L16 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#010101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`; // Good contrast
    } else if (ratio >= 3.0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" 
        fill="#010101" width="17" height="17" 
        viewBox="0 0 24 24"><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"/><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"/></svg>`; // Sufficient contrast
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" 
        fill="#010101" width="17" height="17" viewBox="0 0 24 24">
        <path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"/><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"/>
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
       
      //  console.log("Contrast Ratios:", textBgContrast, textAccentContrast, textMainContrast);

        const textBgRatio = getContrast(textBgContrast);
        const textAccentRatio = getContrast(textAccentContrast);
        const textMainRatio = getContrast(textMainContrast);

      //  console.log("Contrast Grades:", textBgRatio, textAccentRatio, textMainRatio);
       
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
    colorsToHsl 
  }