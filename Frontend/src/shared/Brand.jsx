import React from "react"

// Aperture glyph — six blades forming a lens iris. The mark of HireLens.
export const ApertureGlyph = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="20" />
    <path d="M24 4 L24 24 L41.3 14" />
    <path d="M41.3 14 L24 24 L41.3 34" />
    <path d="M41.3 34 L24 24 L24 44" />
    <path d="M24 44 L24 24 L6.7 34" />
    <path d="M6.7 34 L24 24 L6.7 14" />
    <path d="M6.7 14 L24 24 L24 4" />
  </svg>
)

// Wordmark: Hire·Lens with the aperture glyph
export const Brand = ({ className = "" }) => (
  <span className={`brand ${className}`}>
    <ApertureGlyph className="brand__glyph" />
    <span>Hire<em>Lens</em></span>
  </span>
)

export default Brand
