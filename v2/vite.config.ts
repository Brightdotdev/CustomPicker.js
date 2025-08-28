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
        globals: {}
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*', 'lib/**/*', 'types/**/*'],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      outDir: 'dist',
      // This ensures proper declaration generation
      compilerOptions: {
        baseUrl: '.',
        paths: {
          "./lib/*": ["./lib/*"],
          "./types/*": ["./types/*"]
        }
      }
    })
  ],
  resolve: {
    alias: {
      // Add aliases to help with resolution
      '@lib': resolve(__dirname, 'lib'),
      '@types': resolve(__dirname, 'types')
    }
  }
});