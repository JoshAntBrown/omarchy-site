import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { devPassthrough } from './scripts/dev-passthrough.mjs'

// Static output into dist/client, the folder GitHub Pages uploads: the same
// shape scripts/assemble-static.mjs lays the checkout's own files over.
export default defineConfig({
  server: { port: 3113 },
  output: 'static',
  site: 'https://omarchy.org',
  trailingSlash: 'always',
  outDir: './dist/client',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), devPassthrough()],
    optimizeDeps: { entries: ['!src/parked/**'] },
    resolve: {
      // Array form: exact entries first, so the shims win over the prefixes.
      alias: [
        {
          find: '@/lib/content',
          replacement: path.resolve('./src/astro/content-client.ts'),
        },
        {
          find: '@/lib/plugins',
          replacement: path.resolve('./src/astro/plugins-client.ts'),
        },
        // Components keep importing the router; in the Astro build those
        // imports resolve to the static shim in src/astro instead.
        {
          find: '@tanstack/react-router',
          replacement: path.resolve('./src/astro/router-shim.tsx'),
        },
        { find: '@', replacement: path.resolve('./src') },
        { find: '#', replacement: path.resolve('./src') },
      ],
    },
  },
})
