import {stegaClean} from 'next-sanity'

import type {SanityImageValue} from '@/sanity/lib/assets'

import {WordReveal} from '../effects/WordReveal'
import {InlineSvg} from '../media/InlineSvg'
import {SanityImage} from '../media/SanityImage'
import {FeatureTabs} from './FeatureTabs'
import type {SectionProps} from './types'

interface FeatureTab {
  _key: string
  title?: string | null
  description?: string | null
  image?: SanityImageValue | null
  iconSvg?: string | null
}

export interface FeatureTabsData {
  groups?: {_key: string; tag?: string | null; heading?: string | null; imageSide?: string | null; tabs?: FeatureTab[] | null}[] | null
  tabDuration?: number | null
  colorScheme?: string | null
}

/** Home: three groups of auto-advancing tabs with a cross-fading image. */
export function FeatureTabsSection({data, edit}: SectionProps<FeatureTabsData>) {
  const scheme = stegaClean(data.colorScheme)
  const durationMs = Math.round((data.tabDuration ?? 8) * 1000)

  return (
    <section className="section_feature-tabs" data-theme={scheme && scheme !== 'none' ? scheme : undefined}>
      <div className="padding-global feature-tabs_padding">
        <div className="container-large">
          {data.groups?.map((group) => {
            const side = stegaClean(group.imageSide) === 'left' ? 'left' : 'right'
            const groupPath = `groups[_key=="${group._key}"]`
            return (
              <div key={group._key} className="feature-tabs_group">
                <div className="feature-tabs_wrapper">
                  <div className={`feature-tabs_column${side === 'left' ? ' is-right' : ''}`}>
                    <div className="feature-tabs_heading">
                      <div className="flex-vertical is-gap-1-5">
                        {group.tag && (
                          <div className="button-group">
                            <div className="feature-tabs_tag" data-sanity={edit(`${groupPath}.tag`)}>
                              {group.tag}
                            </div>
                          </div>
                        )}
                        <WordReveal text={group.heading} className="heading-style-h3 feature-tabs_heading-text" />
                      </div>
                    </div>
                  </div>
                  <FeatureTabs
                    imageSide={side}
                    durationMs={durationMs}
                    tabs={(group.tabs ?? []).map((tab) => {
                      const tabPath = `${groupPath}.tabs[_key=="${tab._key}"]`
                      return {
                        key: tab._key,
                        editAttr: edit(tabPath),
                        header: (
                          <span className="feature-tabs_header-row">
                            <InlineSvg svg={tab.iconSvg} className="feature-tabs_icon" />
                            <span className="feature-tabs_title">{tab.title}</span>
                          </span>
                        ),
                        description: <span className="text-size-regular text-color-secondary">{tab.description}</span>,
                        mobileImage: <SanityImage image={tab.image} className="feature-tabs_mobile-img" sizes="90vw" />,
                        image: (
                          <div className="feature-tabs_image-wrapper" data-reveal-image="">
                            <SanityImage
                              image={tab.image}
                              className="feature-tabs_image"
                              sizes="(max-width: 1272px) 55vw, 760px"
                              editAttr={edit(`${tabPath}.image`)}
                            />
                          </div>
                        ),
                      }
                    })}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
