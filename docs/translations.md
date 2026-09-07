# Translations

One site, shared components, separate static builds. English remains the source of truth. Danish is the first translation; its manual links lead to the English manual.

## Build and preview

```sh
npm run build                 # English → dist/client
npm run build:locale -- da    # Danish → dist/da
npm run dev:da               # Danish preview on port 3114
npm run check:translations   # Missing UI messages and stale/missing news
```

Each output contains its own domain, CNAME, canonical URLs, language metadata, language links, and news RSS feed. It can be uploaded to any static host. The existing English deployment stays unchanged. Domain registration/DNS and hosting for omarchy.dk must be configured separately; building does not publish anything.

## Add another language

1. Register its language code, native name, domain, date/number formatting locale, Open Graph locale, and manual availability in `src/i18n/locales.json`. Use a unique domain. Keep `manual: false` until its manual is translated.
2. Add `src/i18n/messages/<code>.json`. English strings are keys; translations are values. Product names, commands, keyboard shortcuts, URLs, and menu paths shown in the actual Omarchy interface remain unchanged. Copy the Danish catalogue as a coverage template, then translate from the English keys.
3. Add `src/i18n/<code>/blocks.json` for authored HTML prose on the imported main pages. Keys are the original HTML inside prose blocks. Preserve links, IDs, classes, images, and code. This avoids duplicating live patron and team lists.
4. Add `src/i18n/<code>/news.json` with each article's translated title and `sourceHash`, plus the full article HTML in `news/<original-slug>.html`. Keep original slugs across languages so language switching lands on the same article. The source hash is SHA-256 of the English title, a newline, and the English HTML from `src/data/news-posts.json`.
5. Run `npm run port`, `npm run check:translations`, and `npm run build:locale -- <code>`. Review the rendered pages at desktop and mobile widths before configuring the domain.

Only register a language when its main pages and news are ready. The registry also controls the footer language switch and search-engine alternate links. Translation builds include redirects from manual URLs to the English domain, preserving the chapter path. Once manual translation is implemented, the registry flag can be enabled for that language.

## Updating copy

Use `t('English source copy')` for shared interface text and add each language's version to its message catalogue. New English news requires a translated HTML file and metadata entry in every registered translation. Changed news is flagged by `check:translations`; review and update the translation **before** replacing its source hash. The check never silently approves a changed article.

Imported main-page prose uses exact HTML keys. When editing its English source, update the corresponding block key and translation. The automated check covers explicit UI calls and news freshness; prose wording, dynamic labels, accessibility attributes, and layout still need editorial review.

Third-party post quotes, video titles, event names, theme names, and product names retain their original wording. Danish uses Danish dates and number formatting, while funding amounts remain in USD.

The translation CI job builds every registered non-English language and uploads the output as an artifact. It does not deploy to regional domains. Adding another language does not require another fork, layout, or CI job.
