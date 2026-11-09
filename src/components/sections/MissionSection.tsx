import {stegaClean} from 'next-sanity'

import type {SanityImageValue} from '@/sanity/lib/assets'

import {InlineSvg} from '../media/InlineSvg'
import {SanityImage} from '../media/SanityImage'
import type {SectionProps} from './types'

export interface MissionData {
  blocks?: {
    _key: string
    heading?: string | null
    text?: string | null
    image?: SanityImageValue | null
    quote?: string | null
    quoteMeta?: {_key: string; label?: string | null; iconSvg?: string | null}[] | null
    cardSide?: string | null
  }[] | null
}

/** Company: "Powering all brand collaborations…" / "The people behind the partnerships". */
export function MissionSection({data, edit}: SectionProps<MissionData>) {
  return (
    <section className="section_mission background-color-cream">
      <div className="padding-global padding-section-huge">
        <div className="container-large">
          {data.blocks?.map((block) => {
            const left = stegaClean(block.cardSide) === 'left'
            const card = (
              <div className={`mission_card-wrapper${left ? ' is-left' : ''}`}>
                <div className="mission_card" data-fade-up="" suppressHydrationWarning>
                  <div className="mission_card-top">{block.quote}</div>
                  <div className="mission_card-bottom">
                    {block.quoteMeta?.map((meta) => (
                      <div key={meta._key} className="mission_meta">
                        <InlineSvg svg={meta.iconSvg} className="mission_meta-icon" />
                        <div className="text-size-small text-color-secondary-on-dark">{meta.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
            const image = (
              <div className="mission_image-wrapper" data-reveal-image="">
                <SanityImage image={block.image} className="mission_image" sizes="(max-width: 767px) 90vw, 1000px" editAttr={edit(`blocks[_key=="${block._key}"].image`)} />
              </div>
            )
            return (
              <div key={block._key} className="mission_block">
                <div className="mission_intro">
                  <h2 className="heading-style-h2 is-smaller">{block.heading}</h2>
                  <p className="text-size-large text-color-secondary">{block.text}</p>
                </div>
                <div className={`mission_overlap${left ? ' is-reversed' : ''}`}>
                  {left ? (
                    <>
                      {card}
                      {image}
                    </>
                  ) : (
                    <>
                      {image}
                      {card}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
