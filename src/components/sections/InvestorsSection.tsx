import type {SanityImageValue} from '@/sanity/lib/assets'

import {WordReveal} from '../effects/WordReveal'
import {SanityImage} from '../media/SanityImage'
import type {SectionProps} from './types'

export interface InvestorsData {
  heading?: string | null
  text?: string | null
  people?: {_key: string; name?: string | null; role?: string | null; photo?: SanityImageValue | null}[] | null
}

/** Company: "Backed by the best". */
export function InvestorsSection({data, edit}: SectionProps<InvestorsData>) {
  return (
    <section className="section_investors background-color-white">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="investors_grid">
              <div className="investors_left">
                <div className="flex-vertical is-gap-1-5">
                  <div className="max-width-xxsmall">
                    <WordReveal text={data.heading} className="heading-style-h2" />
                  </div>
                  {data.text && <p className="text-size-large text-color-secondary-on-dark investors_text">{data.text}</p>}
                </div>
              </div>
              <div className="investors_people">
                {data.people?.map((person) => (
                  <div key={person._key} className="investors_card" data-sanity={edit(`people[_key=="${person._key}"]`)}>
                    <SanityImage image={person.photo} className="investors_image" sizes="(max-width: 767px) 45vw, 260px" />
                    <div className="investors_name">
                      <div className="text-size-regular text-weight-semibold">{person.name}</div>
                      <div className="text-size-regular text-color-secondary">{person.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
