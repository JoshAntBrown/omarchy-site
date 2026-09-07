#!/usr/bin/env node
/** Copy passthrough files and generate redirects in dist/client after the Astro build. */
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ASSETS_ONLY, createRedirects, WHOLE } from './site-passthrough.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = path.resolve(process.env.OMARCHY_SITE_DIR ?? ROOT)
const OUT = path.join(ROOT, 'dist/client')

const copied = []
const missing = []

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

for (const rel of WHOLE) {
  const from = path.join(SITE, rel)
  if (!existsSync(from)) {
    missing.push(rel)
    continue
  }
  await cp(from, path.join(OUT, rel), { recursive: true, force: true })
  copied.push(rel)
}

/** Everything under a tree except index.html files. */
async function copyAssets(rel) {
  const from = path.join(SITE, rel)
  if (!existsSync(from)) {
    missing.push(rel)
    return
  }
  let n = 0
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(full)
      } else if (entry.name !== 'index.html') {
        const to = path.join(OUT, path.relative(SITE, full))
        await mkdir(path.dirname(to), { recursive: true })
        await cp(full, to, { force: true })
        n++
      }
    }
  }
  await walk(from)
  copied.push(`${rel} (${n} files, pages left to the app)`)
}

for (const rel of ASSETS_ONLY) await copyAssets(rel)

const { plugins } = JSON.parse(
  await readFile(new URL('../src/data/plugins.json', import.meta.url), 'utf8'),
)
const redirects = createRedirects(plugins)
for (const [from, to] of Object.entries(redirects)) {
  const canonical = to.startsWith('http') ? to : `https://omarchy.org${to}`
  const file = path.join(OUT, from, 'index.html')
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(
    file,
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting to ${escapeHtml(to)}</title>
<meta http-equiv="refresh" content="0;url=${escapeHtml(to)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta name="robots" content="noindex">
<script>window.location.replace(${JSON.stringify(to)})</script>
</head>
<body><p>This page moved to <a href="${escapeHtml(to)}">${escapeHtml(to)}</a>.</p></body>
</html>
`,
  )
  copied.push(`${from} -> ${to} (redirect page)`)
}

// Required entry points must exist; optional assets may be absent in partial checkouts.
for (const must of ['index.html', 'install', 'news/rss.xml', 'CNAME']) {
  if (!existsSync(path.join(OUT, must))) {
    console.error(`assemble: ${must} is missing from ${OUT}`)
    process.exit(1)
  }
}

console.log(`assemble: from ${SITE}`)
for (const c of copied) console.log(`  + ${c}`)
for (const m of missing) console.log(`  ! not in checkout: ${m}`)
const total = (await stat(OUT)).isDirectory() ? 'ok' : 'missing'
console.log(`assemble: dist/client ${total}`)
