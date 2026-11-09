import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {dataset, projectId} from '../env'

const builder = createImageUrlBuilder({projectId, dataset})

/** Image URL from Sanity's CDN. Chain .width(), .height(), etc. Format is negotiated automatically (WebP/AVIF). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}
