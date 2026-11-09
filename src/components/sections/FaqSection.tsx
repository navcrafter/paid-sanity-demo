import {stegaClean} from 'next-sanity'

import {WordReveal} from '../effects/WordReveal'
import {SmartLink, type LinkData} from '../SmartLink'
import {FaqList} from './FaqList'
import type {SectionProps} from './types'

export interface FaqData {
  heading?: string | null
  intro?: string | null
  introLink?: LinkData | null
  items?: {_key: string; question?: string | null; answer?: string | null}[] | null
  colorScheme?: string | null
}

/** Creators: "Questions, answered". */
export function FaqSection({data, edit}: SectionProps<FaqData>) {
  const scheme = stegaClean(data.colorScheme)
  return (
    <section className="section_faq" data-theme={scheme && scheme !== 'none' ? scheme : undefined}>
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-xlarge">
            <div className="faq_grid">
              <div className="max-width-xsmall">
                <div className="margin-bottom margin-small">
                  <WordReveal text={data.heading} className="heading-style-h2" />
                </div>
                {(data.intro || data.introLink) && (
                  <p className="text-size-large text-color-secondary-on-dark">
                    {data.intro}{' '}
                    {data.introLink?.href && <SmartLink link={data.introLink} className="text-style-link" />}.
                  </p>
                )}
              </div>
              <FaqList
                items={(data.items ?? []).map((item) => ({
                  key: item._key,
                  question: item.question,
                  answer: item.answer,
                  editAttr: edit(`items[_key=="${item._key}"]`),
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
