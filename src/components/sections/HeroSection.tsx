import {stegaClean} from 'next-sanity'
import type {CSSProperties} from 'react'

import {WordReveal} from '../effects/WordReveal'
import {DriftGallery} from '../galleries/DriftGallery'
import {OrbitGallery} from '../galleries/OrbitGallery'
import {RingGallery} from '../galleries/RingGallery'
import type {MediaValue} from '../media/Media'
import {SanityImage} from '../media/SanityImage'
import {SmartLink, type LinkData} from '../SmartLink'
import type {SanityImageValue} from '@/sanity/lib/assets'
import type {SectionProps} from './types'

export interface HeroData {
  announcement?: {tag?: string | null; link?: LinkData | null} | null
  heading?: string | null
  text?: string | null
  cta?: LinkData | null
  galleryStyle?: string | null
  gallery?: MediaValue[] | null
  logosHeading?: string | null
  logoRows?: {_key: string; logos?: (SanityImageValue & {_key: string})[] | null}[] | null
  theme?: string | null
  headingSize?: string | null
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4.80762 11.3838L9.19189 6.99951L4.80762 2.61523" stroke="currentColor" strokeWidth="1.40634" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HeroSection({data, edit}: SectionProps<HeroData>) {
  const theme = stegaClean(data.theme) || 'cream'
  const galleryStyle = stegaClean(data.galleryStyle) || 'none'
  const gallery = data.gallery ?? []
  const isDisplay = stegaClean(data.headingSize) !== 'large'
  const rows = (data.logoRows ?? []).filter((row) => row.logos?.length)
  const itemAttrs = Object.fromEntries(gallery.map((item) => [item._key, edit(`gallery[_key=="${item._key}"]`)]))

  return (
    <section className={`section_hero is-${theme}${galleryStyle === 'orbit' ? '' : ' is-flush-bottom'}`}>
      <div className="padding-global padding-section-huge">
        <div className="container-large">
          <div className="text-align-center">
            <div className="flex-vertical is-gap-1">
              {(data.announcement?.tag || data.announcement?.link?.label) && (
                <div className="flex-horizontal is-align-center is-gap-0-5">
                  {data.announcement?.tag && <div className="hero_tag">{data.announcement.tag}</div>}
                  {data.announcement?.link?.href && (
                    <SmartLink
                      link={data.announcement.link}
                      className={`button is-icon ${theme === 'dark' ? 'text-color-secondary-on-dark' : 'text-color-secondary'}`}
                    >
                      <span>{data.announcement.link.label}</span>
                      <span className="button_icon">
                        <ArrowIcon />
                      </span>
                    </SmartLink>
                  )}
                </div>
              )}
              <div className={`hero_heading-wrapper${isDisplay ? '' : ' is-large'}`}>
                <WordReveal as="h1" text={data.heading} className={`heading-style-h1${isDisplay ? ' is-display' : ''}`} />
              </div>
              {data.text && (
                <div className="max-width-large align-center">
                  <p className={`text-size-large ${theme === 'dark' ? 'text-color-secondary-on-dark' : 'text-color-secondary'}`}>{data.text}</p>
                </div>
              )}
            </div>
            {data.cta?.href && (
              <div className="margin-top margin-medium">
                <div className="button-group is-center">
                  <SmartLink link={data.cta} className="button is-pink" />
                </div>
              </div>
            )}
          </div>

          {galleryStyle !== 'none' && gallery.length > 0 && (
            <div className={`hero_gallery is-${galleryStyle}`}>
              {galleryStyle === 'orbit' && <OrbitGallery items={gallery} editAttrs={itemAttrs} />}
              {galleryStyle === 'ring' && <RingGallery items={gallery} editAttrs={itemAttrs} />}
              {galleryStyle === 'drift' && <DriftGallery items={gallery} editAttrs={itemAttrs} />}
            </div>
          )}

          {rows.length > 0 && (
            <div className="hero_logos">
              <div
                className={`hero_logo-rows is-rows-${Math.min(Math.max(rows.length, 1), 4)}`}
                style={{'--cycle': `${rows.length * 3.55}s`} as CSSProperties}
              >
                {data.logosHeading && (
                  <div className="hero_logos-heading text-size-small text-weight-medium text-color-secondary">{data.logosHeading}</div>
                )}
                {rows.map((row, set) => (
                  <div key={row._key} className="hero_logo-row" style={{'--set': set} as CSSProperties} aria-hidden={set > 0 || undefined}>
                    {row.logos?.map((logo, k) => (
                      <div key={logo._key} className="hero_logo-item" style={{'--k': k} as CSSProperties}>
                        <SanityImage
                          image={logo}
                          className="hero_logo"
                          sizes="168px"
                          editAttr={edit(`logoRows[_key=="${row._key}"].logos[_key=="${logo._key}"]`)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
