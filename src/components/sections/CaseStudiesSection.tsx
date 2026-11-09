import {stegaClean} from 'next-sanity'

import type {SanityImageValue} from '@/sanity/lib/assets'

import {WordReveal} from '../effects/WordReveal'
import {SanityImage} from '../media/SanityImage'
import {SmartLink, type LinkData} from '../SmartLink'
import {CaseStudies} from './CaseStudies'
import type {SectionProps} from './types'

export interface CaseStudiesData {
  heading?: string | null
  studies?: {_key: string; brand?: string | null; image?: SanityImageValue | null; link?: LinkData | null; palette?: string | null}[] | null
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7.37082 10.5537L10.9869 6.93761L7.37082 3.3215" strokeWidth="1.15993" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
      <path d="M10.5421 6.93788L2.78078 6.93848" strokeWidth="1.15993" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    </svg>
  )
}

/** Home: "Learn why consumer brands choose #paid". */
export function CaseStudiesSection({data, edit}: SectionProps<CaseStudiesData>) {
  return (
    <section className="section_case-studies background-color-white">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large case-studies_padding">
            <div className="case-studies_heading">
              <WordReveal text={data.heading} className="heading-style-h1" />
            </div>
            <CaseStudies
              cards={(data.studies ?? []).map((study) => ({
                key: study._key,
                editAttr: edit(`studies[_key=="${study._key}"]`),
                content: (
                  <SmartLink link={study.link ? {...study.link, label: undefined} : null} className="case-studies_link">
                    <div className={`case-studies_card is-${stegaClean(study.palette) || 'purple'}`}>
                      <div className="case-studies_brand">{study.brand}</div>
                      <div className="case-studies_image-wrapper">
                        <SanityImage image={study.image} className="case-studies_image" sizes="(max-width: 767px) 80vw, 344px" editAttr={edit(`studies[_key=="${study._key}"].image`)} />
                      </div>
                      <div className="button is-icon case-studies_cta">
                        <span className="case-studies_cta-text">{study.link?.label || 'Read case study'}</span>
                        <span className="case-studies_cta-icon">
                          <ArrowRight />
                        </span>
                      </div>
                    </div>
                  </SmartLink>
                ),
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
