// Shared option lists used by the schema, the Studio sidebar and the site routes.

/** Event categories. `value` is the URL segment: /events/{value}/{slug} (matches the live site). */
export const EVENT_CATEGORIES = [
  {title: 'Supper Club', value: 'supperclub'},
  {title: 'Webinar', value: 'webinar'},
  {title: 'Med / Collaborations', value: 'med'},
  {title: 'Shopping', value: 'shopping'},
  {title: 'Industry', value: 'industry'},
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]['value']

/** Page layouts an event can use. Replaces the three Webflow template pages. */
export const EVENT_TEMPLATES = [
  {title: 'Supper Club (full)', value: 'supperClub'},
  {title: 'Mid Tier', value: 'midTier'},
  {title: 'Webinar', value: 'webinar'},
] as const

export type EventTemplate = (typeof EVENT_TEMPLATES)[number]['value']

export const EVENT_BACKGROUNDS = [
  {title: 'Black', value: 'black'},
  {title: 'Dark', value: 'dark'},
  {title: 'Light', value: 'light'},
] as const

export const EVENT_ACCENTS = [
  {title: 'Default', value: 'default'},
  {title: 'Pink', value: 'pink'},
] as const

/** Documents that exist exactly once. Their document ID equals their type name. */
export const SINGLETON_TYPES = ['siteSettings', 'homePage', 'creatorsPage', 'companyPage', 'eventsPage'] as const

export type PageId = 'homePage' | 'creatorsPage' | 'companyPage' | 'eventsPage'

export const PAGE_ROUTES: Record<PageId, {title: string; href: string}> = {
  homePage: {title: 'Home', href: '/'},
  creatorsPage: {title: 'Creators', href: '/creators'},
  companyPage: {title: 'Company', href: '/company'},
  eventsPage: {title: 'Events', href: '/events'},
}
