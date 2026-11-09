import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Suspense} from 'react'

import {EventPage, type EventData} from '@/components/events/EventPage'
import {Footer} from '@/components/footer/Footer'
import {resolveImage} from '@/sanity/lib/assets'
import {editAttrFor} from '@/sanity/lib/edit'
import {cachedSanity, PUBLISHED, type FetchOptions} from '@/sanity/lib/live'
import {EVENT_PATHS_QUERY, EVENT_QUERY, HUBSPOT_PORTAL_QUERY} from '@/sanity/lib/queries'
import {WithFetchOptions} from '@/sanity/lib/WithFetchOptions'

// Placeholder used only while the dataset has no events: Cache Components needs
// at least one param to validate the route at build time.
const PLACEHOLDER = {category: 'supperclub', slug: '__placeholder__'}

export async function generateStaticParams() {
  const {data} = await cachedSanity({query: EVENT_PATHS_QUERY, ...PUBLISHED})
  return data.length > 0 ? data : [PLACEHOLDER]
}

export async function generateMetadata(props: PageProps<'/events/[category]/[slug]'>): Promise<Metadata> {
  const {category, slug} = await props.params
  const {data} = await cachedSanity({query: EVENT_QUERY, params: {category, slug}, ...PUBLISHED})
  if (!data) return {}
  const image = resolveImage(data.seo?.ogImage ?? data.cardImage ?? data.heroImage ?? data.heroVideo?.poster)
  return {
    // A custom meta title is used as-is; otherwise "Event title | #paid"
    title: data.seo?.metaTitle ? {absolute: data.seo.metaTitle} : data.title,
    description: data.seo?.metaDescription || data.excerpt || data.intro || undefined,
    openGraph: image ? {images: [{url: image.url, width: image.width, height: image.height}]} : undefined,
  }
}

export default function EventRoute(props: PageProps<'/events/[category]/[slug]'>) {
  // The URL params are read inside Suspense so navigation to a new event stays instant.
  return (
    <Suspense fallback={<div className="event-page is-black" style={{minHeight: '100vh'}} />}>
      <EventResolver params={props.params} />
    </Suspense>
  )
}

async function EventResolver({params}: {params: PageProps<'/events/[category]/[slug]'>['params']}) {
  const {category, slug} = await params
  if (slug === PLACEHOLDER.slug) notFound()

  return <WithFetchOptions render={(options) => <EventContent category={category} slug={slug} options={options} />} />
}

async function EventContent({category, slug, options}: {category: string; slug: string; options: FetchOptions}) {
  const [{data: event}, {data: portalId}] = await Promise.all([
    cachedSanity({query: EVENT_QUERY, params: {category, slug}, ...options}),
    cachedSanity({query: HUBSPOT_PORTAL_QUERY, ...options}),
  ])
  if (!event || stegaClean(event.category) !== category) notFound()

  return (
    <>
      <main className="main-wrapper">
        <EventPage event={event as unknown as EventData} portalId={portalId} edit={editAttrFor(event, options.stega)} />
      </main>
      <Footer options={options} />
    </>
  )
}
