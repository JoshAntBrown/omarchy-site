// Astro-build stand-in for @/lib/plugins in browser bundles. Cards and the
// palette only ever need pluginUrl; catalogue loaders run at build time
// through src/astro/data.ts instead.
import type { CatalogueEntry, Engagement } from '../lib/plugin-filter'

export type {
  CatalogueEntry,
  Engagement,
  PluginQuery,
  PluginSort,
  PluginSource,
} from '../lib/plugin-filter'

export type PluginWithStats = CatalogueEntry & { stats: Engagement }

export const PLUGINS_SITE = 'https://plugins.omarchy.org'
export const pluginUrl = (id: string) =>
  `${PLUGINS_SITE}/plugin.html?id=${encodeURIComponent(id)}`
export const PAGE_SIZE = 24
