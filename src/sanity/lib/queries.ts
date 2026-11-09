import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]`)

export const PAGE_QUERY = defineQuery(`*[_id == $id][0]{_id, _type, title, seo}`)

export const EVENT_PATHS_QUERY = defineQuery(
  `*[_type == "event" && defined(slug.current) && defined(category)]{"category": category, "slug": slug.current}`,
)

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && category == $category && slug.current == $slug][0]{
    _id,
    _type,
    title,
    category,
    template,
    theme,
    startDateTime,
    location,
    venue,
    registration,
    seo
  }
`)
