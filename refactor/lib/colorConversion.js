// colorConversions.js
// Each function returns an object with standardized keys
// Example: {r,g,b}, {h,s,l}, {c,m,y,k}

export const rgbToHsl = ({r,g,b}) => {
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h,s,l = (max+min)/2;
  if(max===min){ h=s=0; } else {
    const d = max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){ case r: h=(g-b)/d+(g<b?6:0); break; case g: h=(b-r)/d+2; break; case b: h=(r-g)/d+4; break; }
    h=Math.round(h*60);
  }
  return { h, s:Math.round(s*100), l:Math.round(l*100) };
};

export const hslToRgb = ({h,s,l}) => {
  s/=100; l/=100;
  const k = n => (n + h/30) % 12;
  const a = s * Math.min(l,1-l);
  const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n),1)));
  return { r: Math.round(255*f(0)), g: Math.round(255*f(8)), b: Math.round(255*f(4)) };
};

// RGB↔CMYK
export const rgbToCmyk = ({r,g,b}) => {
  if(r===0 && g===0 && b===0) return {c:0,m:0,y:0,k:100};
  const c = 1 - r/255, m=1 - g/255, y=1 - b/255;
  const k=Math.min(c,m,y);
  return { c:Math.round((c-k)/(1-k)*100), m:Math.round((m-k)/(1-k)*100), y:Math.round((y-k)/(1-k)*100), k:Math.round(k*100) };
};

export const cmykToRgb = ({c,m,y,k}) => {
  return {
    r: Math.round(255*(1-c/100)*(1-k/100)),
    g: Math.round(255*(1-m/100)*(1-k/100)),
    b: Math.round(255*(1-y/100)*(1-k/100))
  };
};

export const cmykToHsl = cmyk => rgbToHsl(cmykToRgb(cmyk));
export const hslToCmyk = hsl => rgbToCmyk(hslToRgb(hsl));
export const rgbToHex = ({r,g,b}) => `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1).toUpperCase()}`;
export const hslToHex = hsl => rgbToHex(hslToRgb(hsl));
export const cmykToHex = cmyk => rgbToHex(cmykToRgb(cmyk));
