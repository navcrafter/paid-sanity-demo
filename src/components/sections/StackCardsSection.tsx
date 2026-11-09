import {stegaClean} from 'next-sanity'

import {WordReveal} from '../effects/WordReveal'
import {InlineSvg} from '../media/InlineSvg'
import {SanityVideo, type VideoValue} from '../media/Media'
import type {SectionProps} from './types'

export interface StackCardsData {
  cards?: {_key: string; heading?: string | null; text?: string | null; video?: VideoValue | null; color?: string | null; iconSvg?: string | null}[] | null
}

/** Creators: numbered steps that stack as you scroll (CSS position: sticky). */
export function StackCardsSection({data, edit}: SectionProps<StackCardsData>) {
  return (
    <section className="section_stack-cards">
      <div className="padding-global padding-section-huge">
        <div className="container-large">
          <div className="stack-cards_list">
            {data.cards?.map((card, i) => (
              <div key={card._key} className={`stack-cards_item is-${stegaClean(card.color) || 'blue'}`}>
                <div className="stack-cards_grid">
                  <div className="stack-cards_content">
                    <div className="flex-vertical">
                      <div className="stack-cards_num">{String(i + 1).padStart(2, '0')}</div>
                      <WordReveal text={card.heading} className="heading-style-h2 is-smaller" />
                    </div>
                    <div className="stack-cards_text-row">
                      <InlineSvg svg={card.iconSvg} className="stack-cards_icon" />
                      <p className="text-size-medium">{card.text}</p>
                    </div>
                  </div>
                  <div className="stack-cards_media" data-reveal-image="">
                    <SanityVideo video={card.video} className="stack-cards_video" editAttr={edit(`cards[_key=="${card._key}"].video`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
