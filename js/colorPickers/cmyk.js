import {cmykToHex,cmykTorgb} from "../colorPickerFunctionalities/colorConversion.js";
import { NTC } from "../colorPickerFunctionalities/colorName.js";
import { debounce } from "../colorPickerFunctionalities/minifuntionalities.js";
export const cmykPicker =(initialColor, element) =>
    {
        const cmyk = document.createElement('div');
        cmyk.id = 'cmyk';
        cmyk.classList.add("cmykPicker", "colorPickers");
        cmyk.innerHTML = 
        `
    <div class="preview"> peview</div>
        <div class="sliderContainer">

          <div class="colorIdentifyer">
            <label class="label"  for="cyan">CYAN</label>
            <input type="text" class="text" name="cyan" id="cyanText"  min="0" max="100" value="20" >
          </div>

            <input type="range" class="slider sSlider" name="cyan" id="cyan" min="0" max="100" value="20" >    
        </div>
        <div class="sliderContainer">

           <div class="colorIdentifyer">
            <label class="label"  for="magenta">MAGENTA</label>
            <input type="text" class="text" name="magenta" id="magentaText"  min="0" max="100" value="50" >
           </div>
            <input type="range" class="slider sSlider" name="magenta" id="magenta" min="0" max="100" value="50" >    
        </div>  
             <div class="sliderContainer">

          <div class="colorIdentifyer">
            <label class="label"  for="yellow">YELLOW</label>
            <input type="text" class="text" name="yellow" id="yellowText"  min="0" max="100" value="70" >
          </div>

            <input type="range" class="slider sSlider" name="yellow" id="yellow" min="0" max="100" value="70" >    
        </div>    
        <div class="sliderContainer">

            <div class="colorIdentifyer">
                <label class="label"  for="black">BLACK</label>
                <input type="text" class="text" name="black" id="blackText"  min="0" max="100" value="30" >
            </div> 

            <input type="range" class="slider sSlider" name="black" id="black" min="0" max="100" value="30" >    
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
                <h3 class="activeSelection">CMYK</h3>
     <svg xmlns="http://www.w3.org/2000/svg" class="chevron" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#000000"/>
</svg>
            </div>
        </div>
        <div class="extras">

      
<div class="copyDiv">
<svg  class="copy" xmlns="http://www.w3.org/2000/svg" 
class="ionicon" viewBox="0 0 512 512">
<path d="M456 480H136a24 24 0 01-24-24V128a16 16 0 0116-16h328a24 24 0 0124 24v320a24 24 0 01-24 24z"/><path d="M112 80h288V56a24 24 0 00-24-24H60a28 28 0 00-28 28v316a24 24 0 0024 24h24V112a32 32 0 0132-32z"/>
</svg>
</div>
<div class="eyeDropperDiv">
<svg class="eyeDropper"  xmlns="http://www.w3.org/2000/svg" 
class="ionicon" viewBox="0 0 512 512">
<path d="M480 96.22a63.84 63.84 0 00-18.95-45.61 65 65 0 00-45.71-19h-.76a61.78 61.78 0 00-44.22 19.09l-74.88 74.88-33.88-33.86-34.07 33.91-33.85 34 44 44L32 409.37V480h70.63l205.7-205.71L352 317.94l11.31-11.19c.11-.1 10.42-10.31 22.79-22.68l33.85-34-33.89-33.89L461 141.23a63.18 63.18 0 0019-45.01zM245 292.35L219.65 267l40.68-40.69 25.38 25.38z"/>
</svg>
</div>
        </div>
        
    </div>  
 `



 
const cyan = cmyk.querySelector('#cyan');
const cyanText = cmyk.querySelector('#cyanText');
const magenta = cmyk.querySelector('#magenta');
const magentaText = cmyk.querySelector('#magentaText');
const yellow = cmyk.querySelector('#yellow');
const yellowText = cmyk.querySelector('#yellowText');
const black = cmyk.querySelector('#black');
const blackText = cmyk.querySelector('#blackText');
const colorDisplay = cmyk.querySelector('.preview');
const colorNames = new NTC();


const cmykGradients =  (channel, c, m, y, k) => {
    let gradient = 'linear-gradient(to right, ';
    for (let i = 0; i <= 100; i += 10) {
      let value = i / 100;
      let r, g, b;  
      switch (channel) {
        case 'cyan':
          [r, g, b] = cmykTorgb(value, m, y, k).match(/\d+/g);
          break;
        case 'magenta':
          [r, g, b] = cmykTorgb(c, value, y, k).match(/\d+/g);
          break;
        case 'yellow':
          [r, g, b] = cmykTorgb(c, m, value, k).match(/\d+/g);
          break;
        case 'black':
          [r, g, b] = cmykTorgb(c, m, y, value).match(/\d+/g);
          break;
      }
      gradient += `rgb(${r}, ${g}, ${b}) ${i}%, `;
    }
    gradient = gradient.slice(0, -2) + ')'; // Remove the last comma and space, then add closing parenthesis

    return gradient;
  }


  const syncValuesWithSliders = () => 
    {  
      cyanText.value = cyan.value;
      magentaText.value = magenta.value;
      yellowText.value = yellow.value;
      blackText.value = black.value;
      cmykMain();
    }

      const syncValuesWithInputs = () =>
    {  
      cyan.value = cyanText.value;
      magenta.value = magentaText.value;
      yellow.value = yellowText.value;
      black.value = blackText.value;
      cmykMain();
    }
  const cmykMain = debounce(() =>{
    const c = cyan.value/100;
    const m = magenta.value/100;
    const y = yellow.value/100;
    const k = black.value/100;

    const cmyk2hex = cmykToHex(c,m,y,k);
    const cmykName = colorNames.colorName(cmyk2hex);
    colorDisplay.innerHTML =
    `<span style="background: white;color: hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${cmykName}</span>`   
  
    colorDisplay.style.background = cmyk2hex;
    
    element.forEach(el =>{
      if(el.classList.contains("text")){
      el.style.setProperty('color',cmyk2hex, 'important')
      }
      if(!el.classList.contains("text")) {
       el.style.setProperty('background',cmyk2hex, 'important')
      }
  });
    cyan.style.background = cmykGradients('cyan', c,m,y,k);
    magenta.style.background = cmykGradients('magenta', c,m,y,k);
    yellow.style.background = cmykGradients('yellow', c,m,y,k);
    black.style.background = cmykGradients('black', c,m,y,k);
    cmyk.style.boxShadow = `0 0 .5rem ${cmyk2hex}`
   }, 100);




if (typeof(initialColor) === "object") {
 
  cyan.value = initialColor.c;
  cyanText.value = initialColor.c;

  magenta.value = initialColor.m;
  magentaText.value = initialColor.m;

  yellow.value = initialColor.y;
  yellowText.value = initialColor.y;

  black.value = initialColor.k;
  blackText.value = initialColor.k;
  
  element.forEach(el =>{
    if(el.classList.contains("text")){
    el.style.setProperty('color',cmykTorgb(initialColor.c,initialColor.m,initialColor.y,initialColor.k), 'important')
    }
    if(!el.classList.contains("text")) {
     el.style.setProperty('background',cmykTorgb(initialColor.c,initialColor.m,initialColor.y,initialColor.k), 'important')  
    }
});
   
}

cyan.addEventListener('input', syncValuesWithSliders);
magenta.addEventListener('input', syncValuesWithSliders);
yellow.addEventListener('input', syncValuesWithSliders);
black.addEventListener('input', syncValuesWithSliders);

cyanText.addEventListener('input', syncValuesWithInputs);
magentaText.addEventListener('input', syncValuesWithInputs);
yellowText.addEventListener('input', syncValuesWithInputs);
blackText.addEventListener('input', syncValuesWithInputs);

cmykMain();
 return cmyk;
    }