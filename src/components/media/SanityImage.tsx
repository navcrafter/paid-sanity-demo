import Image from 'next/image'
import type {CSSProperties} from 'react'

import {resolveImage, type SanityImageValue} from '@/sanity/lib/assets'

/**
 * A Sanity image through next/image (resized and format-negotiated by Sanity's CDN).
 * The editor's hotspot becomes the object-position for cropped/cover images.
 */
export function SanityImage({
  image,
  className,
  sizes = '100vw',
  priority = false,
  style,
  alt,
  draggable,
  editAttr,
}: {
  image?: SanityImageValue | null
  className?: string
  sizes?: string
  priority?: boolean
  style?: CSSProperties
  alt?: string
  draggable?: boolean
  editAttr?: string
}) {
  const resolved = resolveImage(image)
  if (!resolved) return null

  return (
    <Image
      src={resolved.url}
      width={resolved.width}
      height={resolved.height}
      alt={alt ?? resolved.alt}
      className={className}
      sizes={sizes}
      priority={priority}
      draggable={draggable}
      style={resolved.objectPosition ? {objectPosition: resolved.objectPosition, ...style} : style}
      data-sanity={editAttr}
    />
  )
}
