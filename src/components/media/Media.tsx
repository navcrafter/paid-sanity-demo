import {stegaClean} from 'next-sanity'

import {fileUrl, resolveImage, type SanityImageValue} from '@/sanity/lib/assets'
import {urlFor} from '@/sanity/lib/image'

import {SanityImage} from './SanityImage'
import {VideoPlayer} from './VideoPlayer'

export interface VideoValue {
  source?: string | null
  vidzflowId?: string | null
  file?: {asset?: {_ref?: string} | null} | null
  poster?: SanityImageValue | null
}

export interface MediaValue {
  _key?: string
  kind?: string | null
  image?: SanityImageValue | null
  video?: VideoValue | null
}

/** Renders a Sanity video field (Vidzflow or uploaded MP4). */
export function SanityVideo({
  video,
  className,
  eager,
  active,
  editAttr,
}: {
  video?: VideoValue | null
  className?: string
  eager?: boolean
  active?: boolean
  editAttr?: string
}) {
  if (!video) return null
  const source = stegaClean(video.source) ?? 'vidzflow'
  const posterUrl = video.poster?.asset?._ref
    ? urlFor(video.poster as Parameters<typeof urlFor>[0]).width(1080).quality(70).url()
    : null

  return (
    <VideoPlayer
      vidzflowId={source === 'vidzflow' ? stegaClean(video.vidzflowId) : null}
      fileUrl={source === 'file' ? fileUrl(video.file?.asset?._ref) : null}
      posterUrl={posterUrl}
      className={className}
      eager={eager}
      active={active}
      editAttr={editAttr}
    />
  )
}

/** An image-or-video item. */
export function Media({
  media,
  imageClassName,
  videoClassName,
  sizes,
  priority,
  eager,
  active,
  editAttr,
}: {
  media?: MediaValue | null
  imageClassName?: string
  videoClassName?: string
  sizes?: string
  priority?: boolean
  eager?: boolean
  active?: boolean
  editAttr?: string
}) {
  if (!media) return null
  if (stegaClean(media.kind) === 'video') {
    return (
      <SanityVideo video={media.video} className={videoClassName} eager={eager} active={active} editAttr={editAttr} />
    )
  }
  return (
    <SanityImage
      image={media.image}
      className={imageClassName}
      sizes={sizes}
      priority={priority}
      editAttr={editAttr}
    />
  )
}

export {resolveImage}
