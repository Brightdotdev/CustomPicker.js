import { colorsToRgb, getContrastRatio, getLuminance } from './colorPickerFunctionalities/minifuntionalities.js';
import { ColorPickers } from './colorPickers/colorPickers.js';

const testinng = document.getElementById("testing")


//color setters
const testingBg = document.querySelectorAll(".testingBg");
const test = document.querySelectorAll(".maincolor")
const text = document.querySelectorAll(".text")
const accent = document.querySelectorAll(".accent")


//ratio checkers div
const mainRatio = document.querySelectorAll(".mainRatio")
const accentRatio = document.querySelectorAll(".accentRatio")
const backgroundContrast =  document.querySelectorAll(".backgroundContrast")


//color pickers instances

const mainCOlorPicker  =  new ColorPickers(testinng,test,"mainPicker",mainRatio)

const backgroundPicker  =  new ColorPickers(testinng,testingBg,"backgroundPicker",backgroundContrast)

const accentPicker  =  new ColorPickers(testinng,accent,"accentPicker",accentRatio)

const textColorPicer = new ColorPickers(testinng,text,"textPicker")


const randomColor  = () => {
    const h = Math.floor(Math.random() *360);
    const s = Math.floor(Math.random() *50) +50;
    const l = Math.floor(Math.random() *40) +30 ;
    return{
        h,s,l
    }
}


//test colors
const mainPicker = { h: 220, s: 190, l: 40 }; // Blue
const backgroundColor = { h: 90, s: 20, l: 40 }; // Blue
const accentColor = { h: 310, s: 60, l: 8 }; // Orange
const textColor = { h: 280, s: 50, l: 10 }; // Near black



const adjustHue = (baseHue,ofssetHueTo) => {
        let newHue = (baseHue + ofssetHueTo) % 360;
        if (newHue < 0) newHue += 360;
        return newHue
}


const generateAnalogous = (baseColor,baseHue, attempts = 0) =>{
   
    if (attempts >= 10) {
        console.warn('Max attempts reached, returning base color.');
        return baseColor;
    }

    // Adjust hue by +/- 30 degrees to get analogous color
    const newHue = (baseHue + (Math.random() > 0.5 ? 30 : -30)) % 360;
    const randomS = Math.floor(Math.random() * 40) + 60; // Saturation between 20% and 70%
    const randomL = baseColor.l < 50 
    ? Math.floor(Math.random() * 30) + 60 // Light colors (60% to 90%)
    : Math.floor(Math.random() * 30) + 10; // Dark colors (10% to 40%)

    const generatedColor = { h: newHue, s: randomS, l: randomL };

    // Convert HSL colors to RGB for contrast ratio calculation
    const contrastRatio = getContrastRatio(colorsToRgb(generatedColor), colorsToRgb(baseColor));

    console.log(generatedColor, contrastRatio);

    // If contrast ratio is too low, recursively attempt to generate another analogous color
    if (contrastRatio <= 4) {
        return generateAnalogous(baseColor, baseHue, attempts + 1); 
    } else {
        return generatedColor;
    }
}


const generatePalletes = (baseColor,palleteSize,harmony) =>{
   
    const palletes = [baseColor];
    const baseHue = baseColor.h
    switch (harmony) {

        case "analogous":
            for (let i = 1; i < palleteSize; i++) {            
                  palletes.push(generateAnalogous(baseColor,baseHue))
            }
            break;
/* 
        case "analogous":
            for (let i = 1; i < palleteSize; i++) {
                if(i === palleteSize - 1){
                    const offset = Math.random(Math.floor() * 30) -15;
                    const newHue = Math.floor(adjustHue(baseHue,offset * i))
                    const randomS = Math.floor(Math.random() * 50) + 20;
                    const randomL = Math.floor(Math.random() * 10);
                    console.log(offset,baseHue,randomL,randomS,newHue)
                    palletes.push({h:newHue,s:randomS,l:randomL})
                }else{
            const offset = Math.random(Math.floor() * 30) -15;
            const newHue = Math.floor(adjustHue(baseHue,offset * i))
            const randomS = Math.floor(Math.random() * 30) + 50;
            const randomL = Math.floor(Math.random() * 50) + 40;
            console.log(offset,baseHue,randomL,randomS,newHue)
            palletes.push({h:newHue,s:randomS,l:randomL})
                }
            }
            break;
            case 'complementary':
                for (let i = 1; i < palleteSize; i++) {
                    const offset = (i % 2 === 0) ? 0 : 180;
                    const newHue = adjustHue(baseHue, offset);
                    const randomS = Math.floor(Math.random() * 20) + 60;
                    const randomL = Math.floor(Math.random() * 20) + 40;
                    palletes.push({ h: newHue, s: randomS, l: randomL });
                }
                break;
    
            case 'split-complementary':
                for (let i = 1; i < palleteSize; i++) {
                    const offset = (i % 2 === 0) ? 150 : 210; 
                    const newHue = adjustHue(baseHue, offset);
                    const randomS = Math.floor(Math.random() * 20) + 60;
                    const randomL = Math.floor(Math.random() * 20) + 40;
                    palletes.push({ h: newHue, s: randomS, l: randomL });
                }
                break;
    
            case 'triadic':
                for (let i = 1; i < palleteSize; i++) {
                    const offset = i * 120;
                    const newHue = adjustHue(baseHue, offset);
                    const randomS = Math.floor(Math.random() * 20) + 60;
                    const randomL = Math.floor(Math.random() * 20) + 40;
                    palletes.push({ h: newHue, s: randomS, l: randomL });
                }
                break;
    
            case 'tetradic':
                for (let i = 1; i < palleteSize; i++) {
                    const offset = (i % 2 === 0) ? 90 : 180;
                    const newHue = adjustHue(baseHue, offset * i);
                    const randomS = Math.floor(Math.random() * 20) + 60;
                    const randomL = Math.floor(Math.random() * 20) + 40;
                    palletes.push({ h: newHue, s: randomS, l: randomL });
                }
                break;
    
            case 'monochromatic':
                for (let i = 1; i < palleteSize; i++) {
                    const newL = Math.floor(Math.random() * 40) + 30;
                    palletes.push({ h: baseHue, s: baseColor.s, l: newL });
                }
                break; */
        default:
            console.log("omo")
            break;
    }

    return palletes

} 

    const tsts = generatePalletes(randomColor(),4,"analogous")
    console.log(tsts);
 backgroundPicker.setExternalColor(tsts[2])
    mainCOlorPicker.setExternalColor(tsts[1])
    accentPicker.setExternalColor(tsts[3])
    textColorPicer.setExternalColor(tsts[0])



//lightMode darkmode init

document.querySelector(".lightMode").addEventListener("click", () =>{
    backgroundPicker.lightModeInit()
    mainCOlorPicker.lightModeInit()
    accentPicker.lightModeInit()
    textColorPicer.lightModeInit()
    document.querySelector(".darkMode").style.display = "block";
    document.querySelector(".lightMode").style.display = "none";
})
document.querySelector(".darkMode").addEventListener("click", () =>{
    mainCOlorPicker.darkModeInit()
    backgroundPicker.darkModeInit();
    accentPicker.darkModeInit()
    textColorPicer.darkModeInit()
    document.querySelector(".lightMode").style.display = "block";
    document.querySelector(".darkMode").style.display = "none";
})




