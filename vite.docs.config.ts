import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const rootDir = resolve(__dirname, 'docs');

export default defineConfig({
  root: rootDir,
  publicDir: false,
  server: {
    fs: {
      allow: [rootDir, resolve(__dirname, 'src')],
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist-docs'),
    emptyOutDir: true,
  },
});
