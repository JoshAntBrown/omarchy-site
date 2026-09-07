import React from 'react'
import { LoaderProvider } from './router-shim'
import { HomePage } from './pages/HomePage'
import type { HomeData } from './pages/HomePage'
import { NewsIndexPage, NewsPostPage } from './pages/NewsPages'
import type { NewsPost, NewsSummary } from '../lib/news'
import { ManualLayout } from '../components/ManualLayout'
import { ManualChapterView } from '../components/ManualChapterView'
import { TeamsPage } from './pages/TeamsPage'
import { ThemesPage } from './pages/ThemesPage'
import { PortedPage } from './pages/PortedPage'
import type { PortedPageData } from './pages/PortedPage'
import { MeetupsPage } from './pages/MeetupsPage'
import { NotFoundHero } from '../components/NotFoundHero'

// Each island renders its page component with build-time data. Only the
// manual keeps a provider, for the sidebar's prerendered active chapter.

export function HomeIsland({ data }: { data: HomeData }) {
  return <HomePage data={data} />
}

export function NewsIndexIsland({ data }: { data: Array<NewsSummary> }) {
  return <NewsIndexPage news={data} />
}

export function NewsPostIsland({ data }: { data: NewsPost }) {
  return <NewsPostPage post={data} />
}

export function ManualIsland({
  toc,
  chapter,
  prev,
  next,
  activePath,
}: {
  toc: Array<{ slug: string; title: string }>
  chapter: unknown
  prev: unknown
  next: unknown
  activePath: string
}) {
  return (
    <LoaderProvider value={null} activePath={activePath}>
      <ManualLayout toc={toc}>
        <ManualChapterView data={{ chapter, toc, prev, next } as never} />
      </ManualLayout>
    </LoaderProvider>
  )
}

export function TeamsIsland() {
  return <TeamsPage />
}

export function ThemesIsland() {
  return <ThemesPage />
}

export function PortedIsland({
  data,
  slug,
}: {
  data: PortedPageData
  slug: string
}) {
  return <PortedPage page={data} slug={slug} />
}

export function NotFoundIsland() {
  return <NotFoundHero />
}

export function MeetupsIsland({ rules }: { rules: string }) {
  return <MeetupsPage rules={rules} />
}
