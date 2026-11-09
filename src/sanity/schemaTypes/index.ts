import type {SchemaTypeDefinition} from 'sanity'

import {event} from './documents/event'
import {footerCta} from './objects/footerCta'
import {link} from './objects/link'
import {seo} from './objects/seo'
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
]
