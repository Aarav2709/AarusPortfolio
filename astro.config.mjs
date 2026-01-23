import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';

export default defineConfig({
  site: 'https://aarus2709.me',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },
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
