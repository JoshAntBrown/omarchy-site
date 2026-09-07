import { PageWordmark } from '@/components/PageWordmark'

export function PageHeading({
  title,
  brand = 'omarchy',
  as: Title = 'h1',
  className,
}: {
  title: string
  brand?: 'omarchy' | 'oma'
  as?: 'h1' | 'p'
  className?: string
}) {
  return (
    <header className={className}>
      <PageWordmark brand={brand} />
      <Title className="page-subtitle text-center text-[0.779625rem] font-normal text-text-secondary sm:text-[0.86625rem]">
        {title}
      </Title>
    </header>
  )
}
