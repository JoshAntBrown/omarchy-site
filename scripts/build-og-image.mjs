/** Build the 1200x630 social card at public/brand/omarchy-og.png. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'public/brand/omarchy-og.png')
const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const W = 1200
const H = 630

const BG = '#0e0e14'
const RAMP = ['#39482e', '#4f6a3b', '#678549', '#9ece6a']

// The wordmark's own grid: 81 cells across, 19 down, each cell 51 wide by
// 50 tall in the SVG's units. The card keeps that aspect exactly.
const bitmap = fs.readFileSync(
  path.join(root, 'src/data/wordmark-bitmap.ts'),
  'utf8',
)
const ROWS = [...bitmap.matchAll(/'([01]{81})'/g)].map((m) => m[1])
if (ROWS.length !== 19) throw new Error(`expected 19 rows, read ${ROWS.length}`)

// Use whole pixels per cell so downsampling preserves sharp edges.
const CW = 11
const CH = 11
const COLS = Math.ceil(W / CW)
const GRID_ROWS = Math.ceil(H / CH)

const WM_COL = Math.round((COLS - 81) / 2)
const WM_ROW = 19

// Deterministic: the card should be the same picture every time it is built.
const rand = (() => {
  let s = 0x9e3779b9
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
})()

const lit = (r, c) => r >= 0 && r < 19 && c >= 0 && c < 81 && ROWS[r][c] === '1'
// Is any letter cell within `reach` cells of this one?
const within = (r, c, reach) => {
  for (let dr = -reach; dr <= reach; dr++)
    for (let dc = -reach; dc <= reach; dc++) if (lit(r + dr, c + dc)) return true
  return false
}

const cells = []
for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const wr = row - WM_ROW
    const wc = col - WM_COL
    if (lit(wr, wc)) continue

    const near1 = within(wr, wc, 1)
    if (near1) continue
    const near2 = within(wr, wc, 2)

    const dx = (col - (WM_COL + 40)) / 62
    const dy = (row - (WM_ROW + 9)) / 26
    const d = Math.sqrt(dx * dx + dy * dy)
    const near = Math.max(0, 1 - d)
    const chance = (0.014 + 0.15 * near * near) * (near2 ? 0.35 : 1)
    if (rand() > chance) continue

    const r = rand()
    const tier = near2
      ? 0
      : r < 0.52
        ? 0
        : r < 0.78
          ? 1
          : r < 0.93
            ? 2
            : near > 0.45
              ? 3
              : 2
    cells.push(
      `<i style="left:${(col * CW).toFixed(2)}px;top:${(row * CH).toFixed(2)}px;background:${RAMP[tier]}"></i>`,
    )
  }
}

const wordmark = fs
  .readFileSync(path.join(root, 'public/brand/omarchy-wordmark.svg'), 'utf8')
  .replace(/width="\d+" height="\d+"/, `width="${81 * CW}" height="${19 * CH}"`)

const html = `<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${BG};position:relative;overflow:hidden}
i{position:absolute;width:${CW}px;height:${CH}px;display:block}
svg{position:absolute;left:${WM_COL * CW}px;top:${WM_ROW * CH}px;display:block}
</style>
${cells.join('')}
${wordmark}
`

const tmp = path.join(root, 'node_modules/.cache-og.html')
fs.mkdirSync(path.dirname(tmp), { recursive: true })
fs.writeFileSync(tmp, html)

execFileSync(CHROME, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=2',
  `--window-size=${W},${H}`,
  `--screenshot=${out}`,
  `file://${tmp}`,
], { stdio: 'pipe' })

// Chrome shot it at 2x; halve it so the file is a plain 1200x630.
execFileSync('sips', ['-z', String(H), String(W), out], { stdio: 'pipe' })
fs.unlinkSync(tmp)

const { size } = fs.statSync(out)
console.log(
  `${path.relative(root, out)} - ${cells.length} field cells, ${(size / 1024).toFixed(0)} kB`,
)
