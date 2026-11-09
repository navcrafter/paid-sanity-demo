import {defineQuery} from 'next-sanity'

// ---------- Shared fragments ----------

const LINK = /* groq */ `{label, href, openInNewTab}`

const IMAGE = /* groq */ `{
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`

// ---------- Site settings ----------

export const NAVIGATION_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0].navigation{
    links[]${LINK},
    loginLabel,
    loginLinks[]${LINK},
    cta${LINK}
  }
`)

export const FOOTER_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0].footer{
    cta{heading, button${LINK}},
    columns[]{_key, title, links[]{_key, ...${LINK}}},
    socialLinks[]{_key, platform, url},
    badges[]{_key, size, ...${IMAGE}},
    companyName,
    locations
  }
`)

// ---------- Pages ----------

export const PAGE_QUERY = defineQuery(`
  *[_id == $id][0]{
    _id,
    _type,
    title,
    footerCta{heading, button${LINK}},
    seo
  }
`)

// ---------- Events ----------

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
