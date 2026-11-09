import type {SchemaTypeDefinition} from 'sanity'

import {event} from './documents/event'
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
  seo,
]
