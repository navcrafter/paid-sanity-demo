import {PortableText, stegaClean, type PortableTextBlock, type PortableTextComponents} from 'next-sanity'

import type {SanityImageValue} from '@/sanity/lib/assets'
import {resolveImage} from '@/sanity/lib/assets'
import type {EditAttr} from '@/sanity/lib/edit'

import {SanityVideo, type VideoValue} from '../media/Media'
import {SanityImage} from '../media/SanityImage'
import {EventAccordion} from './EventAccordion'
import {EventTestimonials} from './EventTestimonials'
import {HubSpotForm} from './HubSpotForm'

type Keyed<T> = T & {_key: string}

export interface EventData {
  _id: string
  title?: string | null
  category?: string | null
  template?: string | null
  theme?: {background?: string | null; accent?: string | null} | null
  startDateTime?: string | null
  excerpt?: string | null
  logo?: SanityImageValue | null
  logoSize?: string | null
  dateLabel?: string | null
  timeLabel?: string | null
  location?: string | null
  locationUrl?: string | null
  heroVideo?: VideoValue | null
  heroImage?: SanityImageValue | null
  cardImage?: SanityImageValue | null
  intro?: string | null
  bodyHeading?: string | null
  body?: PortableTextBlock[] | null
  sections?: Keyed<{_type: string; heading?: string | null; [field: string]: unknown}>[] | null
  registration?: {heading?: string | null; hubspotFormId?: string | null} | null
  moreInfoHeading?: string | null
  moreInfo?: Keyed<{question?: string | null; answer?: string | null}>[] | null
  seo?: {metaTitle?: string | null; metaDescription?: string | null} | null
}

const richText: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href = stegaClean(value?.href) as string | undefined
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}

/** Hero colour: Webinar and Mid Tier have their own; Supper Club is blue, or pink with the pink accent. */
function heroVariant(template: string, accent: string) {
  if (template === 'webinar') return 'webinar'
  if (accent === 'pink') return 'pink'
  return template === 'midTier' ? 'mid-tier' : 'blue'
}

function Divider() {
  return <div className="event_divider" />
}

export function EventPage({event, portalId, edit}: {event: EventData; portalId?: string | null; edit: EditAttr}) {
  const template = stegaClean(event.template) || 'supperClub'
  const background = stegaClean(event.theme?.background) || 'black'
  const variant = heroVariant(template, stegaClean(event.theme?.accent) || 'default')
  const isWebinar = template === 'webinar'
  const formId = stegaClean(event.registration?.hubspotFormId)
  const portal = stegaClean(portalId)

  // Event structured data for search engines (schema.org/Event)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: stegaClean(event.title),
    description: stegaClean(event.seo?.metaDescription || event.excerpt || event.intro) || undefined,
    startDate: event.startDateTime ?? undefined,
    eventAttendanceMode: isWebinar ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location: isWebinar
      ? {'@type': 'VirtualLocation', url: 'https://hashtagpaid.com/events'}
      : {'@type': 'Place', name: stegaClean(event.location) || undefined, address: stegaClean(event.location) || undefined},
    image: resolveImage(event.cardImage ?? event.heroImage ?? event.heroVideo?.poster)?.url,
    organizer: {'@type': 'Organization', name: '#paid', url: 'https://hashtagpaid.com'},
  }

  return (
    <div className={`event-page is-${background}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />

      {/* ---------------- Hero ---------------- */}
      <section className={`section_event-hero is-${variant}`}>
        <div className="padding-global event-hero_padding">
          <div className="event-hero_container">
            <div className={`event-hero_card is-${variant}`}>
              {!isWebinar && event.logo && (
                <div className="event-hero_logo-wrapper">
                  <SanityImage
                    image={event.logo}
                    className={`event-hero_logo${stegaClean(event.logoSize) === 'large' ? ' is-large' : ''}`}
                    sizes="240px"
                    priority
                    editAttr={edit('logo')}
                  />
                </div>
              )}
              <div className="event-hero_title-wrapper">
                <h1 className="event-hero_title">{event.title}</h1>
                {isWebinar && (event.dateLabel || event.timeLabel) && (
                  <div className="event-hero_date-line">
                    {event.dateLabel}
                    {event.dateLabel && event.timeLabel ? ' @ ' : ''}
                    {event.timeLabel}
                  </div>
                )}
              </div>
              {!isWebinar && (
                <div className="event-hero_details">
                  {event.dateLabel && (
                    <div className="event-hero_detail">
                      <div className="event-hero_detail-label">Date</div>
                      <div className="event-hero_detail-value">{event.dateLabel}</div>
                    </div>
                  )}
                  {event.location && (
                    <div className="event-hero_detail">
                      <div className="event-hero_detail-label">Location</div>
                      {event.locationUrl ? (
                        <a className="event-hero_detail-value is-link" href={stegaClean(event.locationUrl)} target="_blank" rel="noopener noreferrer">
                          {event.location}
                        </a>
                      ) : (
                        <div className="event-hero_detail-value">{event.location}</div>
                      )}
                    </div>
                  )}
                  {event.timeLabel && (
                    <div className="event-hero_detail">
                      <div className="event-hero_detail-label">Time</div>
                      <div className="event-hero_detail-value">{event.timeLabel}</div>
                    </div>
                  )}
                </div>
              )}
              {isWebinar && event.heroImage && (
                <SanityImage image={event.heroImage} className="event-hero_image" sizes="(max-width: 991px) 90vw, 560px" priority editAttr={edit('heroImage')} />
              )}
            </div>
          </div>
        </div>
        {!isWebinar && event.heroVideo && (
          <div className="event-hero_video">
            <SanityVideo video={event.heroVideo} eager editAttr={edit('heroVideo')} />
          </div>
        )}
      </section>

      {/* ---------------- Body ---------------- */}
      <section className={`section_event-body${isWebinar ? ' is-webinar' : ''}`}>
        <div className="padding-global event-body_padding">
          <div className="event-body_container">
            <div className="event-body_grid">
              <div className="event-body_content">
                {event.intro && <p className="event_intro event_block">{event.intro}</p>}
                {event.bodyHeading && <h2 className="event_heading event_block-heading">{event.bodyHeading}</h2>}
                {event.body && event.body.length > 0 && (
                  <div className="event_rich-text event_block">
                    <PortableText value={event.body} components={richText} />
                  </div>
                )}

                {event.sections?.map((section) => (
                  <div key={section._key}>
                    <div className="event_block">
                      <Divider />
                    </div>
                    <EventSection section={section} edit={edit} />
                  </div>
                ))}
              </div>

              {formId && portal && (
                <div className="event-body_form-container">
                  <div className="event-form_card">
                    {event.registration?.heading && <h2 className="event_heading is-medium event_block-heading">{event.registration.heading}</h2>}
                    <HubSpotForm portalId={portal} formId={formId} />
                  </div>
                </div>
              )}
            </div>

            {event.moreInfo && event.moreInfo.length > 0 && (
              <div className="event-more-info">
                <div className="event_block">
                  <Divider />
                </div>
                <h2 className="event_heading text-weight-semibold event-more-info_heading">{event.moreInfoHeading || 'More Information'}</h2>
                <div className="event-more-info_grid">
                  {event.moreInfo.map((item) => (
                    <div key={item._key} className="event-more-info_item" data-sanity={edit(`moreInfo[_key=="${item._key}"]`)}>
                      <p className="event_text">{item.question}</p>
                      <p className="event_text is-muted">{item.answer}</p>
                    </div>
                  ))}
                </div>
                <EventAccordion items={event.moreInfo.map((item) => ({key: item._key, question: item.question, answer: item.answer}))} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

/** The optional sections under the main text: logo strip, testimonials, people, venues. */
function EventSection({section, edit}: {section: NonNullable<EventData['sections']>[number]; edit: EditAttr}) {
  const path = `sections[_key=="${section._key}"]`
  const heading = section.heading ? <h2 className="event_heading event_block-heading">{section.heading}</h2> : null

  switch (section._type) {
    case 'eventLogoStrip': {
      const image = section.image as SanityImageValue | undefined
      if (!image) return heading
      return (
        <div className="event_block">
          {heading}
          <div className="event-logos">
            <div className="event-logos_fade is-left" />
            <div className="event-logos_fade is-right" />
            <div className="event-logos_track" data-sanity={edit(`${path}.image`)}>
              <SanityImage image={image} className="event-logos_image" sizes="2256px" />
              <SanityImage image={image} className="event-logos_image" sizes="2256px" alt="" />
            </div>
          </div>
        </div>
      )
    }
    case 'eventTestimonials': {
      const quotes = (section.quotes ?? []) as Keyed<{quote?: string; name?: string; logo?: SanityImageValue}>[]
      if (!quotes.length) return null
      return (
        <div className="event_block">
          {heading}
          <EventTestimonials
            slides={quotes.map((quote) => ({
              key: quote._key,
              content: (
                <div className="event-quote" data-sanity={edit(`${path}.quotes[_key=="${quote._key}"]`)}>
                  <p className="event_intro is-smaller">{quote.quote}</p>
                  <div className="event-quote_author">
                    <div>{quote.name}</div>
                    {quote.logo && <SanityImage image={quote.logo} className="event-quote_logo" sizes="112px" />}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      )
    }
    case 'eventPeople': {
      const people = (section.people ?? []) as Keyed<{name?: string; subtitle?: string; photo?: SanityImageValue; url?: string}>[]
      if (!people.length) return null
      return (
        <div className="event_block">
          {heading}
          <div className="event-people">
            {people.map((person) => {
              const content = (
                <>
                  {person.photo && <SanityImage image={person.photo} className="event-people_image" sizes="140px" />}
                  <div className="event-people_name">
                    <div className="text-weight-medium">{person.name}</div>
                    <div className="event-people_subtitle">{person.subtitle}</div>
                  </div>
                </>
              )
              const attr = edit(`${path}.people[_key=="${person._key}"]`)
              return person.url ? (
                <a key={person._key} href={stegaClean(person.url)} target="_blank" rel="noopener noreferrer" className="event-people_card" data-sanity={attr}>
                  {content}
                </a>
              ) : (
                <div key={person._key} className="event-people_card" data-sanity={attr}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    case 'eventVenues': {
      const venues = (section.venues ?? []) as Keyed<{name?: string; logo?: SanityImageValue}>[]
      if (!venues.length) return null
      return (
        <div className="event_block">
          {heading}
          <div className="event-venues">
            {venues.map((venue) => (
              <div key={venue._key} className="event-venues_item" data-sanity={edit(`${path}.venues[_key=="${venue._key}"]`)}>
                {venue.logo && <SanityImage image={venue.logo} className="event-venues_logo" sizes="(max-width: 767px) 45vw, 300px" />}
                <div className="text-weight-medium">{venue.name}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    default:
      return null
  }
}
