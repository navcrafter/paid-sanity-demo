import {stegaClean} from 'next-sanity'

import {RollText} from '../effects/RollText'
import {WordReveal} from '../effects/WordReveal'
import {InlineSvg} from '../media/InlineSvg'
import type {SectionProps} from './types'

export interface BenefitsData {
  heading?: string | null
  text?: string | null
  cards?: {_key: string; title?: string | null; description?: string | null; iconSvg?: string | null}[] | null
  jobBoard?: {
    heading?: string | null
    anchorId?: string | null
    jobs?: {_key: string; title?: string | null; location?: string | null; department?: string | null; type?: string | null; url?: string | null}[] | null
  } | null
  anchorId?: {current?: string | null} | null
}

function JobArrow() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path d="M0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25Z" fill="#CCE7E7" fillOpacity="0.4" />
      <path d="M21.3066 20.6772H29.323V28.6937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#B9D4DA" />
      <path d="M28.5732 21.5743L21.2812 28.8664" strokeWidth="1.5" strokeLinecap="round" stroke="#B9D4DA" />
    </svg>
  )
}

/** Creators "Work with brands on your terms" / Company "Why work at #paid?" + job board. */
export function BenefitsSection({data, edit}: SectionProps<BenefitsData>) {
  const anchor = stegaClean(data.anchorId?.current) || undefined
  const jobs = data.jobBoard?.jobs ?? []
  const hasDescriptions = data.cards?.some((card) => card.description)

  return (
    <section id={anchor} className="section_benefits">
      <div className="padding-global padding-section-huge benefits_padding">
        <div className="container-large">
          <div className="benefits_header text-align-center">
            <div className="flex-vertical is-gap-1-5">
              <div className="max-width-medium align-center benefits_heading">
                <WordReveal text={data.heading} className="heading-style-h2" />
              </div>
              {data.text && (
                <div className="benefits_text align-center">
                  <p className="text-size-large text-color-secondary-on-dark">{data.text}</p>
                </div>
              )}
            </div>
          </div>

          <div className="benefits_grid">
            {data.cards?.map((card) => (
              <div key={card._key} className={`benefits_card${hasDescriptions ? ' is-vertical' : ''}`} data-fade-up="" suppressHydrationWarning>
                <div className="benefits_card-header">
                  <InlineSvg svg={card.iconSvg} className="benefits_icon" />
                  {card.title}
                </div>
                {card.description && <p className="text-size-small text-weight-normal text-color-secondary-on-dark">{card.description}</p>}
              </div>
            ))}
          </div>

          {jobs.length > 0 && (
            <div className="benefits_jobs">
              <div id={stegaClean(data.jobBoard?.anchorId) || undefined} className="job-board_component">
                <h3 className="heading-style-h3">{data.jobBoard?.heading}</h3>
                <div className="job-board_list">
                  {jobs.map((job) => (
                    <a
                      key={job._key}
                      href={stegaClean(job.url) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="job-board_item"
                      data-sanity={edit(`jobBoard.jobs[_key=="${job._key}"]`)}
                    >
                      <span className="job-board_line" aria-hidden="true" />
                      <div className="job-board_row">
                        <div className="job-board_details">
                          <div className="job-board_meta">
                            <div className="job-board_meta-item">{job.location}</div>
                            <div className="job-board_meta-item">{job.department}</div>
                            <div className="job-board_meta-item">{job.type}</div>
                          </div>
                          <div className="job-board_meta">
                            <span className="job-board_spacer" />
                            <h4 className="heading-style-h4 job-board_title">
                              <RollText text={job.title} className="job-roll" />
                            </h4>
                            <span className="job-board_spacer" />
                          </div>
                        </div>
                        <span className="job-board_icon">
                          <JobArrow />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
