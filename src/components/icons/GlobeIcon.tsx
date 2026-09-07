import type { SVGProps } from 'react'

/** Matches the navigation set's 24px grid, 1.5px strokes and square caps. */
export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" />
      <ellipse cx="12" cy="12" rx="4.25" ry="9.25" />
      <path d="M3.25 8.75h17.5M3.25 15.25h17.5" />
    </svg>
  )
}
