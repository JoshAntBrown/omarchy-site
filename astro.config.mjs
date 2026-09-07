import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Static output into dist/client, the folder GitHub Pages uploads: the same
// shape scripts/assemble-static.mjs lays the checkout's own files over.
export default defineConfig({
  output: 'static',
  site: 'https://omarchy.org',
  trailingSlash: 'always',
  outDir: './dist/client',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
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
        // Resolve-only shims for the deleted server packages, imported by
        // unbuilt modules under src/parked.
        {
          find: '@tanstack/react-start',
          replacement: path.resolve('./src/astro/server-shim.ts'),
        },
        {
          find: '@tanstack/start-static-server-functions',
          replacement: path.resolve('./src/astro/server-shim.ts'),
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
