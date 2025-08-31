import React, { useRef, useEffect, useState } from 'react';
import { COLORPICKERCLASS, CmykObject, HslObject, RgbObject } from '@brightdotdev/color-picker';

const DocumentationLanding: React.FC = () => {
  const [activeTab, setActiveTab] = useState('universal');
  const [selectedProperty, setSelectedProperty] = useState('background');
  const pickerContainerRef = useRef<HTMLDivElement>(null);
  const currentPickerRef = useRef<COLORPICKERCLASS | HslObject | RgbObject | CmykObject | null>(null);
  const demoElementRef = useRef<HTMLDivElement>(null);

  // Available CSS properties that accept colors
  const colorProperties = [
    { value: 'color', label: 'Text Color', description: 'Changes text color' },
    { value: 'background', label: 'Background', description: 'Sets element background' },
    { value: 'background-color', label: 'Background Color', description: 'Explicit background color' },
    { value: 'border-color', label: 'Border Color', description: 'All borders color' },
    { value: 'border-top-color', label: 'Top Border', description: 'Top border only' },
    { value: 'border-right-color', label: 'Right Border', description: 'Right border only' },
    { value: 'border-bottom-color', label: 'Bottom Border', description: 'Bottom border only' },
    { value: 'border-left-color', label: 'Left Border', description: 'Left border only' },
    { value: 'outline-color', label: 'Outline Color', description: 'Focus outline color' },
    { value: 'caret-color', label: 'Caret Color', description: 'Text cursor color' },
    { value: 'accent-color', label: 'Accent Color', description: 'Checkbox/radio/slider color' },
    { value: 'text-decoration-color', label: 'Text Decoration', description: 'Underline/strikethrough color' },
    { value: 'column-rule-color', label: 'Column Rule', description: 'Multi-column rule color' },
    { value: 'fill', label: 'SVG Fill', description: 'SVG shape fill color' },
    { value: 'stroke', label: 'SVG Stroke', description: 'SVG outline/stroke color' },
    { value: 'box-shadow', label: 'Box Shadow', description: 'Shadow behind elements' },
    { value: 'text-shadow', label: 'Text Shadow', description: 'Shadow behind text' },
    { value: 'scrollbar-color', label: 'Scrollbar Color', description: 'Scrollbar customization' },
    { value: 'selection-bg', label: 'Selection Background', description: 'Text selection background color' },
    { value: 'selection-text', label: 'Selection Text', description: 'Text selection text color' }
  ];

  // Function to reset all color styles on an element
  const resetAllColorStyles = (element: HTMLElement | SVGElement) => {
    const stylesToReset = [
      'color',
      'background',
      'backgroundColor',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'outlineColor',
      'boxShadow',
      'textShadow',
      'caretColor',
      'accentColor',
      'textDecorationColor',
      'columnRuleColor',
      'scrollbarColor'
    ];

    stylesToReset.forEach(style => {
      (element as HTMLElement).style.removeProperty(style);
    });

    // Reset SVG attributes if needed
    if (element instanceof SVGElement) {
      element.removeAttribute('fill');
      element.removeAttribute('stroke');
    }

    // Reset inline styles that might have been set
    (element as HTMLElement).style.backgroundImage = '';
    (element as HTMLElement).style.outline = '';
    (element as HTMLElement).style.border = '';
    (element as HTMLElement).style.borderTop = '';
    (element as HTMLElement).style.borderRight = '';
    (element as HTMLElement).style.borderBottom = '';
    (element as HTMLElement).style.borderLeft = '';
  };

  // Code examples for each tab
  const codeExamples = {
    universal: `import { COLORPICKERCLASS } from '@brightdotdev/color-picker';

// Initialize with a container element
const container = document.getElementById('color-picker-container');
const targetElement = document.getElementById('my-element');

const picker = new COLORPICKERCLASS({
  colorPickerContainer: container,
  colorPickerProps: {
    targetElementProps: {
      targetElement: targetElement,
      targetStylePorperty: "${selectedProperty}" // Choose from many CSS properties
    }
  }
});

// Set initial color
picker.setExternalColor({ r: 255, g: 0, b: 0 });

// Cleanup when done
// picker.dispose();`,

    hsl: `import { HslObject } from '@brightdotdev/color-picker';

// HSL Picker
const hslPicker = new HslObject({
  colorPickerContainer: container,
  targetElementProps: {
    targetElement: targetElement,
    targetStylePorperty: "${selectedProperty}" // Many CSS properties supported
  }
});

// Set initial HSL color
hslPicker.setExternalColor({ h: 240, s: 100, l: 50 });

// Get current color
const currentColor = hslPicker.getCurrentColor();

// Cleanup
// hslPicker.destroyPicker();`,

    rgb: `import { RgbObject } from '@brightdotdev/color-picker';

// RGB Picker  
const rgbPicker = new RgbObject({
  colorPickerContainer: container,
  targetElementProps: {
    targetElement: targetElement,
    targetStylePorperty: "${selectedProperty}" // Many CSS properties supported
  }
});

// Set initial RGB color
rgbPicker.setExternalColor({ r: 255, g: 100, b: 50 });

// Get current color  
const currentColor = rgbPicker.getCurrentColor();

// Cleanup
// rgbPicker.destroyPicker();`,

    cmyk: `import { CmykObject } from '@brightdotdev/color-picker';

// CMYK Picker
const cmykPicker = new CmykObject({
  colorPickerContainer: container,
  targetElementProps: {
    targetElement: targetElement,
    targetStylePorperty: "${selectedProperty}" // Many CSS properties supported
  }
});

// Set initial CMYK color
cmykPicker.setExternalColor({ c: 0, m: 100, y: 100, k: 0 });

// Get current color
const currentColor = cmykPicker.getCurrentColor();

// Cleanup
// cmykPicker.destroyPicker();`
  };

  // Clean up current picker
  const destroyCurrentPicker = () => {
    if (currentPickerRef.current) {
      if (currentPickerRef.current instanceof COLORPICKERCLASS) {
        currentPickerRef.current.dispose();
      } else {
        (currentPickerRef.current as any).destroyPicker();
      }
      currentPickerRef.current = null;
    }
    
    // Clear the container
    if (pickerContainerRef.current) {
      pickerContainerRef.current.innerHTML = '';
    }
  };

  // Initialize picker based on active tab
  const initializePicker = () => {
    if (!pickerContainerRef.current || !demoElementRef.current) return;
    
    // Destroy current picker first
    destroyCurrentPicker();

    // Reset all styles on the demo element before applying new ones
    if (demoElementRef.current) {
      resetAllColorStyles(demoElementRef.current);
    }

    switch (activeTab) {
      case 'universal':
        currentPickerRef.current = new COLORPICKERCLASS({
          colorPickerContainer: pickerContainerRef.current,
          colorPickerProps: {
            targetElementProps: {
              targetElement: demoElementRef.current,
              targetStylePorperty: selectedProperty as any
            }
          }
        });
        break;
      
      case 'hsl':
        currentPickerRef.current = new HslObject({
          colorPickerContainer: pickerContainerRef.current,
          targetElementProps: {
            targetElement: demoElementRef.current,
            targetStylePorperty: selectedProperty as any
          }
        });
        break;
      
      case 'rgb':
        currentPickerRef.current = new RgbObject({
          colorPickerContainer: pickerContainerRef.current,
          targetElementProps: {
            targetElement: demoElementRef.current,
            targetStylePorperty: selectedProperty as any
          }
        });
        break;
      
      case 'cmyk':
        currentPickerRef.current = new CmykObject({
          colorPickerContainer: pickerContainerRef.current,
          targetElementProps: {
            targetElement: demoElementRef.current,
            targetStylePorperty: selectedProperty as any
          }
        });
        break;
    }

    // Set initial color based on property type
    const initialColor = { r: 255, g: 100, b: 50 };
    if (currentPickerRef.current) {
      currentPickerRef.current.setExternalColor(initialColor);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle property change
  const handlePropertyChange = (property: string) => {
    // Reset styles before changing property
    if (demoElementRef.current) {
      resetAllColorStyles(demoElementRef.current);
    }
    setSelectedProperty(property);
  };

  // Initialize picker when tab or property changes
  useEffect(() => {
    initializePicker();
  }, [activeTab, selectedProperty]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyCurrentPicker();
    };
  }, []);

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here
      console.log('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };



  // Get demo element style based on selected property
  const getDemoElementStyle = () => {
    // Base reset style - completely clean slate
    const resetStyle = {
      padding: '1rem',
      borderRadius: '0.5rem',
      margin: '1rem 0',
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      
      // Reset all color properties to defaults
      color: '#333',
      background: 'white',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      outline: 'none',
      boxShadow: 'none',
      textShadow: 'none',
      backgroundImage: 'none'
    };

    // Now apply specific styles for the current property
    switch (selectedProperty) {
      case 'border-color':
        return { 
          ...resetStyle, 
          border: '3px solid #e5e7eb'
        };
      
      case 'border-top-color':
        return { 
          ...resetStyle, 
          borderTop: '3px solid #e5e7eb'
        };
      
      case 'border-right-color':
        return { 
          ...resetStyle, 
          borderRight: '3px solid #e5e7eb'
        };
      
      case 'border-bottom-color':
        return { 
          ...resetStyle, 
          borderBottom: '3px solid #e5e7eb'
        };
      
      case 'border-left-color':
        return { 
          ...resetStyle, 
          borderLeft: '3px solid #e5e7eb'
        };
      
      case 'box-shadow':
        return { 
          ...resetStyle, 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        };
      
      case 'text-shadow':
        return { 
          ...resetStyle, 
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
        };
      
      case 'outline-color':
        return { 
          ...resetStyle, 
          outline: '2px solid #e5e7eb'
        };

      case 'background':
      case 'background-color':
        // Show checkerboard pattern to visualize transparency
        return {
          ...resetStyle,
          backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        };

      case 'color':
        // For text color, make text prominent
        return {
          ...resetStyle,
          fontWeight: 'bold',
          fontSize: '1.1em'
        };

      default:
        return resetStyle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 sm:py-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tracking-tight flex items-center flex-wrap gap-2">
              <span className="whitespace-nowrap">@brightdotdev/color-picker</span>
              <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">v2</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-0">
              20+ CSS properties 🎨
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Quick Start - Mobile Friendly */}
        <section className="mb-6 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Quick Start</h2>
            <button 
              onClick={() => copyToClipboard('npm install @brightdotdev/color-picker')}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm transition-colors w-full sm:w-auto"
            >
              <span>npm install @brightdotdev/color-picker</span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </section>

        {/* Mobile-Optimized Demo Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Interactive Demo</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 p-4">
              {/* Controls Panel - Mobile First */}
              <div className="space-y-4">
                {/* Picker Type Tabs - Scrollable on Mobile */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Picker Type</h3>
                  <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                    {['universal', 'hsl', 'rgb', 'cmyk'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-lg capitalize text-sm font-medium transition-all
                          ${activeTab === tab 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        {tab === 'universal' ? 'Universal' : tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Selector - Full Width on Mobile */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-medium text-gray-700 mb-3">CSS Property</h3>
                  <select
                    value={selectedProperty}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {colorProperties.map((prop) => (
                      <option key={prop.value} value={prop.value}>
                        {prop.label} - {prop.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Live Preview - Better Mobile Spacing */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Live Preview</h3>
                  <div
                    ref={demoElementRef}
                    style={getDemoElementStyle()}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[120px] flex items-center justify-center p-4 text-center reset-styles"
                  >
                    <span className="text-inherit text-sm sm:text-base">
                      {selectedProperty.replace(/-/g, ' ')} preview
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Picker Panel - Full Width on Mobile */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  {activeTab === 'universal' ? 'Universal Picker' : `${activeTab.toUpperCase()} Picker`}
                </h3>
                <div 
                  ref={pickerContainerRef}
                  className="min-h-[350px] sm:min-h-[400px] bg-white rounded-lg shadow-inner p-4"
                />
              </div>
            </div>

            {/* Code Preview - Mobile Scrollable */}
            <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3 sticky top-0 bg-gray-50 py-2">
                <h3 className="font-medium text-gray-700">Implementation</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples[activeTab as keyof typeof codeExamples])}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <span>Copy</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto -mx-3 px-3">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm whitespace-pre-wrap break-words">
                  <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Better Mobile Layout */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🎨', title: 'Text & Background', desc: 'color, background, background-color' },
              { icon: '📏', title: 'Borders & Outlines', desc: 'border-color, outline-color' },
              { icon: '✨', title: 'Shadows & Effects', desc: 'box-shadow, text-shadow' },
              { icon: '🖱️', title: 'UI Elements', desc: 'caret-color, accent-color' },
              { icon: '🖼️', title: 'SVG Support', desc: 'fill, stroke for vector graphics' },
              { icon: '🎯', title: 'Selection', desc: 'Text selection styles' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile-Friendly Footer */}
        <footer className="text-center py-6 sm:py-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <a href="https://github.com/brightdotdev/color-picker" 
               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.npmjs.com/package/@brightdotdev/color-picker" 
               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/>
              </svg>
              <span>npm</span>
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            Built with ❤️ by Brightdotdev
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DocumentationLanding;