import {stegaClean} from 'next-sanity'

import {ScrubText} from '../effects/ScrubText'
import {WordReveal} from '../effects/WordReveal'
import type {SectionProps} from './types'

export interface StatementData {
  heading?: string | null
  effect?: string | null
}

/** One large centred heading (Home: "Today, brands run creator marketing…"). */
export function StatementSection({data}: SectionProps<StatementData>) {
  const effect = stegaClean(data.effect) || 'scrub'
  return (
    <section className="section_statement">
      <div className="padding-global padding-section-huge">
        <div className="container-large">
          <div className="container-small text-align-center">
            {effect === 'scrub' ? (
              <ScrubText text={data.heading} className="heading-style-h2" />
            ) : effect === 'reveal' ? (
              <WordReveal text={data.heading} className="heading-style-h2" />
            ) : (
              <h2 className="heading-style-h2" style={{whiteSpace: 'pre-line'}}>
                {data.heading}
              </h2>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
