import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ColorPicker',
      fileName: (format) => `color-picker.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        // This bundles CSS into JS
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some(n => n.endsWith('.css'))) {
            return 'color-picker.css';
          }
          return assetInfo.names && assetInfo.names.length > 0 ? assetInfo.names[0] : 'asset';
        }
      }
    },
    // Emit CSS as a separate file
    cssCodeSplit: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*', 'lib/**/*', 'types/**/*'],
    })
  ]
});