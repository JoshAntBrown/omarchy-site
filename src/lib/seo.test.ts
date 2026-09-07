import assert from 'node:assert/strict'
import { test } from 'node:test'
import { excerptFromHtml, seo } from './seo.ts'

test('canonical and social URLs use the production site and trailing slash', () => {
  const head = seo({
    title: 'Hotkeys',
    description: 'Keyboard shortcuts',
    path: '/manual/hotkeys',
  })
  assert.equal(head.links[0].href, 'https://omarchy.org/manual/hotkeys/')
  assert.equal(
    head.meta.find((meta) => 'property' in meta && meta.property === 'og:url')
      ?.content,
    'https://omarchy.org/manual/hotkeys/',
  )
})

test('excerpts skip short introductions and decode prose as plain text', () => {
  assert.equal(
    excerptFromHtml(
      '<h1>Welcome</h1><p>Introduction</p><p>Omarchy &amp; its community make Linux a welcoming place for people who love their computers.</p>',
    ),
    'Omarchy & its community make Linux a welcoming place for people who love their computers.',
  )
})

test('removing tags cannot concatenate a new script tag', () => {
  const excerpt = excerptFromHtml(
    '<p>Omarchy has a long paragraph for this regression case: <scr<script>ipt>alert(1)</scr<script>ipt> with more text.</p>',
  )
  assert.equal(excerpt.includes('<script'), false)
})
