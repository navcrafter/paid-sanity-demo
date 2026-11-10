import type {SchemaTypeDefinition} from 'sanity'

import {event, eventStarter} from './documents/event'
import {testimonial} from './documents/testimonial'
import {footerCta} from './objects/footerCta'
import {link} from './objects/link'
import {altImage, mediaItem, videoEmbed} from './objects/media'
import {seo} from './objects/seo'
import {sectionTypes} from './sections'
import {companyPage, creatorsPage, eventsPage, homePage} from './singletons/pages'
import {siteSettings} from './singletons/siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  creatorsPage,
  companyPage,
  eventsPage,
  // Collections
  event,
  eventStarter,
  testimonial,
  // Objects
  link,
  footerCta,
  seo,
  altImage,
  videoEmbed,
  mediaItem,
  // Page sections
  ...sectionTypes,
]
