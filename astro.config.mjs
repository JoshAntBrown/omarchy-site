import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { devPassthrough } from './scripts/dev-passthrough.mjs'

// The static assembler and deployment workflows share dist/client.
export default defineConfig({
  server: { port: 3113 },
  output: 'static',
  site: 'https://omarchy.org',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
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
