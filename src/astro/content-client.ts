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
