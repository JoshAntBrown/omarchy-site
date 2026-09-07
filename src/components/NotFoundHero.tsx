import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { HeroShader } from '@/components/HeroShader'
import { HeroNavGhost } from '@/components/SiteHeader'
import { NotFoundWordmark } from '@/components/Brand'
import { ArrowLeftIcon } from '@/components/icons'
import {
  NOT_FOUND_HEIGHT,
  NOT_FOUND_ROWS,
  NOT_FOUND_WIDTH,
} from '@/data/not-found-bitmap'
import { WORDMARK_HEIGHT } from '@/data/wordmark-bitmap'
import { Button } from '@/components/ui/button'
import { useTopLink } from '@/lib/hash-scroll'

const GLYPH = {
  rows: NOT_FOUND_ROWS,
  width: NOT_FOUND_WIDTH,
  height: NOT_FOUND_HEIGHT,
}

export function NotFoundHero() {
  const navigate = useNavigate()
  const [painted, setPainted] = useState(false)
  const home = useTopLink()

  return (
    // The header watches this hero sentinel and paints its blended labels here.
    <main>
      <section
        data-hero-sentinel
        className="pixel-container relative -mt-(--nav-h) flex min-h-svh flex-col overflow-hidden border-b border-border-subtle pt-(--nav-h) select-none [-webkit-touch-callout:none]"
        style={{ background: 'var(--t-field-bg)' }}
      >
        <HeroShader
          glyph={GLYPH}
          onPainted={() => setPainted(true)}
          onGlyphPress={() => void navigate({ to: '/' })}
        />

        <HeroNavGhost />

        <div className="pointer-events-none relative flex flex-1 flex-col items-center px-6">
          <div className="flex-[2.1]" />
          {/* Match the homepage wordmark cell size and vertical alignment. */}
          <div
            className="flex w-full items-center justify-center"
            style={{ height: `calc(var(--pxr) * ${WORDMARK_HEIGHT})` }}
          >
            <div
              style={{
                width: `min(calc(var(--pxc) * ${NOT_FOUND_WIDTH}), 100%)`,
              }}
            >
              <NotFoundWordmark
                data-hero-wordmark
                label="Not found"
                className={
                  'w-full text-[color:var(--t-field-lit)]' +
                  (painted ? ' invisible' : '')
                }
              />
            </div>
          </div>
          <div className="flex-1" />

          <div
            data-hero-quiet
            className="pointer-events-auto flex w-full max-w-2xl flex-col items-center pb-24 text-center"
          >
            <h1 className="text-2xl font-medium tracking-tight text-text [text-wrap:balance] sm:text-3xl">
              <span className="sr-only">404: </span>
              There is nothing at this address.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
              <span className="block [text-wrap:balance]">
                The link may be old,
              </span>
              <span className="block [text-wrap:balance]">
                or the page may have moved.
              </span>
            </p>
            {/* A real control, because the word above is a canvas: keyboards
              and anything without JavaScript need a way out of here too. */}
            <div className="mt-9 flex w-full max-w-xs flex-col items-stretch sm:w-auto sm:max-w-none">
              <Button
                size="lg"
                variant="outline"
                className="lg:h-[calc(var(--pxr)*4)]"
                nativeButton={false}
                onClick={home}
                render={<Link to="/" />}
              >
                <ArrowLeftIcon data-icon="inline-start" />
                Back to Omarchy
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
