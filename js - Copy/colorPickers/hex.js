import { rgbToHex } from "../colorPickerFunctionalities/colorConversion.js";
import { NTC } from "../colorPickerFunctionalities/colorName.js";
export const hexPicker = (externalColorInit) =>{
    const hexPickerDivElement = document.createElement("div")
        hexPickerDivElement.classList.add("hexColorPicker", "colorPickers")
        hexPickerDivElement.id = "hexColorPicker";
    hexPickerDivElement.innerHTML = 
    `
    <div class="saturationBrightnessWrapper">
   <canvas id="saturationBrightness" class="saturationBrightness"  
   width="240" height="240"></canvas>
    <div class="saturationBrightnessCursor hexCursor" id="saturationBrightnessCursor"></div>
   </div>
   <div class="huePickerWrapper">
    <canvas id="huePicker" class="huePicker"  
    width="240" height="20">
    </canvas>
    <div class="hueCursor hexCursor" id="hueCursor"></div>
   </div>


   <div class="colorCode"  id="colorCode">
      <h6></h6>
   </div>
   

 <div class="colorPreview preview" id="preview" >
<p style="padding: 0;margin: 0;">preview</p>
</div>

   <div class="extraOptions">
    <div class="sections">
        <ul class="options">
        <li value="hsl" class="option optionText">HSL</li>
        <li  value="hex"class="option optionText">HEX (BETA) </li>
        <li value="cmyk"class="option optionText">CMYK</li>
        <li  value="rgb"class="option optionText">RGB</li>
        </ul>
        <div class="activeSection">
            <h3 class="activeSelection">HEX (BETA)</h3>
       <svg xmlns="http://www.w3.org/2000/svg" id="chevron" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"/>
</svg>
        </div>
    </div>
    <div class="extras">

    <svg  id="copy" xmlns="http://www.w3.org/2000/svg" 
    class="ionicon" viewBox="0 0 512 512">
    <path d="M456 480H136a24 24 0 01-24-24V128a16 16 0 0116-16h328a24 24 0 0124 24v320a24 24 0 01-24 24z"/><path d="M112 80h288V56a24 24 0 00-24-24H60a28 28 0 00-28 28v316a24 24 0 0024 24h24V112a32 32 0 0132-32z"/>
    </svg>

      <svg id="eyeDropper"  xmlns="http://www.w3.org/2000/svg" 
      class="ionicon" viewBox="0 0 512 512">
      <path d="M480 96.22a63.84 63.84 0 00-18.95-45.61 65 65 0 00-45.71-19h-.76a61.78 61.78 0 00-44.22 19.09l-74.88 74.88-33.88-33.86-34.07 33.91-33.85 34 44 44L32 409.37V480h70.63l205.7-205.71L352 317.94l11.31-11.19c.11-.1 10.42-10.31 22.79-22.68l33.85-34-33.89-33.89L461 141.23a63.18 63.18 0 0019-45.01zM245 292.35L219.65 267l40.68-40.69 25.38 25.38z"/>
    </svg>
    </div>
</div>
    `
const huePicker = hexPickerDivElement.querySelector("#huePicker");
const saturationBrightness = hexPickerDivElement.querySelector("#saturationBrightness");
const hueCtx = huePicker.getContext("2d", { willReadFrequently: true });
const SBCtx = saturationBrightness.getContext("2d", { willReadFrequently: true });
const hueCursor = hexPickerDivElement.querySelector("#hueCursor");
const saturationBrightnessCursor = hexPickerDivElement.querySelector("#saturationBrightnessCursor");
const preview = hexPickerDivElement.querySelector("#preview");
const colorCode = hexPickerDivElement.querySelector("#colorCode");
const colorNames = new NTC();
let hue = 0;
let saturation = 5;
let brightness = 1;

let isHueDragging = false;
let isColorDragging = false;


const rgbToHsv = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;
    let saturation = 0;
    const value = max;

    if (delta !== 0) {
        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }
        hue *= 60;
        if (hue < 0) {
            hue += 360;
        }
        saturation = delta === 0 ? 0 : delta / max;
    }

    return { h: hue / 360, s: saturation, v: value };
};


const hsvToRgb = (hueParam, saturationParam, brightnessParam) => {
    hueParam = Math.max(0, Math.min(1, hueParam)); // Ensure hueParam is within [0, 1]
    saturationParam = Math.max(0, Math.min(1, saturationParam)); // Ensure saturationParam is within [0, 1]
    brightnessParam = Math.max(0, Math.min(1, brightnessParam)); // Ensure brightnessParam is within [0, 1]

    let r, g, b;
    const h = hueParam * 360; // Convert hueParam to degrees

    if (saturationParam === 0) {
        r = g = b = brightnessParam; // Achromatic (gray)
    } else {
        const i = Math.floor(h / 60) % 6;
        const f = h / 60 - Math.floor(h / 60);
        const p = brightnessParam * (1 - saturationParam);
        const q = brightnessParam * (1 - saturationParam * f);
        const t = brightnessParam * (1 - saturationParam * (1 - f));

        switch (i) {
            case 0: [r, g, b] = [brightnessParam, t, p]; break;
            case 1: [r, g, b] = [q, brightnessParam, p]; break;
            case 2: [r, g, b] = [p, brightnessParam, t]; break;
            case 3: [r, g, b] = [p, q, brightnessParam]; break;
            case 4: [r, g, b] = [t, p, brightnessParam]; break;
            case 5: [r, g, b] = [brightnessParam, p, q]; break;
        }
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}


const updatePreviewColor = () => {    

    const color = hsvToRgb(hue, saturation, brightness);
    hexPickerDivElement.style.boxShadow = `0 0 1rem ${rgbToHex(color.r,color.g,color.b)}`
    colorCode.querySelector("h6").innerText = rgbToHex(color.r,color.g,color.b);
    console.log(color)
    const hexCOlorNames = colorNames.colorName(rgbToHex(color.r,color.g,color.b))
    preview.innerHTML =
     `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${hexCOlorNames}</span>`   
    
    preview.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

const drawSaturationBrightnessPicker = () => {

    const width = saturationBrightness.width;
    const height = saturationBrightness.height;
    const imageData = SBCtx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
    
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
             saturation = x / width;
             brightness = 1 - y / height;
    
             const color = hsvToRgb(hue, saturation, brightness);
             imageData.data[index] = color.r;
            imageData.data[index + 1] = color.g;
            imageData.data[index + 2] = color.b;
            imageData.data[index + 3] = 255; // Alpha channel
        }
    }
    SBCtx.putImageData(imageData, 0, 0);
};

const drawHuePicker = () => {
    const width = huePicker.width;
    const height = huePicker.height;
    const imageData = hueCtx.createImageData(width, height);

    for (let x = 0; x < width; x++) {
    const hueValue = x / width;
    for (let y = 0; y < height; y++) {
    
    const color = hsvToRgb(hueValue,1,1);
    const index = (y * width + x) * 4;
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255;

}
    }
    hueCtx.putImageData(imageData, 0, 0);

};



const updateSBPicker  = (X, Y) =>{

    const rect = saturationBrightness.getBoundingClientRect()
    const mouseX =  X - rect.left;
    const mouseY =  Y - rect.top;

    const clampedX = Math.min(Math.max(0, mouseX), saturationBrightness.width);
    const clampedY = Math.min(Math.max(0, mouseY), saturationBrightness.height);

    saturationBrightnessCursor.style.left = `${clampedX - saturationBrightnessCursor.offsetWidth / 2}px`;
    saturationBrightnessCursor.style.top = `${clampedY - saturationBrightnessCursor.offsetHeight / 2}px`;

    saturation = clampedX / saturationBrightness.width;
    brightness = 1 - (clampedY / saturationBrightness.height);
    

    console.log('Hue Value:', hue);
    console.log('Saturation:', saturation);
    console.log('Brightness:', brightness);
    
    updatePreviewColor();
}


const updateHuePicker = (e) =>{

    const rect = huePicker.getBoundingClientRect();
    const mouseX = e.clientX - rect.left
    const hueCursorX = Math.min(Math.max(0, mouseX), huePicker.width);

    /* const saturationRect = saturationBrightness.getBoundingClientRect()
    const sbCursorPosition = saturationBrightnessCursor.getBoundingClientRect();  */  
    hueCursor.style.left = `${hueCursorX- hueCursor.offsetWidth /2}px`
    hueCursor.style.top = `${huePicker.height / 2 - hueCursor.offsetHeight /2}px`

    const hueValue = hueCursorX/huePicker.width; 
    hue = hueValue
    
    console.log('Hue fom hsl:' + hue);
    console.log('Saturation from hsl:' + saturation);
    console.log('Brightness from hsl:' + brightness);

     saturation =  saturationBrightness.offsetWidth / saturationBrightnessCursor.offsetWidth;
     brightness = saturationBrightness.offsetHeight / saturationBrightnessCursor.offsetHeight;
     

    /* saturation =    sbCursorPosition.left -  saturationRect.left 
    brightness =  sbCursorPosition.top - saturationRect.top */

    updatePreviewColor();

    drawSaturationBrightnessPicker();

    }


const syncColorPicker = (rgb) => {
  
    const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);
    hue = h;
    saturation = s
    brightness = v
    drawSaturationBrightnessPicker();
  // Assuming you already have HSV values for hue, saturation, and brightness

// 1. Update the Hue Cursor position based on the hue value (ranges from 0 to 1)
const hueCursorX = hue * huePicker.width;  // Calculate X position from hue value
hueCursor.style.left = `${hueCursorX - hueCursor.offsetWidth / 2}px`;  // Update the cursor position

// 2. Update the Saturation-Brightness Cursor position based on saturation and brightness values
const sbCursorX = saturation * saturationBrightnessCursor.height;  // Calculate X position from saturation value (0 to 1)
const sbCursorY = (1 - brightness) * saturationBrightnessCursor.width;  // Calculate Y position from brightness value (0 to 1)
console.log(sbCursorX,sbCursorY,saturation,brightness);
// Update the cursor position
saturationBrightnessCursor.style.left = `${sbCursorX - saturationBrightnessCursor.offsetWidth / 2}px`;
saturationBrightnessCursor.style.top = `${sbCursorY - saturationBrightnessCursor.offsetHeight / 2}px`;

    preview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`    

    const hexColorNames = colorNames.colorName(rgbToHex(rgb.r,rgb.g,rgb.b))
    preview.innerHTML =
     `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${hexColorNames}</span>`   
    
     colorCode.querySelector("h6").innerText = rgbToHex(rgb.r,rgb.g,rgb.b);


};


saturationBrightness.addEventListener('mousedown', (event) => {
    isColorDragging = true;
updateSBPicker(event.clientX,event.clientY)
});
saturationBrightness.addEventListener('click', (event) => {
   updateSBPicker(event.clientX,event.clientY)
});
window.addEventListener('mousemove', (event) => {
    if (isColorDragging) {
    updateSBPicker(event.clientX,event.clientY)
    }
});

window.addEventListener('mouseup', () => {
    isColorDragging = false;
});

window.addEventListener('mouseleave', () => {
    isColorDragging = false;
});


huePicker.addEventListener('mousedown', (event) => {
    isHueDragging = true;
    updateHuePicker(event)

});

huePicker.addEventListener('click', (event) => {
    updateHuePicker(event);
});

window.addEventListener('mousemove', (event) => {
    if (isHueDragging) {
    updateHuePicker(event)
    }
});

window.addEventListener('mouseup', () => {
    isHueDragging = false;
});

window.addEventListener('mouseleave', () => {
    isHueDragging = false;
});


drawHuePicker();
drawSaturationBrightnessPicker();
const externalColor = {r:230,g:203,b:2}; 



syncColorPicker(externalColor)

if(typeof(externalColorInit) === "object"){
syncColorPicker(externalColorInit);
}



return hexPickerDivElement;

}