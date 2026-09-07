import { OmarchyWordmark, WORDMARK_BANDS } from '@/components/Brand'

export function PageWordmark({
  brand = 'omarchy',
}: {
  brand?: 'omarchy' | 'oma'
}) {
  if (brand === 'oma') {
    return (
      <svg
        role="img"
        aria-label="OMA"
        viewBox="38 250 722 300"
        className="mx-auto mb-3 w-[32.93%] max-w-[14.818rem]"
      >
        <image href="/brand/oma-logo.svg" width="800" height="800" />
      </svg>
    )
  }

  return (
    <OmarchyWordmark
      label="Omarchy"
      className="mx-auto mb-3 w-[59.5%] max-w-[26.775rem] text-[color:var(--t-field-lit)]"
      background={WORDMARK_BANDS}
    />
  )
}
