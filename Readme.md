# CustomPicker.js

**A lightweight, framework-agnostic color picker built with TypeScript.**

Supports **HSL, RGB, and CMYK** with real-time conversion, automatic styling, eye dropper tool, and live preview on 20+ CSS properties.

[Live Demo](https://custom-picker-js.pages.dev/) · [npm](https://www.npmjs.com/package/@brightdotdev/color-picker)

## ✨ Features

- HSL, RGB & CMYK color spaces with seamless real-time conversion
- Automatic CSS injection — no manual stylesheet imports needed
- Truly framework-agnostic: works with React, Vue, Angular, or vanilla JavaScript
- Live preview on 20+ CSS properties (`background`, `color`, `border-color`, `box-shadow`, `accent-color`, SVG `fill`/`stroke`, etc.)
- Built-in Eye Dropper tool
- One-click copy in multiple formats
- Zero dependencies & fully tree-shakable
- Full TypeScript support

## 🚀 Installation

```bash
npm install @brightdotdev/color-picker
```

## Usage

### Vanilla JavaScript

```ts
import { COLORPICKERCLASS } from '@brightdotdev/color-picker';

const container = document.getElementById('picker-container')!;
const target = document.getElementById('my-target')!;

const picker = new COLORPICKERCLASS({
  colorPickerContainer: container,
  colorPickerProps: {
    targetElementProps: {
      targetElement: target,
      targetStyleProperty: 'background'   // Try 'color', 'border-color', 'box-shadow', etc.
    }
  }
});

// Set initial color
picker.setExternalColor({ r: 0, g: 122, b: 255 });
```

### React Example

```tsx
import { useRef, useEffect } from 'react';
import { COLORPICKERCLASS } from '@brightdotdev/color-picker';

function MyColorPicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const picker = new COLORPICKERCLASS({
      colorPickerContainer: containerRef.current,
      colorPickerProps: {
        targetElementProps: {
          targetElement: document.getElementById('preview')!,
          targetStyleProperty: 'background'
        }
      }
    });

    return () => picker.dispose();
  }, []);

  return <div ref={containerRef} />;
}
```

You can also import individual color objects: `HslObject`, `RgbObject`, or `CmykObject`.

## Supported CSS Properties

- **Text & Background**: `color`, `background`, `background-color`
- **Borders**: `border-color`, `border-*-color`, `outline-color`
- **UI Elements**: `caret-color`, `accent-color`, `text-decoration-color`
- **SVG**: `fill`, `stroke`
- **Effects**: `box-shadow`, `text-shadow`
- **Others**: `scrollbar-color`, selection colors

## Useful Methods

- `setExternalColor(color)` — Set color (accepts RGB | HSL | CMYK object)
- `getCurrentColor()` — Get current color object
- `dispose()` — Clean up the picker instance

## Browser Support

Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+).  
Eye Dropper requires a recent version of Chrome/Edge.

---

**Made with ❤️ by Brightdotdev**
