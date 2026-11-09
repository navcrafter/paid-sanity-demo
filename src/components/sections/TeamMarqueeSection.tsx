import type {SanityImageValue} from '@/sanity/lib/assets'

import {WordReveal} from '../effects/WordReveal'
import {Ticker} from '../galleries/Ticker'
import {SanityImage} from '../media/SanityImage'
import type {SectionProps} from './types'

export interface TeamMarqueeData {
  heading?: string | null
  text?: string | null
  rows?: {_key: string; photos?: (SanityImageValue & {_key: string})[] | null}[] | null
}

/** Company: rows of round team photos gliding sideways (middle row the other way). */
export function TeamMarqueeSection({data}: SectionProps<TeamMarqueeData>) {
  return (
    <section className="section_team-marquee">
      <div className="padding-global padding-section-huge">
        <div className="container-large">
          <div className="team-marquee_header text-align-center">
            <div className="flex-vertical is-gap-1-5">
              <WordReveal text={data.heading} className="heading-style-h2" />
              {data.text && (
                <div className="team-marquee_text align-center">
                  <p className="text-size-large text-color-secondary-on-dark">{data.text}</p>
                </div>
              )}
            </div>
          </div>
          <div className="team-marquee_component">
            {data.rows?.map((row, i) => (
              <Ticker key={row._key} speed={18} reverse={i % 2 === 1} className="team-marquee_row">
                {row.photos?.map((photo) => (
                  <SanityImage key={photo._key} image={photo} className="team-marquee_photo" sizes="66px" draggable={false} />
                ))}
              </Ticker>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
