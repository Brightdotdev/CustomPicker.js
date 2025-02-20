    
     const hslToHex = (h, s, l) => {
        h = h / 360; 
        s = s / 100; 
        l = l / 100;  
      
        let r, g, b;
      
        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
      
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
      
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
      
        const toHex = (x) => {
          const hex = Math.round(x * 255).toString(16);
          return hex.length === 1 ? `0${hex}` : hex;
        };
      
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
  
//converts cmyk to hex for the ntc libary to work with it
    
const cmykToHex =(c, m, y, k) => {
        // Convert CMYK to RGB first caust cmyk is not browser suported
        let r = 255 * (1 - c ) * (1 - k );
        let g = 255 * (1 - m ) * (1 - k );
        let b = 255 * (1 - y ) * (1 - k );
      
        // then Convert RGB to HEX
        let hexR = Math.round(r).toString(16).padStart(2, '0');
        let hexG = Math.round(g).toString(16).padStart(2, '0');
        let hexB = Math.round(b).toString(16).padStart(2, '0');
      
        return `#${hexR}${hexG}${hexB}`;
      }

      const cmykToHexInit =(c, m, y, k) => {
        c = c / 100;
        m = m / 100; 
        y = y / 100;
        k = k / 100;
      
        // Convert CMYK to RGB
        let r = 255 * (1 - c) * (1 - k);
        let g = 255 * (1 - m) * (1 - k);
        let b = 255 * (1 - y) * (1 - k);
      
        // Convert RGB to HEX
        let hexR = Math.round(r).toString(16).padStart(2, '0');
        let hexG = Math.round(g).toString(16).padStart(2, '0');
        let hexB = Math.round(b).toString(16).padStart(2, '0');
      
        return `#${hexR}${hexG}${hexB}`;
      }


//converting cmyk to rgb
const cmykTorgb =(c, m, y, k) => {
  let r = 255 * (1 - c) * (1 - k);
  let g = 255 * (1 - m) * (1 - k);
  let b = 255 * (1 - y) * (1 - k);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}



//converting rgb to hex
 const rgbToHex =(r,g,b) =>
  {
    let hexR = Math.round(r).toString(16).padStart(2, '0');
    let hexG = Math.round(g).toString(16).padStart(2, '0');
    let hexB = Math.round(b).toString(16).padStart(2, '0');
  
    return `#${hexR.toUpperCase()}${hexG.toUpperCase()}${hexB.toUpperCase()}`;
  }



  const hslToRgb = (h, s, l)=> {
    // Convert h (0-360), s (0-100), l (0-100) to decimals
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Achromatic (grey)
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}


const rgbToHsl = (r, g, b) => {
  // Convert RGB (0-255) to decimals
  r /= 255;
  g /= 255;
  b /= 255;

  // Calculate HSL values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
      h = s = 0; // Achromatic (grey)
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  // Format HSL as a string
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}


const rgbToHslInit = (rgb) => {
  let [r, g, b] = rgb;
    
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
      h = s = 0; // achromatic
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
  };
}

  const cmykToHsl =  (c, m, y, k) =>{
    // Convert CMYK (0-100) to decimals
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    // Calculate RGB values
    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);

    // Calculate HSL from RGB
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Achromatic (grey)
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Format HSL as a string
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}



 
    // HSL to CMYK conversion
const hslToCmykReturnsObject = (hsl) => {
  const rgb = hslToRgbReturnsObject(hsl); // Convert HSL to RGB
    return rgbToCmykReturnsObject(rgb);      // Convert RGB to CMYK
}


const  rgbToCmykReturnsObject = ({ r, g, b }) => {
  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;

  const k = 1 - Math.max(rPrime, gPrime, bPrime);
  const c = Math.round(((1 - rPrime - k) / (1 - k)) * 100) || 0;
  const m = Math.round(((1 - gPrime - k) / (1 - k)) * 100) || 0;
  const y = Math.round(((1 - bPrime - k) / (1 - k)) * 100) || 0;

  return {
      c: Math.round(c),
      m: Math.round(m),
      y: Math.round(y),
      k: Math.round(k * 100)
  };
}

// RGB to HSL conversion
const  rgbToHslReturnsObject = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0, s = 0, l = (max + min) / 2;

  if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      switch (max) {
          case r: h = ((g - b) / delta + (g < b ? 6 : 0)) * 60; break;
          case g: h = ((b - r) / delta + 2) * 60; break;
          case b: h = ((r - g) / delta + 4) * 60; break;
      }
  }

  return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
  };
}



// CMYK to RGB conversion
const cmykToRgbReturnsObject = ({ c, m, y, k }) => {
  const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
  const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
  const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));

  return { r, g, b };
}

// CMYK to HSL conversion
const cmykToHslReturnsObject = (cmyk) => {
  const rgb = cmykToRgbReturnsObject(cmyk); // Convert CMYK to RGB
  return rgbToHslReturnsObject(rgb);        // Convert RGB to HSL
}



// HSL to RGB conversion
const hslToRgbReturnsObject = ({ h, s, l }) => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
  } else {
      r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}


const hexToRgb = (hex) => {
   // Remove the hash if it's there
   hex = hex.replace(/^#/, '');
    
   // Parse the hex values
   const bigint = parseInt(hex, 16);
   const r = (bigint >> 16) & 255;
   const g = (bigint >> 8) & 255;
   const b = bigint & 255;
   
   return [r, g, b];
}


export
 {
    hslToHex,
    cmykToHex,
    rgbToHex,
    cmykToHexInit,
    cmykTorgb,
    rgbToHsl,
    cmykToHsl,
    hslToRgb,
    hslToRgbReturnsObject,
    rgbToCmykReturnsObject,
    hslToCmykReturnsObject,
    cmykToRgbReturnsObject,
    rgbToHslReturnsObject,
    cmykToHslReturnsObject,
    rgbToHslInit,
    hexToRgb
 } 