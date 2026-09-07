import { PageHeading } from '@/components/PageHeading'

export function NewsHeader({ article = false }: { article?: boolean }) {
  return <PageHeading title="News" as={article ? 'p' : 'h1'} />
}
