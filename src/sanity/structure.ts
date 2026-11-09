import {CalendarIcon} from '@sanity/icons/Calendar'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {FolderIcon} from '@sanity/icons/Folder'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

import {EVENT_CATEGORIES} from './constants'
import {companyPage, creatorsPage, homePage} from './schemaTypes/singletons/pages'

// Sidebar layout. Mirrors the Webflow page tree the team already knows:
// Pages (Home, Creators, Company), Events split into category folders, Site settings.

function singleton(S: StructureBuilder, typeName: string, title: string, icon?: typeof CogIcon) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              singleton(S, 'homePage', 'Home', homePage.icon),
              singleton(S, 'creatorsPage', 'Creators', creatorsPage.icon),
              singleton(S, 'companyPage', 'Company', companyPage.icon),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('All events')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('All events')
                    .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                    .initialValueTemplates([
                      S.initialValueTemplateItem('event-supper-club'),
                      S.initialValueTemplateItem('event-mid-tier'),
                      S.initialValueTemplateItem('event-webinar'),
                    ]),
                ),
              S.divider(),
              ...EVENT_CATEGORIES.map((category) =>
                S.listItem()
                  .title(category.title)
                  .id(`events-${category.value}`)
                  .icon(FolderIcon)
                  .child(
                    S.documentTypeList('event')
                      .title(category.title)
                      .filter('_type == "event" && category == $category')
                      .params({category: category.value})
                      .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                      .initialValueTemplates([
                        S.initialValueTemplateItem('event-in-category', {category: category.value}),
                      ]),
                  ),
              ),
            ]),
        ),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
    ])
