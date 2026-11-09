import {revalidateTag} from 'next/cache'
import type {NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {SANITY_CONTENT_TAG} from '@/sanity/lib/live'

// Target of the Sanity webhook that fires on every publish/unpublish/delete.
// <SanityLive> already refreshes pages that are open in a browser; this covers
// pages nobody was viewing when the content changed.

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return Response.json({error: 'Missing SANITY_REVALIDATE_SECRET'}, {status: 500})
  }

  // `true` waits for Content Lake to be consistent before we expire the cache.
  const {isValidSignature, body} = await parseBody<{_type?: string; _id?: string}>(request, secret, true)
  if (!isValidSignature) {
    return Response.json({error: 'Invalid signature'}, {status: 401})
  }

  revalidateTag(SANITY_CONTENT_TAG, {expire: 0})
  return Response.json({revalidated: true, type: body?._type ?? null, id: body?._id ?? null})
}
