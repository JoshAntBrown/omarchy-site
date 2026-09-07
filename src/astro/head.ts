// Reads a route head() result (the shape seo() returns) into Base props,
// so Astro pages reuse the routes' own titles and descriptions verbatim.
type Meta =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

export function headProps(
  head: { meta?: Array<Meta>; links?: Array<{ rel: string; href: string }> },
  fallbackPath: string,
): {
  title: string
  description: string
  path: string
  type: 'website' | 'article'
} {
  let title = 'Omarchy'
  let description = ''
  let path = fallbackPath
  let type: 'website' | 'article' = 'website'
  for (const m of head.meta ?? []) {
    if ('title' in m) title = m.title
    else if ('name' in m && m.name === 'description') description = m.content
    else if ('property' in m && m.property === 'og:url') {
      try {
        path = new URL(m.content).pathname
      } catch {
        path = m.content
      }
    } else if (
      'property' in m &&
      m.property === 'og:type' &&
      m.content === 'article'
    )
      type = 'article'
  }
  const canonical = (head.links ?? []).find((l) => l.rel === 'canonical')?.href
  if (canonical) {
    try {
      path = new URL(canonical).pathname
    } catch {
      path = canonical
    }
  }
  return { title, description, path, type }
}
