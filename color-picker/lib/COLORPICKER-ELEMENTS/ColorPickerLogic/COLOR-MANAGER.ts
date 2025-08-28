import {getContrast,getContrastRatio} from "../../Utilities/MicroFunctionalities"



const ColorManager = {

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
