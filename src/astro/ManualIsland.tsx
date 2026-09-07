import { LoaderProvider } from './router-shim'
import { ManualLayout } from '../components/ManualLayout'
import { ManualChapterView } from '../components/ManualChapterView'
import type { getManualChapter } from './data'

export function ManualIsland({
  toc,
  chapter,
  prev,
  next,
  activePath,
}: ReturnType<typeof getManualChapter> & { activePath: string }) {
  return (
    <LoaderProvider value={null} activePath={activePath}>
      <ManualLayout toc={toc}>
        <ManualChapterView data={{ chapter, toc, prev, next }} />
      </ManualLayout>
    </LoaderProvider>
  )
}
