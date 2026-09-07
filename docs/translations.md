# Translations

One site, shared components, separate static builds. English remains the source of truth. Country editions cover our registered domains, and community editions have permanent language addresses under omarchy.org. Their manual links currently lead to the canonical English manual.

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

Only register a language when its main pages and news are ready. The registry also controls the globe switcher beside the theme button, the footer language switch and search-engine alternate links. Translation builds include redirects from manual URLs to the English domain, preserving the chapter path. Once manual translation is implemented, the registry flag can be enabled for that language.

## Updating copy

Use `t('English source copy')` for shared interface text and add each language's version to its message catalogue. New English news requires a translated HTML file and metadata entry in every registered translation. Changed news is flagged by `check:translations`; review and update the translation **before** replacing its source hash. The check never silently approves a changed article.

Imported main-page prose uses exact HTML keys. When editing its English source, update the corresponding block key and translation. The automated check covers UI calls, catalogue coverage, prose links, and news freshness; prose wording, dynamic labels, accessibility attributes, and layout still need editorial review.

Third-party post quotes, video titles, event names, theme names, and product names retain their original wording. Danish uses Danish dates and number formatting, while funding amounts remain in USD.

The translation CI job builds every registered non-English language and uploads the output as an artifact. It does not deploy to regional domains. Adding another language does not require another fork, layout, or CI job.

## Publish to Cloudflare

`npm run deploy:locale -- da` uploads the already-built Danish output to an `omarchy-da` Worker and prints its workers.dev URL. Set `CLOUDFLARE_ACCOUNT_ID` and authenticate Wrangler first. With the local `cf` wrapper's keyring connection:

```sh
npm run build:locale -- da
export CLOUDFLARE_ACCOUNT_ID=<your-account-id>
CLOUDFLARE_API_TOKEN="$(secret-tool lookup service cloudflare account api-token)" npm run deploy:locale -- da
```

The token stays in the child process environment and is never written to the repository. Use `--dry-run` to validate deployment configuration without uploading.

To connect the registered domain, create its Cloudflare zone, preserve any existing DNS records, and set the assigned nameservers through the registrar. Once the zone is active, run the same deployment command with `--domain`. It attaches the domain and any `aliases` from the locale registry, and Cloudflare provisions HTTPS. This is a separate step from deploying the workers.dev preview.

Regional deployments are currently explicit commands. CI builds translation artifacts but does not publish them. To automate publishing after merge, add a deployment job using a Cloudflare API token and account ID stored in GitHub Actions secrets.

## Country domains and fallback addresses

Every country edition has two permanent addresses: its national domain (for example `omarchy.dk`) and a fallback under the global domain (`dk.omarchy.org`). The fallback is an additional Worker custom domain, not a redirect to the national domain. Both host the same files independently; canonical and Open Graph URLs retain the national domain. Register both the fallback and `www` hostname in the locale's `aliases` list so subsequent deployments retain them.

Use country codes for fallback hostnames: `dk`, `jp`, `gr`, and so on. These need not match language codes (`da`, `ja`, `el`). Cloudflare custom domains handle routing and TLS directly; no manual apex CNAME is needed. The national domains use their assigned Cloudflare nameservers.

The language menu links to each edition’s canonical domain by default, including working national domains such as `omarchy.dk`. If a national domain is not ready, set `navigationDomain` to its verified HTTPS fallback address; remove the override after the national domain serves the correct language over valid HTTPS. This choice is shared by the globe selector and footer, regardless of which hostname the visitor uses. A `flag` field supplies the two-letter country code for editions whose primary hostname is under omarchy.org.

The language menu shows colored country flags and preserves the current pathname, query and fragment when the destination has a translation. Otherwise it opens that edition's home page. Language labels use their native spelling. The global English edition uses a globe.

The Singapore, New Zealand and US editions use `contentLocale: "en"` to reuse the English source, while retaining their own domains and regional formatting. Arabic declares `direction: "rtl"`.

### Country editions

| Language         | National domain                  | Fallback                                 |
| ---------------- | -------------------------------- | ---------------------------------------- |
| Dansk            | [omarchy.dk](https://omarchy.dk) | [dk.omarchy.org](https://dk.omarchy.org) |
| العربية          | [omarchy.ae](https://omarchy.ae) | [ae.omarchy.org](https://ae.omarchy.org) |
| Suomi            | [omarchy.fi](https://omarchy.fi) | [fi.omarchy.org](https://fi.omarchy.org) |
| Français         | [omarchy.fr](https://omarchy.fr) | [fr.omarchy.org](https://fr.omarchy.org) |
| Ελληνικά         | [omarchy.gr](https://omarchy.gr) | [gr.omarchy.org](https://gr.omarchy.org) |
| Magyar           | [omarchy.hu](https://omarchy.hu) | [hu.omarchy.org](https://hu.omarchy.org) |
| हिन्दी           | [omarchy.in](https://omarchy.in) | [in.omarchy.org](https://in.omarchy.org) |
| Íslenska         | [omarchy.is](https://omarchy.is) | [is.omarchy.org](https://is.omarchy.org) |
| 日本語           | [omarchy.jp](https://omarchy.jp) | [jp.omarchy.org](https://jp.omarchy.org) |
| 한국어           | [omarchy.kr](https://omarchy.kr) | [kr.omarchy.org](https://kr.omarchy.org) |
| Español (México) | [omarchy.mx](https://omarchy.mx) | [mx.omarchy.org](https://mx.omarchy.org) |
| English (NZ)     | [omarchy.nz](https://omarchy.nz) | [nz.omarchy.org](https://nz.omarchy.org) |
| Filipino         | [omarchy.ph](https://omarchy.ph) | [ph.omarchy.org](https://ph.omarchy.org) |
| Português        | [omarchy.pt](https://omarchy.pt) | [pt.omarchy.org](https://pt.omarchy.org) |
| Svenska          | [omarchy.se](https://omarchy.se) | [se.omarchy.org](https://se.omarchy.org) |
| English (SG)     | [omarchy.sg](https://omarchy.sg) | [sg.omarchy.org](https://sg.omarchy.org) |
| Türkçe           | [omarchy.tr](https://omarchy.tr) | [tr.omarchy.org](https://tr.omarchy.org) |
| English (US)     | [omarchy.us](https://omarchy.us) | [us.omarchy.org](https://us.omarchy.org) |

## Community-owned domains

Language editions also run directly on these hosts. National domains held by volunteers can forward visitors without transferring registration or nameservers.

| Language            | Primary address   | Additional address                |
| ------------------- | ----------------- | --------------------------------- |
| Vietnamese          | vi.omarchy.org    | vn.omarchy.org                    |
| Urdu                | ur.omarchy.org    | pk.omarchy.org                    |
| Bengali             | bn.omarchy.org    | bd.omarchy.org                    |
| Catalan             | ca.omarchy.org    | ad.omarchy.org                    |
| Sinhala             | si.omarchy.org    | lk.omarchy.org                    |
| Tamil               | ta.omarchy.org    | —                                 |
| Thai                | th.omarchy.org    | —                                 |
| Uzbek               | uz.omarchy.org    | —                                 |
| Italian             | it.omarchy.org    | —                                 |
| Simplified Chinese  | zh.omarchy.org    | cn.omarchy.org, zh-cn.omarchy.org |
| Polish              | pl.omarchy.org    | —                                 |
| Lithuanian          | lt.omarchy.org    | —                                 |
| Irish               | ga.omarchy.org    | ie.omarchy.org                    |
| English (Australia) | en-au.omarchy.org | au.omarchy.org                    |
| English (Nigeria)   | en-ng.omarchy.org | ng.omarchy.org                    |
| English (Zimbabwe)  | en-zw.omarchy.org | zw.omarchy.org                    |

Arabic also has `ar.omarchy.org`; Turkish already has `tr.omarchy.org`. The regional English editions reuse English content.

After verifying an edition is live, ask its domain owner to configure an HTTP 301 redirect from their apex and www hosts to the language address, preserving the path and query string. Both HTTP and HTTPS should work on the source domain. An existing Cloudflare redirect rule or registrar web-forwarding service may suffice. A DNS CNAME alone does not configure HTTP routing or issue a certificate for the source domain; do not present it as a substitute for a redirect or an explicitly provisioned custom domain.

Once a community-owned domain redirects correctly over HTTPS to its language edition, it can be set as `navigationDomain` while the language URL remains canonical. Verify the final page language and that paths survive the redirect before changing that preference. This field does not attach a Worker custom domain or change DNS.

Before promoting a community-owned national domain to canonical hosting, arrange its custom-domain routing and TLS, verify it serves the correct edition without a redirect loop, then update the registry and rebuild. Keep the language address working independently.

## Translating the manual next

Keep English chapters in the existing source repository. Store translations separately using stable chapter paths and section IDs, with a hash of the English source beside each translated section. Preserve executable commands, filenames and the interface's actual menu labels. When the source changes, require review of only the affected sections. Until a section is translated, render its English source with a clear language notice; never leave installation instructions missing. Enable a locale's `manual` flag only after the translated routing, fallback and source-freshness checks are implemented.
