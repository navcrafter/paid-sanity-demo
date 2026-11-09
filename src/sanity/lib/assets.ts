import {dataset, projectId} from '../env'
import {urlFor} from './image'

// Sanity asset IDs encode everything needed to build a URL, so queries don't have
// to dereference assets: image-<hash>-<width>x<height>-<format>, file-<hash>-<ext>.

export interface SanityImageValue {
  asset?: {_ref?: string} | null
  alt?: string | null
  crop?: {top?: number; bottom?: number; left?: number; right?: number} | null
  hotspot?: {x?: number; y?: number} | null
}

export function parseImageRef(ref: string) {
  const [, id, dimensions, format] = ref.split('-')
  const [width, height] = (dimensions ?? '').split('x').map(Number)
  return {id, width, height, format}
}

/** URL, intrinsic size (after crop) and focal point for a Sanity image. */
export function resolveImage(image?: SanityImageValue | null) {
  const ref = image?.asset?._ref
  if (!ref) return null
  const {width, height, format} = parseImageRef(ref)
  const crop = image?.crop
  const cropW = crop ? 1 - (crop.left ?? 0) - (crop.right ?? 0) : 1
  const cropH = crop ? 1 - (crop.top ?? 0) - (crop.bottom ?? 0) : 1

  const url =
    format === 'svg'
      ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref.slice(6, -4)}.svg`
      : urlFor(image as Parameters<typeof urlFor>[0]).url()

  const hotspot = image?.hotspot
  return {
    url,
    width: Math.round(width * cropW),
    height: Math.round(height * cropH),
    alt: image?.alt ?? '',
    objectPosition: hotspot ? `${(hotspot.x ?? 0.5) * 100}% ${(hotspot.y ?? 0.5) * 100}%` : undefined,
  }
}

/** URL of an uploaded file (e.g. an MP4). */
export function fileUrl(ref?: string | null) {
  if (!ref) return null
  const [, id, ext] = ref.split('-')
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`
}
