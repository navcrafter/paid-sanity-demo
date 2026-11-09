import {stegaClean} from 'next-sanity'

import type {SanityImageValue} from '@/sanity/lib/assets'

import {WordReveal} from '../effects/WordReveal'
import {DriftGallery} from '../galleries/DriftGallery'
import type {MediaValue} from '../media/Media'
import {SanityImage} from '../media/SanityImage'
import type {SectionProps} from './types'

export interface ShowcaseData {
  image?: SanityImageValue | null
  heading?: string | null
  gallery?: MediaValue[] | null
  colorScheme?: string | null
}

/** Home: product image, big heading, drifting gallery. */
export function ShowcaseSection({data, edit}: SectionProps<ShowcaseData>) {
  const scheme = stegaClean(data.colorScheme)
  const gallery = data.gallery ?? []
  const itemAttrs = Object.fromEntries(gallery.map((item) => [item._key, edit(`gallery[_key=="${item._key}"]`)]))

  return (
    <section className="section_showcase" data-theme={scheme && scheme !== 'none' ? scheme : undefined}>
      <div className="padding-global">
        <div className="container-large">
          {data.image && (
            <div className="showcase_image-wrapper" data-reveal-image="">
              <SanityImage image={data.image} className="showcase_image" sizes="(max-width: 1272px) 90vw, 1272px" editAttr={edit('image')} />
            </div>
          )}
          <div className="showcase_heading-wrapper">
            <WordReveal text={data.heading} className="heading-style-h1" />
          </div>
          {gallery.length > 0 && (
            <div className="showcase_gallery">
              <DriftGallery items={gallery} editAttrs={itemAttrs} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
