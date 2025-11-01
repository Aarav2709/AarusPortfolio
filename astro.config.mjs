import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aarus2709.me',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
