/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// Use Astro's `getViteConfig` helper so Vitest shares Astro's Vite resolution.
// Tests render `.astro` components via the Astro Container API
// (`experimental_AstroContainer`) and query output with `node-html-parser`.
export default getViteConfig({
  test: {
    // Single execution (not watch mode); the `test` script also passes --run.
    globals: true,
    environment: 'node',
  },
});
