import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import locales from '../src/i18n/locales.json' with { type: 'json' }

const json = (file) => JSON.parse(readFileSync(file, 'utf8'))
const posts = json('src/data/news-posts.json')
const messages = new Set()
const problems = []
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'parked' || entry.name === 'i18n') continue
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) collect(file)
    else if (/\.(tsx?|astro)$/.test(file)) {
      // Astro frontmatter and template calls also use t('literal').
      const source = readFileSync(file, 'utf8')
      const tree = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )
      const visit = (node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 't' &&
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0])
        )
          messages.add(node.arguments[0].text)
        ts.forEachChild(node, visit)
      }
      visit(tree)
    }
  }
}
collect('src')
const domains = new Set()
for (const [code, locale] of Object.entries(locales)) {
  if (!/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(code))
    problems.push(`Invalid language code: ${code}`)
  const url = new URL(locale.domain)
  if (
    url.protocol !== 'https:' ||
    url.pathname !== '/' ||
    domains.has(url.hostname)
  )
    problems.push(`Invalid or duplicate domain: ${locale.domain}`)
  domains.add(url.hostname)
  new Intl.DateTimeFormat(locale.formatLocale)
  if (code === 'en') continue
  const catalogue = json(`src/i18n/messages/${code}.json`)
  for (const message of messages) {
    if (!catalogue[message])
      problems.push(`${code}: missing message: ${message}`)
  }
  const news = json(`src/i18n/${code}/news.json`)
  for (const post of posts) {
    const translated = news[post.slug]
    const hash = createHash('sha256')
      .update(`${post.title}\n${post.html}`)
      .digest('hex')
    if (
      !translated?.title ||
      !existsSync(`src/i18n/${code}/news/${post.slug}.html`)
    )
      problems.push(`${code}: missing article: ${post.slug}`)
    else if (translated.sourceHash !== hash)
      problems.push(
        `${code}: source article changed; review translation: ${post.slug}`,
      )
    else {
      const html = readFileSync(
        `src/i18n/${code}/news/${post.slug}.html`,
        'utf8',
      )
      for (const attribute of ['href', 'src']) {
        const values = (text) =>
          [
            ...new Set(
              [
                ...text.matchAll(new RegExp(`${attribute}="([^"\\s]+)"`, 'g')),
              ].map((match) => match[1]),
            ),
          ].sort()
        if (JSON.stringify(values(post.html)) !== JSON.stringify(values(html)))
          problems.push(
            `${code}: article ${attribute} references differ: ${post.slug}`,
          )
      }
    }
  }
  if (!existsSync(`src/i18n/${code}/blocks.json`))
    problems.push(`${code}: missing main-page prose catalogue`)
}
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(
  `Translations checked: ${Object.keys(locales).join(', ')}; ${messages.size} UI messages, ${posts.length} news articles per language.`,
)
