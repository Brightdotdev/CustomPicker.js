    import { cmykPicker } from "./cmyk.js"
    import { rgbPicker } from "./rgb.js";
    import { hslPicker } from "./hsl.js";
    import { debounce,colorManagers,colorsToRgb, rgbColorChangeInit, cmykColorChangeInit, hslColorChangeInit, colorsToHsl } from "../colorPickerFunctionalities/minifuntionalities.js";
    import {cmykToHslReturnsObject, cmykToRgbReturnsObject, hslToCmykReturnsObject, hslToRgbReturnsObject, rgbToCmykReturnsObject, rgbToHslReturnsObject,hslToHex,rgbToHex,cmykToHexInit } from "../colorPickerFunctionalities/colorConversion.js";
    import { NTC } from "../colorPickerFunctionalities/colorName.js";
    export class ColorPickers {
        constructor(containerElement, elementDiv,pickerId,contrastDiv){
           
            this.colorPickerStyles = this.colorPickerStyling()
            this.containerElement = containerElement
           
            this.contrastDiv = contrastDiv;
            this.elementDiv = elementDiv;
            this.activePicker = "HSL";
            this.currentPicker = this.setCurrentPicker(this.activePicker);
            this.containerElement.appendChild(this.currentPicker);
            this.currentPicker.querySelector('.activeSelection').innerText = this.activePicker;
            this.selectedValues =  this.getSelectedColor("HSL");         
           
             this.selectedValues = {}
            this.eventListeners();
            this.debouncedSelectedColors = debounce(this.getSelectedColorInit,1000)
            this.debouncedSelectedColors();
           
            if(typeof(pickerId)=== "string"){
            this.pickerId = pickerId;
            colorManagers.updateColors(this.pickerId,this.selectedValues)       
            this.updateContrast(this.pickerId,this.contrastDiv)
            }
        }
           
        getCmykElement(selectedColors) {
                return cmykPicker(selectedColors,this.elementDiv)

            }
        getRgbElement(selectedColors) {
            return rgbPicker(selectedColors,this.elementDiv)
                    }   
        getHslElement(selectedColors) {
            return hslPicker(selectedColors,this.elementDiv)
                    }

        colorPickerStyling(){
                this.styles = document.createElement("style");
                this.styles.textContent =
                `
                *{box-sizing:border-box;transition:0.5s ease-in-out;user-select:none;font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif}#test{display:flex;align-items:center;gap:5rem}.colorPickers{width:16rem;height:22rem;display:flex;border-radius:0.5rem;align-items:center;justify-content:space-between;flex-direction:column;padding:0.5rem;box-shadow:0 0 1rem black}.cmykPicker{width:18rem;height:24rem}.preview{width:100%;height:8rem;border-radius:0.5rem;color:white;align-content:center;text-align:center}.sliderContainer{position:relative;width:100%;display:flex;flex-direction:column;gap:0.5rem}.colorIdentifyer{width:100%;display:flex;align-items:center;justify-content:space-between;color:hsl(0, 0%, 20%);font-size:0.8rem;.text{color:hsl(0, 0%, 20%);max-width:2rem;max-height:2rem;border-radius:0.2rem;border:1.5px solid grey;text-align:center;font-weight:bolder;background:none}}.slider{flex:1;width:100%;height:0.6rem;border-radius:1rem;-webkit-appearance:none;appearance:none;-moz-appearance:none}#hue::-moz-range-track{appearance:none;height:0.6rem;background:linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);border-radius:1rem}#hue::-webkit-slider-runnable-track{height:0.6rem;appearance:none;background:linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);border-radius:1rem}.sSlider::-webkit-slider-runnable-track{height:0.6rem;appearance:none;border-radius:1rem}.sSlider::-moz-range-track{height:0.6rem;appearance:none;border-radius:1rem}.sSlider::-webkit-slider-thumb,.slider::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:1rem;height:1rem;border:5px solid white;outline:1px solid black;border-radius:50%;cursor:pointer;margin-top:-4px}.sSlider::-webkit-slider-thumb:active,.slider::-webkit-slider-thumb:active{outline:0.8px solid blue;width:1.1rem;height:1.1rem;border:7px solid white}.extraOptions{z-index:3;display:flex;width:100%;justify-content:space-between;align-items:center}.extraOptions svg,.sections svg{width:0.8rem;margin-right:0.4rem;fill:rgb(36, 36, 36)}.sections{border-radius:0.5rem;align-items:center;transition:0.2s ease-in;cursor:pointer;user-select:none;position:relative}.sections.active .options{display:block}.activeSection{display:flex;align-items:center;gap:0.5rem;justify-content:space-around;.chevron{width:1rem}}.activeSection h3{font-size:0.8rem;padding:0;margin:0}.options{position:absolute;width:8rem;top:-9rem;border-radius:5px;display:flex;flex-direction:column;padding:0.2rem;background:white;box-shadow:0 0 0.5rem black;display:none}.option{padding:0.2rem 0;text-align:center;list-style:none;border-bottom:1px solid black}.option:nth-of-type(4){border:none}.hexColorPicker{justify-content:flex-start;gap:1rem;height:28rem}.huePickerWrapper{position:relative;width:fit-content;height:fit-content;display:flex;align-items:center;justify-content:center;border-radius:2rem}.colorCode{width:60%;height:2rem;border:1px solid grey;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;columns:white}.huePicker{margin:0;padding:0;border-radius:inherit}.hexCursor{position:absolute;width:1.5rem;height:1.5rem;background:transparent;border:0.4rem solid white;border-radius:50%;cursor:pointer}.hexCursor:active{outline:1px solid blue}.hueCursor{left:0}.saturationBrightnessWrapper{background:gray;display:flex;align-items:center;justify-content:center;height:fit-content;position:relative;width:fit-content;border-radius:1rem;padding:0;box-sizing:border-box}.saturationBrightness{position:relative;margin:0;padding:0;top:0;left:0;bottom:0;border-radius:inherit}.saturationBrightnessCursor{top:50%;right:0}.colorPreview{width:100%;height:2.5rem;border-radius:0.5rem;color:white;display:flex;align-items:center;justify-content:center}
                `
                document.head.appendChild(this.styles);
                return this.styles;
                }

             
            setCurrentPicker(picker,selectedColors){
                this.activePicker = picker;
                if(picker ==="HSL"){
                    return this.getHslElement(selectedColors, this.elementDiv)
                }else if(picker ==="RGB"){
                    return this.getRgbElement(selectedColors,this.elementDiv)
                }else if(picker ==="CMYK"){
                    return this.getCmykElement(selectedColors,this.elementDiv)
                }
                }      

            getSelectedColor(activeColor){
            if(activeColor === "HSL"){
                const values ={
                    h: parseInt(this.currentPicker.querySelector('#hue').value, 10),
                    s: parseInt(this.currentPicker.querySelector('#saturation').value, 10),
                    l: parseInt(this.currentPicker.querySelector('#lightness').value, 10)
                        } 
                        return values;
                    }  
            else if(activeColor === "RGB"){
            const values ={
                r: parseInt(this.currentPicker.querySelector('#red').value, 10),
                g: parseInt(this.currentPicker.querySelector('#green').value, 10),
                b: parseInt(this.currentPicker.querySelector('#blue').value, 10)
                    }
                    return values;
                    }
            else if(activeColor === "CMYK"){
                const values ={
                    c: parseInt(this.currentPicker.querySelector('#cyan').value, 10),
                    m: parseInt(this.currentPicker.querySelector('#magenta').value, 10),
                    y: parseInt(this.currentPicker.querySelector('#yellow').value, 10),
                    k: parseInt(this.currentPicker.querySelector('#black').value, 10)
                        }
                        return values
                    }
                }

                
            getSelectedColorInit(){
                this.currentPicker.querySelectorAll("input").forEach(slider =>{
                    slider.addEventListener("input", () =>{
                    let values

                    const huePicker = this.currentPicker.querySelector('#hue')
                    const saturationPicker = this.currentPicker.querySelector('#saturation')
                    const lightnessPicker = this.currentPicker.querySelector('#lightness')            
                    const cyanPicker = this.currentPicker.querySelector('#cyan')
                    const magentaPicker = this.currentPicker.querySelector('#magenta')
                    const yellowPicker = this.currentPicker.querySelector('#yellow')
                    const blackPicker = this.currentPicker.querySelector('#black')
                    const redPicker = this.currentPicker.querySelector('#red')
                    const bluePicker = this.currentPicker.querySelector('#blue')
                    const greenPicker = this.currentPicker.querySelector('#green')
        
                    if(huePicker && lightnessPicker && saturationPicker){
                        values ={
                            h: parseInt(this.currentPicker.querySelector('#hue').value, 10),
                            s: parseInt(this.currentPicker.querySelector('#saturation').value, 10),
                            l: parseInt(this.currentPicker.querySelector('#lightness').value, 10)
                                } 
                                values = hslToRgbReturnsObject(values);
                    }else if(cyanPicker && magentaPicker&& yellowPicker&& blackPicker){
                    values ={
                            c: parseInt(this.currentPicker.querySelector('#cyan').value, 10),
                            m: parseInt(this.currentPicker.querySelector('#magenta').value, 10),
                            y: parseInt(this.currentPicker.querySelector('#yellow').value, 10),
                            k: parseInt(this.currentPicker.querySelector('#black').value, 10)
                                }
                            values = cmykToRgbReturnsObject(values);
                    }else if(redPicker&& greenPicker && bluePicker){
                      
                        values ={
                            r: parseInt(this.currentPicker.querySelector('#red').value, 10),
                            g: parseInt(this.currentPicker.querySelector('#green').value, 10),
                            b: parseInt(this.currentPicker.querySelector('#blue').value, 10)
                                }
                    }
                      this.selectedValues = values;
                      colorManagers.updateColors(this.pickerId,this.selectedValues);
                      this.updateContrast(this.pickerId,this.contrastDiv);
                })})
            }


                    updateContrast(id,contrastDiv){
                    if(typeof(contrastDiv) !== "undefined"){
                       contrastDiv.forEach(contrasts => {
                        if(id === "mainPicker"){
                            contrasts.innerHTML = colorManagers.colorRatio[0].textToMain
                        }else if(id === "accentPicker"){
                                contrasts.innerHTML = colorManagers.colorRatio[0].textToAccent
                            }else if(id === "backgroundPicker"){
                                contrasts.innerHTML = colorManagers.colorRatio[0].textToBg
                            }
                       })
                    }
                    }

                   rgbColorChange(colorChange){
                    if(colorChange.hasOwnProperty("r") 
                        && colorChange.hasOwnProperty("g")
                        && colorChange.hasOwnProperty("b")){ 
                        this.currentPicker.querySelector('#red').value = colorChange.r;
                        this.currentPicker.querySelector('#green').value = colorChange.g;
                        this.currentPicker.querySelector('#blue').value = colorChange.b;
                        this.currentPicker.querySelector('#redText').value = colorChange.r;
                        this.currentPicker.querySelector('#greenText').value = colorChange.g;
                        this.currentPicker.querySelector('#blueText').value = colorChange.b;
                        this.currentPicker.querySelector('.preview').style.background = `rgb(${colorChange.r},${colorChange.g}, ${colorChange.b})`
                        const colorName = new NTC().colorName(rgbToHex(colorChange.r,colorChange.g,colorChange.b));
                        this.currentPicker.querySelector('.preview').innerHTML =
                        `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`   
                        this.getRgbElement(colorChange); 
                    }
                    else if(colorChange.hasOwnProperty("c") 
                    && colorChange.hasOwnProperty("m")
                    && colorChange.hasOwnProperty("y")
                    && colorChange.hasOwnProperty("k")
                    ){
                    const cmykToRgb = cmykToRgbReturnsObject(colorChange);
                    this.currentPicker.querySelector('#red').value = cmykToRgb.r;
                    this.currentPicker.querySelector('#green').value = cmykToRgb.g;
                    this.currentPicker.querySelector('#blue').value = cmykToRgb.b;
                    this.currentPicker.querySelector('#redText').value = cmykToRgb.r;
                    this.currentPicker.querySelector('#greenText').value = cmykToRgb.g;
                    this.currentPicker.querySelector('#blueText').value = cmykToRgb.b;

                    this.currentPicker.querySelector('.preview').style.background = `rgb(${cmykToRgb.r},${cmykToRgb.g}, ${cmykToRgb.b})`
                    const colorName = new NTC().colorName(rgbToHex(cmykToRgb.r,cmykToRgb.g,cmykToRgb.b));
                    this.currentPicker.querySelector('.preview').innerHTML =
                    `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`   
                    this.getRgbElement(cmykToRgb);
                    }
                    else if(colorChange.hasOwnProperty("h") 
                    && colorChange.hasOwnProperty("s")
                    && colorChange.hasOwnProperty("l")){
                    const hslToRgb = hslToRgbReturnsObject(colorChange);
                    this.currentPicker.querySelector('#red').value = hslToRgb.r;
                    this.currentPicker.querySelector('#green').value = hslToRgb.g;
                    this.currentPicker.querySelector('#blue').value = hslToRgb.b;
                    this.currentPicker.querySelector('#redText').value = hslToRgb.r;
                    this.currentPicker.querySelector('#greenText').value = hslToRgb.g;
                    this.currentPicker.querySelector('#blueText').value = hslToRgb.b;
                    this.currentPicker.querySelector('.preview').style.background = `rgb(${hslToRgb.r}, ${hslToRgb.g}, ${hslToRgb.b})`
                    this.currentPicker.querySelector('.preview').style.background = `rgb(${hslToRgb.r},${hslToRgb.g}, ${hslToRgb.b})`
                    const colorName = new NTC().colorName(rgbToHex(hslToRgb.r,hslToRgb.g,hslToRgb.b));
                    this.currentPicker.querySelector('.preview').innerHTML =
                    `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`   
                    this.getRgbElement(hslToRgb);

                    }
                }
             
                
                 hslColorChange(colorChange){ 
        if(colorChange.hasOwnProperty("h") 
            && colorChange.hasOwnProperty("s")
            && colorChange.hasOwnProperty("l")){
                this.currentPicker.querySelector('#hue').value =  colorChange.h;
                this.currentPicker.querySelector('#saturation').value = colorChange.s;
                this.currentPicker.querySelector('#lightness').value = colorChange.l;
                this.currentPicker.querySelector('#hueText').value = colorChange.h;
                this.currentPicker.querySelector('#saturationText').value = colorChange.s;
                this.currentPicker.querySelector('#lightnessText').value = colorChange.l;
                this.currentPicker.querySelector('.preview').style.background = `hsl(${colorChange.h}, ${colorChange.s}%, ${colorChange.l}%)`                
                const colorName =  new NTC().colorName(hslToHex(colorChange.h,colorChange.s,colorChange.l));
                this.currentPicker.querySelector('.preview').innerHTML =
                `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>` 
                this.getHslElement(colorChange);
        }
            else if(colorChange.hasOwnProperty("r") 
            && colorChange.hasOwnProperty("g")
            && colorChange.hasOwnProperty("b")){
            const rgbToHsl = rgbToHslReturnsObject(colorChange);
            this.currentPicker.querySelector('#hue').value = rgbToHsl.h;
            this.currentPicker.querySelector('#saturation').value = rgbToHsl.s;
            this.currentPicker.querySelector('#lightness').value = rgbToHsl.l;
            this.currentPicker.querySelector('#hueText').value = rgbToHsl.h;
            this.currentPicker.querySelector('#saturationText').value = rgbToHsl.s;
            this.currentPicker.querySelector('#lightnessText').value = rgbToHsl.l;
            
            this.currentPicker.querySelector('.preview').style.background = `hsl(${rgbToHsl.h}, ${rgbToHsl.s}%, ${rgbToHsl.l}%)`
            const colorName = new NTC().colorName(hslToHex(rgbToHsl.h,rgbToHsl.s,rgbToHsl.l));
            this.currentPicker.querySelector('.preview').innerHTML =
            `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`   
            this.getHslElement(rgbToHsl);
            }
            else  if(colorChange.hasOwnProperty("c") 
                && colorChange.hasOwnProperty("m")
                && colorChange.hasOwnProperty("y")
                && colorChange.hasOwnProperty("k")
                ){
                const cmykToHsl = cmykToHslReturnsObject(colorChange);
                this.currentPicker.querySelector('#hue').value = cmykToHsl.h;
                this.currentPicker.querySelector('#saturation').value = cmykToHsl.s;
                this.currentPicker.querySelector('#lightness').value = cmykToHsl.l;
                this.currentPicker.querySelector('#hueText').value = cmykToHsl.h;
                this.currentPicker.querySelector('#saturationText').value = cmykToHsl.s;
                this.currentPicker.querySelector('#lightnessText').value = cmykToHsl.l;

                this.currentPicker.querySelector('.preview').style.background = `hsl(${cmykToHsl.h}, ${cmykToHsl.s}%, ${cmykToHsl.l}%)`
                const colorName = new NTC().colorName(hslToHex(cmykToHsl.h,cmykToHsl.s,cmykToHsl.l));
                this.currentPicker.querySelector('.preview').innerHTML =
                `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`   
                this.getHslElement(cmykToHsl);

                }
    }

             
                


                cmykColorChange(colorChange){ 
                    if(colorChange.hasOwnProperty("c") 
                         && colorChange.hasOwnProperty("m")
                         && colorChange.hasOwnProperty("y")
                         && colorChange.hasOwnProperty("k")
                         ){     
                            this.currentPicker.querySelector('#cyan').value =  colorChange.c;
                            this.currentPicker.querySelector('#magenta').value = colorChange.m;
                            this.currentPicker.querySelector('#yellow').value =colorChange.y;
                            this.currentPicker.querySelector('#black').value = colorChange.k;

                            this.currentPicker.querySelector('#cyanText').value =  colorChange.c;
                            this.currentPicker.querySelector('#magentaText').value = colorChange.m;
                            this.currentPicker.querySelector('#yellowText').value =colorChange.y;
                            this.currentPicker.querySelector('#blackText').value = colorChange.k;


                            this.currentPicker.querySelector('.preview').style.background = cmykToHexInit(colorChange.c,colorChange.m,colorChange.y,colorChange.k);
                            const cmyk2hex = cmykToHexInit(colorChange.c,colorChange.m,colorChange.y,colorChange.k);
                            const colorName = new NTC().colorName(cmyk2hex);

                            this.currentPicker.querySelector('.preview').innerHTML =
                            `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`   
                            this.getCmykElement(colorChange); 
                             }
                         else if(colorChange.hasOwnProperty("r") 
                         && colorChange.hasOwnProperty("g")
                         && colorChange.hasOwnProperty("b")){
                         
                            const rgbToCmyk = rgbToCmykReturnsObject(colorChange);
                            this.currentPicker.querySelector('#cyan').value =  rgbToCmyk.c;
                            this.currentPicker.querySelector('#magenta').value = rgbToCmyk.m;
                            this.currentPicker.querySelector('#yellow').value =rgbToCmyk.y;
                            this.currentPicker.querySelector('#black').value = rgbToCmyk.k;
                            this.currentPicker.querySelector('#cyanText').value =  rgbToCmyk.c;
                            this.currentPicker.querySelector('#magentaText').value = rgbToCmyk.m;
                            this.currentPicker.querySelector('#yellowText').value =rgbToCmyk.y;
                            this.currentPicker.querySelector('#blackText').value = rgbToCmyk.k;

                
                            this.currentPicker.querySelector('.preview').style.background = 
                            cmykToHexInit(rgbToCmyk.c,rgbToCmyk.m,rgbToCmyk.y,rgbToCmyk.k);
                            const cmyk2hex = cmykToHexInit(rgbToCmyk.c,rgbToCmyk.m,rgbToCmyk.y,rgbToCmyk.k);        
                            const colorName = new NTC().colorName(cmyk2hex);
                            this.currentPicker.querySelector('.preview').innerHTML =
                            `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`
                            this.getCmykElement(rgbToCmyk);
                
                        }
                         else if(colorChange.hasOwnProperty("h") 
                         && colorChange.hasOwnProperty("s")
                         && colorChange.hasOwnProperty("l")){
                            const hslToCmyk = hslToCmykReturnsObject(colorChange);
                            this.currentPicker.querySelector('#cyan').value =  hslToCmyk.c;
                            this.currentPicker.querySelector('#magenta').value = hslToCmyk.m;
                            this.currentPicker.querySelector('#yellow').value =hslToCmyk.y;
                            this.currentPicker.querySelector('#black').value = hslToCmyk.k;
                            this.currentPicker.querySelector('#cyanText').value =  hslToCmyk.c;
                            this.currentPicker.querySelector('#magentaText').value = hslToCmyk.m;
                            this.currentPicker.querySelector('#yellowText').value =hslToCmyk.y;
                            this.currentPicker.querySelector('#blackText').value = hslToCmyk.k;
                            this.currentPicker.querySelector('.preview').style.background =
                            cmykToHexInit(hslToCmyk.c,hslToCmyk.m,hslToCmyk.y,hslToCmyk.k);
                            const cmyk2hex = cmykToHexInit(hslToCmyk.c,hslToCmyk.m,hslToCmyk.y,hslToCmyk.k);        
                            const colorName = new NTC().colorName(cmyk2hex);
                            this.currentPicker.querySelector('.preview').innerHTML =
                            `<span style="background: white;color:hsl(0, 0%, 20%);padding:10px;border-radius:15px;">${colorName}</span>`
                            this.getCmykElement(hslToCmyk); 
                          }
                 }

                   
                extenalColorSetters(colorChange){
                    if(typeof(colorChange) === "object"){

                        if(this.activePicker === "HSL"){
                        this.hslColorChange(colorChange);
                        }  
                        else if(this.activePicker === "RGB"){
                            this.rgbColorChange(colorChange);
                        }
                        else if(this.activePicker === "CMYK"){
                            this.cmykColorChange(colorChange)
                        }

                        if(this.pickerId){
                    colorManagers.updateColors(this.pickerId,colorsToRgb(colorChange))
                        }

                    }else{
                console.log("Omo invalid data type")
               return
               }
                }




                darkModeInit(){
                    if(this.pickerId){
                        const selectedColor = this.getSelectedColor(this.activePicker);
                        const colorToHsl = colorsToHsl(selectedColor);
                        
                        if(this.pickerId === "textPicker"){
                        colorToHsl.l = Math.min(colorToHsl.l + 30,90)
                        }else if (this.pickerId === "accentPicker"){
                            colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l -10))
                        }else if (this.pickerId === "backgroundPicker" ||this.pickerId === "mainPicker"){   
                            colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l -30))
                        }else if (this.pickerId === "secondaryPicker"){
                            colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l - 20))
                        }
    
                            this.extenalColorSetters(colorToHsl);
                            colorManagers.updateColors(this.pickerId,colorsToRgb(colorToHsl))
                            this.updateContrast(this.pickerId,this.contrastDiv);
                    }else{
                        return
                    }
                            }

                lightModeInit(){
                  if(this.pickerId){
                    const selectedColor = this.getSelectedColor(this.activePicker);
                    const colorToHsl = colorsToHsl(selectedColor);

                    if(this.pickerId === "textPicker"){
                        colorToHsl.l = Math.min(colorToHsl.l -30, 90);
                    }else if (this.pickerId === "accentPicker"){

                        colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l +10));

                    }else if (this.pickerId === "backgroundPicker" ||this.pickerId === "mainPicker"){

                        colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l + 30));

                    }else if (this.pickerId === "secondaryPicker"){

                        colorToHsl.l = Math.max(0, Math.min(100, colorToHsl.l  + 20));
                    }
                    this.extenalColorSetters(colorToHsl);     
                    colorManagers.updateColors(this.pickerId,colorsToRgb(colorToHsl))
                    this.updateContrast(this.pickerId,this.contrastDiv);
                    
                  }else{
                    return
                  }
                }


                eventListeners(){

                    this.sections = this.currentPicker.querySelector('.sections');
                    this.options  = this.currentPicker.querySelectorAll('.option');
                    this.activeSection = this.currentPicker.querySelector('.activeSection');
                    this.activeSelection = this.currentPicker.querySelector('.activeSelection');

                    this.activeSection.addEventListener('click', (event) =>{
                        this.sections.classList.toggle('active')
                        event.stopPropagation()
                    });           

                            
            document.addEventListener('click', (event) =>  {
                if (this.sections.classList.contains('active') && !this.sections.contains(event.target) && event.target !== this.activeSection) {
                this.sections.classList.remove('active');
                }
            })
           this.options.forEach(option =>{

            option.addEventListener('click', () =>{        
            this.selectedOption = option.getAttribute("value").toUpperCase();
            this.activeSelection.innerText = this.selectedOption;
            const selectedColor = this.getSelectedColor(this.activePicker);            

            if(this.selectedOption ==="hsl" || this.selectedOption ==="HSL"){                    
                    this.activePicker ="HSL";
                    const colorChange = hslColorChangeInit(selectedColor);
                    const newPickerElement = this.setCurrentPicker(this.activePicker,colorChange);
                    this.switchPickers(newPickerElement);
            }

            else if(this.selectedOption ==="rgb" || this.selectedOption ==="RGB"){
                    this.activePicker = "RGB";
                    const colorChange = rgbColorChangeInit(selectedColor); 
                    const newPickerElement = this.setCurrentPicker(this.activePicker,colorChange)
                    this.switchPickers(newPickerElement)
            }

            else if(this.selectedOption ==="cmyk" || this.selectedOption ==="CMYK"){
                this.activePicker = "CMYK";
                const colorChange = cmykColorChangeInit(selectedColor); 
                const newPickerElement = this.setCurrentPicker(this.activePicker,colorChange)
                this.switchPickers(newPickerElement)
            }

            this.sections.classList.remove('active');   
        })})
                }

                switchPickers(newPickerElement){
                    this.containerElement.replaceChild(newPickerElement, this.currentPicker);
                    this.currentPicker = newPickerElement
                    this.eventListeners();
                    this.debouncedSelectedColors();    
                }  




    }