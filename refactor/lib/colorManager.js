// colorManager.js
import { getContrastRatio, getContrastIcon } from "./colorUtils.js";

export const colorManager = {
  colorValues: [],  // [{pickerId, value}]
  colorRatios: [],  // [{textToBg, textToAccent, textToMain}]

  /**
   * Update color values for a picker
   * @param {string} pickerId 
   * @param {object} value 
   */
  updateColor(pickerId, value) {
    const idx = this.colorValues.findIndex(p => p.pickerId === pickerId);
    if (idx !== -1) this.colorValues[idx].value = value;
    else this.colorValues.push({ pickerId, value });
    this.updateContrastRatios();
  },

  /**
   * Calculate contrast ratios between pickers
   */
  updateContrastRatios() {
    const getValue = id => this.colorValues.find(p => p.pickerId === id)?.value || { r:0,g:0,b:0 };
    const text = getValue("textPicker"), bg = getValue("backgroundPicker"), accent = getValue("accentPicker"), main = getValue("mainPicker");
    this.colorRatios = [{
      textToBg: getContrastIcon(getContrastRatio(text, bg)),
      textToAccent: getContrastIcon(getContrastRatio(text, accent)),
      textToMain: getContrastIcon(getContrastRatio(text, main)),
    }];
  }
};
