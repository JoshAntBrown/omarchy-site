import { PageHeading } from '@/components/PageHeading'
import themes from '@/data/themes.json'

export function ThemesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeading title="Community themes" />
      <div className="mx-auto max-w-2xl text-center">
        <p className="mt-3 text-[15px] italic leading-relaxed text-text-secondary [text-wrap:pretty]">
          A theme restyles the whole system at once. Install these community
          themes via{' '}
          <span className="font-medium text-text">
            Install &gt; Style &gt; Themes
          </span>{' '}
          in Omarchy. Want yours listed? Open a pull request on the site
          repository.
        </p>
      </div>

      <ul className="mt-10 grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <li key={theme.name}>
            <a
              href={theme.repo}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <img
                src={theme.image}
                alt={`${theme.name} theme screenshot`}
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                className="img-outlined aspect-video w-full rounded-lg bg-bg-deep object-cover"
              />
              <span className="mt-2.5 block font-mono text-[13px] text-text-secondary transition-colors duration-150 ease-out group-hover:text-text">
                {theme.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
