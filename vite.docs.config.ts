import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const rootDir = resolve(__dirname, 'docs');

// Helper to find all HTML files in docs
const getInputs = () => {
  const inputs: Record<string, string> = {
    main: resolve(rootDir, 'index.html'),
  };

  const files = readdirSync(rootDir);
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = file.replace('.html', '');
      inputs[name] = resolve(rootDir, file);
    }
  });

  return inputs;
};
  
export default defineConfig(({ command }) => ({
  root: rootDir,
  base: command === 'build' ? '/design-system/' : '/',
  publicDir: false,
  server: {
    fs: {
      allow: [rootDir, resolve(__dirname, 'src')],
    },
  }, 
  build: {
    outDir: resolve(__dirname, 'dist-docs'),
    emptyOutDir: true,
    rollupOptions: {
      input: getInputs(),
    },
  },
}));
