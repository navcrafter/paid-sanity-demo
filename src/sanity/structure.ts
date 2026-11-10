import {ArchiveIcon} from '@sanity/icons/Archive'
import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {ClockIcon} from '@sanity/icons/Clock'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {FolderIcon} from '@sanity/icons/Folder'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

import {EVENT_CATEGORIES} from './constants'
import {companyPage, creatorsPage, eventsPage, homePage} from './schemaTypes/singletons/pages'

// Sidebar layout. Mirrors the Webflow page tree the team already knows:
// Pages (Home, Creators, Company), Events split into category folders, Site settings.

/** "New event" in the event lists offers the three layouts (see sanity.config.ts). */
const STARTER_TEMPLATES = ['event-supper-club', 'event-mid-tier', 'event-webinar']

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
              singleton(S, 'eventsPage', 'Events page', eventsPage.icon),
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
                    .initialValueTemplates(STARTER_TEMPLATES.map((id) => S.initialValueTemplateItem(id))),
                ),
              S.listItem()
                .title('Upcoming')
                .id('events-upcoming')
                .icon(ClockIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Upcoming events')
                    .filter('_type == "event" && dateTime(startDateTime) >= dateTime(now())')
                    .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                    .initialValueTemplates(STARTER_TEMPLATES.map((id) => S.initialValueTemplateItem(id))),
                ),
              S.listItem()
                .title('Past')
                .id('events-past')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Past events')
                    .filter('_type == "event" && dateTime(startDateTime) < dateTime(now())')
                    .defaultOrdering([{field: 'startDateTime', direction: 'desc'}])
                    .initialValueTemplates(STARTER_TEMPLATES.map((id) => S.initialValueTemplateItem(id))),
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
      S.listItem()
        .title('Testimonials')
        .icon(BlockquoteIcon)
        .child(S.documentTypeList('testimonial').title('Testimonials')),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
    ])
