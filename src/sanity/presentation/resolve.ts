import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

import {PAGE_ROUTES} from '../constants'

// Tells the Presentation tool (visual editing) which URL shows which document,
// and which document to open for a given URL.

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {route: '/', filter: '_type == "homePage" && _id == "homePage"'},
    {route: '/creators', filter: '_type == "creatorsPage" && _id == "creatorsPage"'},
    {route: '/company', filter: '_type == "companyPage" && _id == "companyPage"'},
    {route: '/events', filter: '_type == "eventsPage" && _id == "eventsPage"'},
    {
      route: '/events/:category/:slug',
      filter: '_type == "event" && category == $category && slug.current == $slug',
    },
  ]),
  locations: {
    homePage: defineLocations({locations: [PAGE_ROUTES.homePage]}),
    creatorsPage: defineLocations({locations: [PAGE_ROUTES.creatorsPage]}),
    companyPage: defineLocations({locations: [PAGE_ROUTES.companyPage]}),
    eventsPage: defineLocations({locations: [PAGE_ROUTES.eventsPage]}),
    testimonial: defineLocations({locations: [PAGE_ROUTES.homePage], message: 'Shown wherever a section picks this quote', tone: 'positive'}),
    event: defineLocations({
      select: {title: 'title', slug: 'slug.current', category: 'category'},
      resolve: (doc) =>
        doc?.slug && doc?.category
          ? {
              locations: [
                {title: doc.title || 'Untitled event', href: `/events/${doc.category}/${doc.slug}`},
                PAGE_ROUTES.eventsPage,
              ],
            }
          : null,
    }),
  },
}
