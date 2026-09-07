// Astro-build stand-in for @/lib/content in browser bundles. Route loaders
// never run here (pages load through src/astro/data.ts at build time), so
// only getSearchIndex is real: it reads the index the build emits.
import type { SearchEntry } from './search-index'

export type { SearchEntry } from './search-index'

export async function getSearchIndex(): Promise<Array<SearchEntry>> {
  const res = await fetch('/data/search-index.json')
  if (!res.ok) throw new Error('search index unavailable')
  return (await res.json()) as Array<SearchEntry>
}

function unavailable(name: string): Promise<never> {
  throw new Error(`${name} is never called in the Astro build`)
}

// Kept so unbuilt modules keep resolving; called only by TanStack loaders.
export function getManualToc(): Promise<never> {
  return unavailable('getManualToc')
}
export function getManualChapter(): Promise<never> {
  return unavailable('getManualChapter')
}
export function getNewsIndex(): Promise<never> {
  return unavailable('getNewsIndex')
}
export function getNewsPost(): Promise<never> {
  return unavailable('getNewsPost')
}
export function getPortedPage(): Promise<never> {
  return unavailable('getPortedPage')
}
