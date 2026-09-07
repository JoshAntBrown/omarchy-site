import { spawnSync } from 'node:child_process'
import locales from '../src/i18n/locales.json' with { type: 'json' }

for (const code of Object.keys(locales).filter((code) => code !== 'en')) {
  const result = spawnSync(
    process.execPath,
    ['scripts/build-locale.mjs', code],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}
