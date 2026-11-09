'use client'

/**
 * Global next/image loader (configured in next.config.ts).
 * Sanity CDN images are resized and format-negotiated (WebP/AVIF) by Sanity itself;
 * any other URL is passed through untouched.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (!src.startsWith('https://cdn.sanity.io/')) return src
  // SVGs are vectors: serve the original file.
  if (/\.svg(\?|$)/.test(src)) return src

  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality || 80))
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', url.searchParams.get('fit') || 'max')
  return url.toString()
}
