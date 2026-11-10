import {stegaClean} from 'next-sanity'
import type {CSSProperties} from 'react'

import type {SanityImageValue} from '@/sanity/lib/assets'
import {editAttrFor} from '@/sanity/lib/edit'

import {splitStega} from '../effects/WordReveal'
import {SanityImage} from '../media/SanityImage'
import {TestimonialCarousel} from './TestimonialCarousel'
import type {SectionProps} from './types'

export interface TestimonialCarouselData {
  quotes?: {_key: string; docId?: string | null; quote?: string | null; size?: string | null; name?: string | null; company?: string | null; photo?: SanityImageValue | null}[] | null
  autoplaySeconds?: number | null
}

/** Quote words fade in once the card turns pink. */
function QuoteWords({text}: {text?: string | null}) {
  if (!text) return null
  const {clean, encoded} = splitStega(text)
  let i = 0
  return (
    <>
      {clean.split(/(\s+)/).map((part, index) =>
        !part ? null : part.trim() ? (
          <span key={index} className="t-word">
            <span style={{'--i': i++} as CSSProperties}>{part}</span>
          </span>
        ) : (
          ' '
        ),
      )}
      {encoded}
    </>
  )
}

export function TestimonialCarouselSection({data, edit}: SectionProps<TestimonialCarouselData>) {
  const quotes = data.quotes ?? []
  // A quote picked from the Testimonials collection is edited on its own document; a legacy inline one on the page.
  const photoEdit = (quote: {_key: string; docId?: string | null}) => {
    const onPage = edit(`quotes[_key=="${quote._key}"].photo`)
    if (!quote.docId) return onPage
    return editAttrFor({_id: quote.docId, _type: 'testimonial'}, Boolean(onPage))('photo')
  }
  return (
    <section className="section_testimonial-carousel background-color-white">
      <div className="padding-global padding-section-large testimonial-carousel_padding">
        <div className="container-large">
          <TestimonialCarousel
            autoplaySeconds={data.autoplaySeconds ?? 6}
            slides={quotes.map((quote) => ({
              key: quote._key,
              editAttr: edit(`quotes[_key=="${quote._key}"]`),
              content: (
                <div className="testimonial-carousel_card">
                  <div className={stegaClean(quote.size) === 'small' ? 'heading-style-h2 is-quote' : 'heading-style-h1 is-quote'}>
                    <QuoteWords text={quote.quote} />
                  </div>
                  <div className="testimonial-carousel_author">
                    {quote.photo && (
                      <div className="testimonial-carousel_author-image">
                        <SanityImage image={quote.photo} sizes="48px" editAttr={photoEdit(quote)} />
                      </div>
                    )}
                    <div className="testimonial-carousel_author-info">
                      <div className="text-weight-bold">{quote.name}</div>
                      <div>{quote.company}</div>
                    </div>
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  )
}
