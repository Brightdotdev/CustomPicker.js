/* /* 
// Helper function to convert RGB to relative luminance
function getLuminance(rgb) {
  let [r, g, b] = rgb.map(function (channel) {
      channel /= 255; // Normalize to 0-1 range
      return channel <= 0.03928
          ? channel / 12.92
          : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // Standard formula for luminance
}

// Function to calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05); // Formula for contrast ratio
}

// Function to convert hex to RGB
function hexToRgb(hex) {
  // Remove the hash (#) at the start if it's there
  hex = hex.replace(/^#/, '');
  // Parse the hex into its R, G, B components
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

// Function to check contrast between multiple colors
function checkColorContrast(textColor, bgColor, accentColor, mainColor, secondaryColor) {
  const textRgb = hexToRgb(textColor);
  const bgRgb = hexToRgb(bgColor);
  const accentRgb = hexToRgb(accentColor);
  const mainRgb = hexToRgb(mainColor);
  const secondaryRgb = hexToRgb(secondaryColor);

  // Compare each combination
  const textBgContrast = getContrastRatio(textRgb, bgRgb);
  const textAccentContrast = getContrastRatio(textRgb, accentRgb);
  const textMainContrast = getContrastRatio(textRgb, mainRgb);
  const textSecondaryContrast = getContrastRatio(textRgb, secondaryRgb);
  const bgAccentContrast = getContrastRatio(bgRgb, accentRgb);
  const mainSecondaryContrast = getContrastRatio(mainRgb, secondaryRgb);

  return {
      textBgContrast,
      textAccentContrast,
      textMainContrast,
      textSecondaryContrast,
      bgAccentContrast,
      mainSecondaryContrast
  };
}

// Example usage:
const contrastResult = checkColorContrast(
  "#ffffff",  // Text color
  "#000000",  // Background color
  "#ff6347",  // Accent color
  "#4682b4",  // Main color
  "#32cd32"   // Secondary color
);

console.log(contrastResult);




// Helper function to convert RGB to relative luminance
function getLuminance(rgb) {
  let [r, g, b] = rgb.map(function (channel) {
      channel /= 255; // Normalize to 0-1 range
      return channel <= 0.03928
          ? channel / 12.92
          : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // Standard formula for luminance
}

// Function to calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05); // Formula for contrast ratio
}

// Function to convert hex to RGB
function hexToRgb(hex) {
  // Remove the hash (#) at the start if it's there
  hex = hex.replace(/^#/, '');
  // Parse the hex into its R, G, B components
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

// Function to check contrast between multiple colors
function checkColorContrast(textColor, bgColor, accentColor, mainColor, secondaryColor) {
  const textRgb = hexToRgb(textColor);
  const bgRgb = hexToRgb(bgColor);
  const accentRgb = hexToRgb(accentColor);
  const mainRgb = hexToRgb(mainColor);
  const secondaryRgb = hexToRgb(secondaryColor);

  // Compare each combination
  const textBgContrast = getContrastRatio(textRgb, bgRgb);
  const textAccentContrast = getContrastRatio(textRgb, accentRgb);
  const textMainContrast = getContrastRatio(textRgb, mainRgb);
  const textSecondaryContrast = getContrastRatio(textRgb, secondaryRgb);
  const bgAccentContrast = getContrastRatio(bgRgb, accentRgb);
  const mainSecondaryContrast = getContrastRatio(mainRgb, secondaryRgb);

  return {
      textBgContrast,
      textAccentContrast,
      textMainContrast,
      textSecondaryContrast,
      bgAccentContrast,
      mainSecondaryContrast
  };
}

// Example usage:
const contrastResult = checkColorContrast(
  "#ffffff",  // Text color
  "#000000",  // Background color
  "#ff6347",  // Accent color
  "#4682b4",  // Main color
  "#32cd32"   // Secondary color
);

console.log(contrastResult);
 */
/* 
// Function to convert RGB to relative luminance
function luminance(r, g, b) {
  // Convert RGB to sRGB
  const a = [r, g, b].map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  // Calculate luminance
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Function to calculate the contrast ratio between two colors
function contrastRatio(color1, color2) {
  const lum1 = luminance(color1.r, color1.g, color1.b);
  const lum2 = luminance(color2.r, color2.g, color2.b);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Function to generate a contrasting color to a given base color
function generateContrastColor(baseColor, threshold = 4.5) {
  let contrastColor;
  do {
      // Generate random color
      contrastColor = {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256)
      };
  } while (contrastRatio(baseColor, contrastColor) < threshold);
  
  return contrastColor;
}

// Example usage: Given a base text color
const baseColor = { r: 120, g: 120, b: 120 }; // Example base color (Grayish)
const contrastingColor = generateContrastColor(baseColor);
console.log(contrastingColor);
 */


// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
  };
}

// Function to convert RGB to relative luminance
function luminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Function to calculate the contrast ratio between two colors
function contrastRatio(color1, color2) {
  const lum1 = luminance(color1.r, color1.g, color1.b);
  const lum2 = luminance(color2.r, color2.g, color2.b);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Function to generate a palette of n contrasting colors in HSL
function generateContrastPalette(baseColorHSL, n, threshold = 4.5) {
  const baseColorRGB = hslToRgb(baseColorHSL.h, baseColorHSL.s, baseColorHSL.l);
  const palette = [];

  while (palette.length < n) {
      // Generate random HSL color
      const randomHSL = {
          h: Math.floor(Math.random() * 360),  // Random hue (0-360)
          s: Math.floor(Math.random() * 101),  // Random saturation (0-100)
          l: Math.floor(Math.random() * 101)   // Random lightness (0-100)
      };
      
      // Convert random HSL color to RGB
      const randomRGB = hslToRgb(randomHSL.h, randomHSL.s, randomHSL.l);
      
      // Check contrast ratio
      if (contrastRatio(baseColorRGB, randomRGB) >= threshold) {
          // Add to palette if contrast ratio is above the threshold
          palette.push(randomHSL);
      }
  }

  return palette;
}

// Example usage: Generate a palette of 5 contrasting colors for a base HSL color
const baseColorHSL = { h: 210, s: 50, l: 40 }; // Example base color (HSL)
const palette = generateContrastPalette(baseColorHSL, 5); // Generate 5 contrasting colors
console.log(palette);
