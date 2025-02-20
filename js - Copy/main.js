import { ColorPickers } from './colorPickers/colorPickers.js';

const testinng = document.getElementById("testing")

const testingBg = document.querySelectorAll(".testingBg");
const test = document.querySelectorAll(".maincolor")

const text = document.querySelectorAll(".text")
const testssss = document.querySelectorAll(".testssss")

const accent = document.querySelectorAll(".accent")



  


const mainRatio = document.querySelectorAll(".mainRatio")
const accentRatio = document.querySelectorAll(".accentRatio")
const backgroundContrast =  document.querySelectorAll(".backgroundContrast")



const mainCOlorPicker  =  new ColorPickers(testinng,test,"mainPicker",mainRatio)

const backgroundPicker  =  new ColorPickers(testinng,testingBg,"backgroundPicker",backgroundContrast)

const accentPicker  =  new ColorPickers(testinng,accent,"accentPicker",accentRatio)


const textColorPicer = new ColorPickers(testinng,text,"textPicker")


new ColorPickers(testinng,testssss)


const mainPicker = { h: 220, s: 190, l: 40 }; // Blue
const backgroundColor = { h: 90, s: 20, l: 40 }; // Blue

const accentColor = { h: 310, s: 60, l: 8 }; // Orange
const textColor = { h: 280, s: 5, l: 72 }; // Near black

mainCOlorPicker.extenalColorSetters(mainPicker);
backgroundPicker.extenalColorSetters(backgroundColor);

textColorPicer.extenalColorSetters(textColor)
accentPicker.extenalColorSetters(accentColor)





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




