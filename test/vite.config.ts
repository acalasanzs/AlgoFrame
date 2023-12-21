// vite.config.ts
import { defineConfig } from 'vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// create a custom __dirname variable using ES6 modules
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // other options ...
  resolve: {
    alias: {
      // map '@' to the 'src' folder under the 'parent' folder
      '@': path.resolve(__dirname, '../src'),
    },
  },
});
