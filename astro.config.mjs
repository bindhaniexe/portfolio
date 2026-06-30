// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Tailwind CSS v4 is registered as a first-party Vite plugin
  // (CSS-first config lives in src/styles/global.css via @import "tailwindcss").
  vite: {
    plugins: [tailwindcss()],
  },
});
