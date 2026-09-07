import catalogue from './current-messages.ts'
import registry from './locales.json' with { type: 'json' }

export type Locale = {
  name: string
  domain: string
  aliases?: string[]
  formatLocale: string
  ogLocale: string
  manual: boolean
}
export const locales: Record<string, Locale> = registry
export const language = import.meta.env?.PUBLIC_SITE_LOCALE || 'en'
if (!locales[language]) throw new Error(`Unknown site language: ${language}`)
export const locale = locales[language]
export const siteUrl = locale.domain

/** English is the source copy; each language keeps its own reviewed catalogue. */
export function t(english: string): string {
  return catalogue[english] ?? english
}

export function hasTranslation(code: string, path: string): boolean {
  return (
    Boolean(locales[code]) &&
    (!path.startsWith('/manual') || locales[code].manual)
  )
}

/** Keep untranslated chapters on the English site, including their fragments. */
export function localizedHref(href: string): string {
  return !locale.manual && /^\/manual(?:[/?#]|$)/.test(href)
    ? `${locales.en.domain}${href}`
    : href
}
