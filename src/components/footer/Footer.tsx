import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import type {ComponentType, SVGProps} from 'react'

import {cachedSanity, type FetchOptions} from '@/sanity/lib/live'
import {FOOTER_QUERY} from '@/sanity/lib/queries'

import {InstagramIcon, LinkedinIcon, PaidWordmark, TiktokIcon, XIcon, YoutubeIcon} from '../icons'
import {SmartLink, type LinkData} from '../SmartLink'
import {CurrentYear} from './CurrentYear'

const SOCIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  x: 'X',
}

const BADGE_CLASSES: Record<string, string> = {
  regular: 'footer_badge',
  small: 'footer_badge is-small',
  smallWide: 'footer_badge is-small is-wide',
}

export interface FooterCtaData {
  heading?: string | null
  button?: LinkData | null
}

/**
 * Site footer + the sticky "footer bottom" wordmark band.
 * Content comes from Site settings → Footer; a page can override the call to action.
 */
export async function Footer({options, ctaOverride}: {options: FetchOptions; ctaOverride?: FooterCtaData | null}) {
  const {data: footer} = await cachedSanity({query: FOOTER_QUERY, ...options})

  const heading = ctaOverride?.heading || footer?.cta?.heading
  const button = ctaOverride?.button?.href ? ctaOverride.button : footer?.cta?.button

  return (
    // The wrapper bounds the sticky footer-bottom so it can only sit behind the footer.
    <div className="footer_wrapper">
      <footer className="footer_component">
        <div className="padding-global">
          <div className="container-xlarge">
            <div className="padding-vertical padding-xxlarge">
              <div className="footer_top-wrapper">
                <div className="footer_left-wrapper">
                  <div className="flex-vertical is-gap-1-5">
                    {heading && <h2 className="heading-style-h2 text-color-cream">{heading}</h2>}
                    {button && (
                      <div className="button-group">
                        <SmartLink link={button} className="button is-pink" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-vertical">
                  <div className="footer_menu-wrapper">
                    {footer?.columns?.map((column) => (
                      <div key={column._key} className="footer_link-list">
                        <div className="footer_link-list-title">{column.title}</div>
                        {column.links?.map((link) => (
                          <SmartLink key={link._key} link={link} className="footer_link" />
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="margin-top margin-xhuge">
                    <div className="flex-vertical is-gap-1-5">
                      {footer?.socialLinks && footer.socialLinks.length > 0 && (
                        <div className="footer_social-list">
                          {footer.socialLinks.map((social) => {
                            const platform = stegaClean(social.platform) ?? ''
                            const Icon = SOCIAL_ICONS[platform]
                            if (!Icon || !social.url) return null
                            return (
                              <a
                                key={social._key}
                                href={stegaClean(social.url)}
                                className="footer_social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`#paid on ${SOCIAL_LABELS[platform]}`}
                              >
                                <Icon />
                              </a>
                            )
                          })}
                        </div>
                      )}

                      {footer?.badges && footer.badges.length > 0 && (
                        <div className="footer_badge-list">
                          {footer.badges.map((badge) =>
                            badge.url && badge.width && badge.height ? (
                              <Image
                                key={badge._key}
                                src={badge.url}
                                width={badge.width}
                                height={badge.height}
                                alt={badge.alt ?? ''}
                                className={BADGE_CLASSES[stegaClean(badge.size) ?? 'regular'] ?? 'footer_badge'}
                                sizes="160px"
                              />
                            ) : null,
                          )}
                        </div>
                      )}

                      <div className="flex-vertical">
                        <div className="footer_credit-text">
                          © <CurrentYear /> {footer?.companyName}
                        </div>
                        {footer?.locations && footer.locations.length > 0 && (
                          <div className="footer_credit-text">{footer.locations.join(' • ')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <section className="section_footer-bottom" aria-hidden="true">
        <div className="padding-global">
          <div className="footer-bottom_logo">
            <PaidWordmark />
          </div>
        </div>
        <div className="footer-bottom_graphic">
          <div className="footer-bottom_gradient">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
    </div>
  )
}
