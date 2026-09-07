import { cn } from '@/lib/utils'
import { PageWordmark } from '@/components/PageWordmark'

/**
 * Serves every standalone page ported from omarchy.org: /air, /foundation,
 * /meetups, /patrons, /security, /security/credits, /sponsorships,
 * /workstations, /potato, /server, /omakub, /brand. Unknown paths 404. The
 * teams page has a route of its own, built from teams.json.
 */
const NARROW = new Set([
  'patrons/badges',
  'server',
  'meetups',
  'air',
  'foundation',
  'sponsorships',
  'security',
  'security/credits',
  'brand',
  'omakub',
])

export interface PortedPageData {
  title: string
  html: string
}

export function PortedPage({
  page,
  slug,
}: {
  page: PortedPageData
  slug: string
}) {
  const path = (slug ?? '').replace(/\/+$/, '')
  const narrow = NARROW.has(path)
  const hasSubtitle = ['foundation', 'potato'].includes(path)
  const centred =
    path === 'patrons/badges' ||
    path === 'patrons' ||
    path.startsWith('security')

  return (
    <main
      className={cn(
        'mx-auto px-4 sm:px-6',
        path.startsWith('security') || path === 'patrons' ? 'py-8' : 'py-12',
        narrow ? 'max-w-3xl' : 'max-w-6xl',
      )}
    >
      {(path.startsWith('security') || path === 'patrons') && <PageWordmark />}
      <h1
        className={cn(
          path.startsWith('security') || path === 'patrons'
            ? 'page-subtitle text-[0.779625rem] font-normal text-text-secondary sm:text-[0.86625rem]'
            : 'text-3xl font-semibold tracking-tight text-text',
          centred && 'text-center',
        )}
      >
        {page.title}
      </h1>
      <div
        className={cn('prose ported', hasSubtitle ? 'mt-2' : 'mt-8')}
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </main>
  )
}
