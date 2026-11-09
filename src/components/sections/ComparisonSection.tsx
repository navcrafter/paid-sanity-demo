import {WordReveal} from '../effects/WordReveal'
import type {SectionProps} from './types'

export interface ComparisonData {
  heading?: string | null
  without?: {label?: string | null; items?: string[] | null} | null
  with?: {label?: string | null; items?: string[] | null} | null
}

function CrossIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15.9552 14.4021C16.3835 14.8306 16.3828 15.5251 15.9544 15.9535C15.526 16.382 14.8314 16.3827 14.4029 15.9544L8.04556 9.59701C7.61709 9.16854 7.61709 8.47318 8.04556 8.04471C8.47404 7.61624 9.1694 7.61624 9.59787 8.04471L15.9552 14.4021Z" fill="currentColor" />
      <path d="M9.5975 15.9548C9.16901 16.3831 8.47445 16.3824 8.04604 15.954C7.61762 15.5256 7.61689 14.831 8.04519 14.4025L14.4026 8.04514C14.831 7.61667 15.5264 7.61667 15.9549 8.04514C16.3833 8.47361 16.3833 9.16897 15.9549 9.59744L9.5975 15.9548Z" fill="currentColor" />
      <path d="M20.1959 12C20.1957 7.4736 16.5261 3.80469 11.9996 3.80469C7.47337 3.80492 3.80455 7.47374 3.80432 12C3.80432 16.5265 7.47323 20.1961 11.9996 20.1963C16.5262 20.1963 20.1959 16.5266 20.1959 12ZM21.9957 12C21.9957 17.5207 17.5203 21.9961 11.9996 21.9961C6.47912 21.9959 2.00354 17.5206 2.00354 12C2.00377 6.47963 6.47926 2.00414 11.9996 2.00391C17.5202 2.00391 21.9955 6.47949 21.9957 12Z" fill="currentColor" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="12" fill="#2F91B6" />
      <path d="M7.6001 12.4002L10.6001 15.3002L16.4001 9.2002" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="#B9D4DA" />
    </svg>
  )
}

/** Home: "Why brands switch to #paid" — without vs with. */
export function ComparisonSection({data}: SectionProps<ComparisonData>) {
  return (
    <section className="section_comparison background-color-white">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large comparison_padding">
            <div className="comparison_grid">
              <div className="comparison_heading">
                <WordReveal text={data.heading} className="heading-style-h2" />
              </div>
              <div className="comparison_cards">
                <div className="comparison_card">
                  <div className="text-size-small text-color-secondary-on-dark">{data.without?.label}</div>
                  <div className="flex-vertical">
                    {data.without?.items?.map((item, i) => (
                      <div key={i} className="comparison_item text-color-secondary-on-dark">
                        <span className="comparison_icon">
                          <CrossIcon />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="comparison_card is-highlighted">
                  <div className="text-size-small">{data.with?.label}</div>
                  <div className="flex-vertical">
                    {data.with?.items?.map((item, i) => (
                      <div key={i} className="comparison_item">
                        <span className="comparison_icon">
                          <CheckIcon />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
