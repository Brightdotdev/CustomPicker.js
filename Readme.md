# @brightdotdev/color-picker - CustomPickers.js

A lightweight, framework-agnostic color picker library built with TypeScript. Supports HSL, RGB, and CMYK color spaces with automatic CSS injection and 20+ CSS property targeting.

## 📦 npm Package

```bash
npm install @brightdotdev/color-picker
```

## 🚀 Live Demo

Check out the live demo to see all features in action:  
**[Live Demo Page](https://custom-picker-js.pages.dev/)**

## ✨ Features

- 🎯 **Multiple Color Spaces** : HSL, RGB, and CMYK support with real-time conversion
- ⚡ **Automatic Styling**: No CSS imports needed - styles inject automatically
- 🔧 **Framework Agnostic**: Works with React, Vue, Angular, or vanilla JavaScript
- 🎨 **20+ CSS Properties**: Target text, backgrounds, borders, shadows, SVG, and more
- 👁️ **Eye Dropper Tool**: Pick colors from anywhere on your screen
- 📋 **Copy to Clipboard**: One-click copy color values in multiple formats
- 🎯 **Live Preview**: Real-time updates on target elements
- 🔄 **Color Space Switching**: Seamless conversion between color spaces
- 📦 **Zero Dependencies**: Lightweight and tree-shakable

## 🏁 Quick Start

### Installation

```bash
npm install @brightdotdev/color-picker
```

### Basic Usage

```javascript
import { COLORPICKERCLASS } from '@brightdotdev/color-picker';

const container = document.getElementById('color-picker-container');
const targetElement = document.getElementById('my-element');

const picker = new COLORPICKERCLASS({
  colorPickerContainer: container,
  colorPickerProps: {
    targetElementProps: {
      targetElement: targetElement,
      targetStylePorperty: 'background' // or any CSS color property
    }
  }
});

// Set initial color
picker.setExternalColor({ r: 255, g: 0, b: 0 });
```

## 🎨 Supported CSS Properties

Your color picker can target these CSS properties:

### Text & Background
- `color` - Text color
- `background` - Background shorthand
- `background-color` - Explicit background color

### Borders & Outlines
- `border-color` - All borders
- `border-top-color` - Top border only
- `border-right-color` - Right border only
- `border-bottom-color` - Bottom border only
- `border-left-color` - Left border only
- `outline-color` - Focus outline color

### UI & Forms
- `caret-color` - Input cursor color
- `accent-color` - Checkbox/radio/slider color
- `text-decoration-color` - Underline/strikethrough color

### SVG
- `fill` - SVG shape fill color
- `stroke` - SVG outline/stroke color

### Shadows & Effects
- `box-shadow` - Element shadows
- `text-shadow` - Text shadows

### Selection & Scrollbars
- `selection-bg` - Text selection background
- `selection-text` - Text selection text color
- `scrollbar-color` - Scrollbar styling

## 📖 Documentation

### Universal Picker (All Color Spaces)

```javascript
import { COLORPICKERCLASS } from '@brightdotdev/color-picker';

const picker = new COLORPICKERCLASS({
  colorPickerContainer: document.getElementById('picker-container'),
  colorPickerProps: {
    targetElementProps: {
      targetElement: document.getElementById('target-element'),
      targetStylePorperty: 'border-color'
    }
  }
});

// Set initial color
picker.setExternalColor({ h: 240, s: 100, l: 50 });

// Cleanup when done
picker.dispose();
```

### Individual Color Pickers

```javascript
import { HslObject, RgbObject, CmykObject } from '@brightdotdev/color-picker';

// HSL Picker
const hslPicker = new HslObject({
  colorPickerContainer: container,
  targetElementProps: {
    targetElement: targetElement,
    targetStylePorperty: 'color'
  }
});

// Get current color
const currentColor = hslPicker.getCurrentColor();

// Cleanup
hslPicker.destroyPicker();
```

### React Usage

```jsx
import React, { useRef, useEffect } from 'react';
import { COLORPICKERCLASS } from '@brightdotdev/color-picker';

function ColorPicker() {
  const containerRef = useRef();

  useEffect(() => {
    const picker = new COLORPICKERCLASS({
      colorPickerContainer: containerRef.current,
      colorPickerProps: {
        targetElementProps: {
          targetElement: document.getElementById('preview'),
          targetStylePorperty: 'background'
        }
      }
    });

    return () => picker.dispose();
  }, []);

  return <div ref={containerRef} />;
}
```

## 🔧 API Reference

### Color Types

```typescript
interface RGB { r: number; g: number; b: number; }        // 0-255
interface HSL { h: number; s: number; l: number; }        // 0-360, 0-100, 0-100
interface CMYK { c: number; m: number; y: number; k: number; } // 0-100

type AnyColor = RGB | HSL | CMYK;
```

### Methods

- `setExternalColor(color: AnyColor)` - Set color programmatically
- `getCurrentColor()` - Get current color values
- `dispose()` / `destroyPicker()` - Cleanup methods

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**Note**: EyeDropper API requires Chrome 95+ or Edge 95+

## 🤝 Contributing & Feedback

### 🎯 We Welcome Contributions!

This is a **100% open source project** and we actively encourage community participation! Here's how you can help:

#### 🐛 Report Bugs
Found an issue? Please let us know! 
- 📝 [Create a GitHub Issue](https://github.com/Brightdotdev/CustomPicker.js/issues)
- 🔍 Include browser version and reproduction steps
- 📸 Screenshots are always helpful!

#### 💡 Suggest Features
Have an idea to make this better?
- 💬 [Start a Discussion](https://github.com/Brightdotdev/CustomPicker.js/discussions)
- 🎯 Explain your use case
- 🤔 Alternative solutions you've considered

#### 🛠️ Code Contributions
Want to contribute code? Fantastic!
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/your-feuture`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/your-feuture`)
5. 🔀 Open a Pull Request

#### 📋 Good First Issues
New to open source? Look for issues tagged `good-first-issue` to get started!

#### 🧪 Testing Help
Help us test across different:
- 🌐 Browsers (Chrome, Firefox, Safari, Edge)
- 📱 Devices (Desktop, Tablet, Mobile)
- ⚡ Frameworks (React, Vue, Angular, Vanilla JS)

#### 📚 Documentation Improvements
Found a typo? Need better examples? Documentation contributions are especially welcome!

### 🏆 Contribution Guidelines

We follow a **friendly, inclusive, and welcoming** environment. Please:
- ✅ Be respectful and constructive
- ✅ Follow the code style and conventions
- ✅ Add tests for new functionality
- ✅ Update documentation when changing features

### 📬 Get in Touch
- 💬 [GitHub Discussions](https://github.com/Brightdotdev/CustomPicker.js/discussions) - For ideas and questions
- 🐛 [GitHub Issues](https://github.com/Brightdotdev/CustomPicker.js/issues) - For bugs and problems
- 📧 Email: [mail.bright.dev@gmail.com] - For private discussions


## 📝 License

MIT License - see LICENSE file for details. This means you can use, modify, and distribute this software freely!



**⭐ Love this project?** 
- Give it a star on [GitHub](https://github.com/Brightdotdev/CustomPicker.js) ⭐
- Share it with your developer friends 🚀
- Consider contributing 🤝

**📦 npm Package**: [`@brightdotdev/color-picker`](https://www.npmjs.com/package/@brightdotdev/color-picker)

**🌐 Live Demo**: [Check out the demo](https://custom-picker-js.pages.dev/) to see all features in action!

---

 This project is maintained with by [Brightdotdev |  Bright ](https://github.com/brightdotdev) (for now)

