import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ColorPicker',
      fileName: (format) => `color-picker.${format}.js`
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [],
      output: {
        globals: {
          // Define global variables for external dependencies
        }
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*', 'lib/**/*', 'types/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/lib': resolve(__dirname, 'lib'),
      '@/types': resolve(__dirname, 'types')
    }
  }
});