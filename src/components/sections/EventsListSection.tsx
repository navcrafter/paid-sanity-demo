import {cacheLife} from 'next/cache'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'

import {EVENT_CATEGORIES} from '@/sanity/constants'
import {editAttrFor} from '@/sanity/lib/edit'
import {cachedSanity} from '@/sanity/lib/live'
import {EVENT_CARDS_QUERY} from '@/sanity/lib/queries'

import {SanityImage} from '../media/SanityImage'
import {EventsBrowser} from './EventsBrowser'
import type {SectionProps} from './types'

export interface EventsListData {
  upcomingHeading?: string | null
  pastHeading?: string | null
  emptyText?: string | null
  showFilters?: boolean | null
}

/** "Now", cached for an hour so the page stays static while upcoming/past stay current. */
async function getNow() {
  'use cache'
  cacheLife('hours')
  return Date.now()
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7.37082 10.5537L10.9869 6.93761L7.37082 3.3215" strokeWidth="1.15993" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
      <path d="M10.5421 6.93788L2.78078 6.93848" strokeWidth="1.15993" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    </svg>
  )
}

/** Events page: every event in the collection as a card, upcoming first. */
export async function EventsListSection({data, options}: SectionProps<EventsListData>) {
  const [{data: events}, now] = await Promise.all([cachedSanity({query: EVENT_CARDS_QUERY, ...options}), getNow()])

  const cards = events.map((event) => {
    const category = stegaClean(event.category) ?? ''
    const categoryTitle = EVENT_CATEGORIES.find((c) => c.value === category)?.title ?? category
    const start = event.startDateTime ? new Date(event.startDateTime).getTime() : 0
    const upcoming = start >= now - 12 * 60 * 60 * 1000 // still "upcoming" on the day itself
    const image = event.cardImage ?? event.heroImage ?? event.poster
    const imagePath = event.cardImage ? 'cardImage' : event.heroImage ? 'heroImage' : 'heroVideo.poster'
    const edit = editAttrFor({_id: event._id, _type: 'event'}, options.stega)
    const href = `/events/${category}/${stegaClean(event.slug)}`
    const description = event.excerpt || event.intro

    return {
      key: event._id,
      category,
      upcoming,
      content: (
        <Link href={href} className="event-card">
          <div className="event-card_image-wrapper">
            {image ? (
              <SanityImage
                image={image}
                className="event-card_image"
                sizes="(max-width: 767px) 90vw, (max-width: 991px) 45vw, 400px"
                editAttr={edit(imagePath)}
              />
            ) : (
              <div className="event-card_placeholder" data-sanity={edit('cardImage')} />
            )}
            <span className="event-card_tag">{categoryTitle}</span>
          </div>
          <div className="event-card_content">
            <div className="event-card_meta text-size-small text-color-secondary">
              {[event.dateLabel, event.location].filter(Boolean).join(' · ')}
            </div>
            <h3 className="event-card_title">{event.title}</h3>
            {description && <p className="event-card_text text-size-regular text-color-secondary">{description}</p>}
            <span className="button is-icon event-card_cta">
              <span>{upcoming ? 'View event' : 'See the recap'}</span>
              <span className="button_icon">
                <ArrowRight />
              </span>
            </span>
          </div>
        </Link>
      ),
    }
  })

  return (
    <section id="events" className="section_events-list background-color-white">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large events-list_padding">
            <EventsBrowser
              cards={cards}
              categories={EVENT_CATEGORIES.map((c) => ({title: c.title, value: c.value}))}
              showFilters={stegaClean(data.showFilters) !== false}
              upcomingHeading={data.upcomingHeading || 'Upcoming events'}
              pastHeading={data.pastHeading || 'Past events'}
              emptyText={data.emptyText || 'New events are on the way. Check back soon.'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
