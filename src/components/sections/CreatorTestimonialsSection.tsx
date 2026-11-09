import {WordReveal} from '../effects/WordReveal'
import {Ticker} from '../galleries/Ticker'
import {SanityVideo, type VideoValue} from '../media/Media'
import type {SectionProps} from './types'

export interface CreatorTestimonialsData {
  heading?: string | null
  items?: {_key: string; quote?: string | null; handle?: string | null; tag?: string | null; video?: VideoValue | null}[] | null
}

/** Creators: "Why creators love #paid" — a gliding row of video testimonials. */
export function CreatorTestimonialsSection({data, edit}: SectionProps<CreatorTestimonialsData>) {
  return (
    <section className="section_creator-testimonials">
      <div className="padding-global padding-section-huge creator-testimonials_padding">
        <div className="container-large">
          <div className="max-width-medium">
            <WordReveal text={data.heading} className="heading-style-h2" />
          </div>
          <div className="creator-testimonials_ticker">
            <Ticker speed={30} className="creator-testimonials_track" itemClassName="creator-testimonials_slot">
              {data.items?.map((item) => (
                <div key={item._key} className="creator-testimonials_item" data-sanity={edit(`items[_key=="${item._key}"]`)}>
                  <div className="creator-testimonials_video">
                    <SanityVideo video={item.video} />
                  </div>
                  <div className="creator-testimonials_content">
                    <div>{item.quote}</div>
                    <div className="creator-testimonials_bottom">
                      <div>{item.handle}</div>
                      {item.tag && <div className="creator-testimonials_tag">{item.tag}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </Ticker>
          </div>
        </div>
      </div>
    </section>
  )
}
