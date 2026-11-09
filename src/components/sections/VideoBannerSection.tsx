import {stegaClean} from 'next-sanity'

import {RollText} from '../effects/RollText'
import {WordReveal} from '../effects/WordReveal'
import {SanityVideo, type VideoValue} from '../media/Media'
import {FullVideoButton} from './FullVideoButton'
import type {SectionProps} from './types'

export interface VideoBannerData {
  heading?: string | null
  text?: string | null
  video?: VideoValue | null
  buttonLabel?: string | null
  fullVideoId?: string | null
  colorScheme?: string | null
}

/** Creators: "We bring creators together IRL, too" + full-width video. */
export function VideoBannerSection({data, edit}: SectionProps<VideoBannerData>) {
  const scheme = stegaClean(data.colorScheme)
  const fullVideoId = stegaClean(data.fullVideoId)

  return (
    <section className="section_video-banner" data-theme={scheme && scheme !== 'none' ? scheme : undefined}>
      <div className="padding-global">
        <div className="container-large">
          <div className="video-banner_header text-align-center">
            <div className="flex-vertical is-gap-1">
              <div className="video-banner_heading align-center">
                <WordReveal text={data.heading} className="heading-style-h2" />
              </div>
              {data.text && (
                <div className="video-banner_text align-center">
                  <p className="text-size-large text-color-secondary-on-dark">{data.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="video-banner_media-wrapper">
        <div className="video-banner_media" data-reveal-image="">
          <SanityVideo video={data.video} className="video-banner_video" editAttr={edit('video')} />
          {fullVideoId && (
            <div className="video-banner_overlay">
              <FullVideoButton vidzflowId={fullVideoId} className="button is-video">
                <RollText text={data.buttonLabel || 'Watch the full video'} />
              </FullVideoButton>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
