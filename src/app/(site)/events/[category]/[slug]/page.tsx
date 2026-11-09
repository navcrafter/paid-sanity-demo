import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import {PagePlaceholder} from '@/components/PagePlaceholder'
import {EVENT_CATEGORIES, EVENT_TEMPLATES} from '@/sanity/constants'
import {cachedSanity, type FetchOptions} from '@/sanity/lib/live'
import {EVENT_PATHS_QUERY, EVENT_QUERY} from '@/sanity/lib/queries'
import {WithFetchOptions} from '@/sanity/lib/WithFetchOptions'

// Placeholder used only while the dataset has no events: Cache Components needs
// at least one param to validate the route at build time.
const PLACEHOLDER = {category: 'supperclub', slug: '__placeholder__'}

export async function generateStaticParams() {
  const {data} = await cachedSanity({query: EVENT_PATHS_QUERY, perspective: 'published', stega: false})
  return data.length > 0 ? data : [PLACEHOLDER]
}

export default async function EventPage(props: PageProps<'/events/[category]/[slug]'>) {
  const {category, slug} = await props.params
  if (slug === PLACEHOLDER.slug) notFound()

  return (
    <WithFetchOptions
      render={(options) => <EventContent category={category} slug={slug} options={options} />}
    />
  )
}

async function EventContent({
  category,
  slug,
  options,
}: {
  category: string
  slug: string
  options: FetchOptions
}) {
  const {data: event} = await cachedSanity({query: EVENT_QUERY, params: {category, slug}, ...options})
  if (!event) notFound()

  return (
    <PagePlaceholder
      heading="Event"
      sanityTitle={event.title}
      details={{
        Category: EVENT_CATEGORIES.find((c) => c.value === stegaClean(event.category))?.title,
        Template: EVENT_TEMPLATES.find((t) => t.value === stegaClean(event.template))?.title,
        Background: event.theme?.background,
        Accent: event.theme?.accent,
        Location: event.location,
      }}
    />
  )
}
