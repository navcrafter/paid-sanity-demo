import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live'

import {client} from './client'

// Sanity Live for Next.js Cache Components (next-sanity v13, strict mode).
// Published pages are cached and refreshed when content changes; draft mode
// (Presentation tool) renders drafts with click-to-edit overlays.

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing environment variable: SANITY_API_READ_TOKEN')
}

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

/**
 * Extra cache tag on every Sanity query. The publish webhook (/api/revalidate)
 * expires it, so pages nobody was viewing at publish time still update.
 */
export const SANITY_CONTENT_TAG = 'sanity-content'

/** The app's single 'use cache' boundary for Sanity queries. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch({...options, tags: [...(options.tags ?? []), SANITY_CONTENT_TAG]})
}

export interface FetchOptions {
  perspective: LivePerspective
  variant?: string
  stega: boolean
}

export const PUBLISHED: FetchOptions = {perspective: 'published', stega: false}

/** Resolves perspective and stega from draft mode. Call outside 'use cache' boundaries. */
export async function getDraftFetchOptions(): Promise<FetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) return PUBLISHED

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  const variant = await resolveVariantFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', variant, stega: true}
}
