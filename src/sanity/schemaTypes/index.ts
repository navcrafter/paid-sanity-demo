import type {SchemaTypeDefinition} from 'sanity'

import {event} from './documents/event'
import {footerCta} from './objects/footerCta'
import {link} from './objects/link'
import {altImage, mediaItem, videoEmbed} from './objects/media'
import {seo} from './objects/seo'
import {sectionTypes} from './sections'
import {companyPage, creatorsPage, homePage} from './singletons/pages'
import {siteSettings} from './singletons/siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  creatorsPage,
  companyPage,
  // Collections
  event,
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
