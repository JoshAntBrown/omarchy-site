import { language, locale, localizedHref } from './site'
const metadata = import.meta.glob<Record<string, { title: string }>>(
  './*/news.json',
  { import: 'default', eager: true },
)
const newsMeta = metadata[`./${language}/news.json`] ?? {}
import { excerptFromHtml } from '../lib/seo'
import type { NewsPost } from '../lib/news'

const newsHtml = import.meta.glob<string>('./*/news/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function translateNews(post: NewsPost): NewsPost {
  if (language === 'en') return post
  const meta = (newsMeta as Record<string, { title: string }>)[post.slug]
  const html = newsHtml[`./${language}/news/${post.slug}.html`]
  if (!meta || !html)
    throw new Error(`Missing ${language} news translation: ${post.slug}`)
  return {
    ...post,
    title: meta.title,
    html: localizeLinks(html),
    excerpt: excerptFromHtml(html),
    dateStr: new Intl.DateTimeFormat(locale.formatLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(post.date)),
  }
}

const blockCatalogues = import.meta.glob<Record<string, string>>(
  './*/blocks.json',
  { import: 'default', eager: true },
)
const blocks = blockCatalogues[`./${language}/blocks.json`] ?? {}
import { t } from './site'

/** Translate authored prose blocks without copying live donor lists or asset markup. */
export function translateHtml(html: string): string {
  if (language === 'en') return html
  const translated = html.replace(
    /<(p|h2|h3|figcaption|li)\b([^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag: string, attrs: string, inner: string) => {
      const replacement = (blocks as Record<string, string>)[inner]
      return replacement ? `<${tag}${attrs}>${replacement}</${tag}>` : whole
    },
  )
  return localizeLinks(translated).replace(
    />([^<>]+)</g,
    (whole, text: string) => {
      const value = t(text.trim())
      return value === text.trim()
        ? whole
        : `>${text.match(/^\s*/)?.[0] ?? ''}${value}${text.match(/\s*$/)?.[0] ?? ''}<`
    },
  )
}

function localizeLinks(html: string): string {
  return html.replace(
    /href="(\/manual[^" ]*)"/g,
    (_, href: string) => `href="${localizedHref(href)}"`,
  )
}
