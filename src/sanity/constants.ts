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

/**
 * Stock brand colours an editor can pick for the event hero (the big card and the band behind it).
 * Pink, Cream and Black are the brand guide values (#F74B93 / #FDFBF7 / #12131B, the softened
 * black); the rest come from the site's design tokens (src/styles/tokens.css). "Default" keeps each template's
 * own colours. Stored in `theme.accent`; the Studio shows them as swatches (HeroColorInput).
 */
export const HERO_COLORS = [
  {title: 'Default', value: 'default', card: null, text: null, band: null},
  {title: 'Pink', value: 'pink', card: '#f74b93', text: '#fdfbf7', band: '#fdfbf7'},
  {title: 'Red', value: 'red', card: '#f84335', text: '#fdfbf7', band: '#fae1e7'},
  {title: 'Blue', value: 'blue', card: '#2f91b6', text: '#fdfbf7', band: '#b9d4da'},
  {title: 'Light blue', value: 'lightBlue', card: '#b9d4da', text: '#060606', band: '#fbf9f5'},
  {title: 'Purple', value: 'purple', card: '#cea8bf', text: '#060606', band: '#f0eeea'},
  {title: 'Dark green', value: 'darkGreen', card: '#2d3a23', text: '#fbf9f5', band: '#e4edbc'},
  {title: 'Light green', value: 'lightGreen', card: '#e4edbc', text: '#060606', band: '#fbf9f5'},
  {title: 'Burgundy', value: 'burgundy', card: '#370300', text: '#fbf9f5', band: '#fae1e7'},
  {title: 'Black', value: 'black', card: '#12131b', text: '#fdfbf7', band: '#f0eeea'},
  {title: 'Cream', value: 'cream', card: '#fdfbf7', text: '#12131b', band: '#fae1e7'},
] as const

export type HeroColor = (typeof HERO_COLORS)[number]['value']

/** Kept for existing documents; the schema now uses HERO_COLORS. */
export const EVENT_ACCENTS = HERO_COLORS.map(({title, value}) => ({title, value}))

/** Documents that exist exactly once. Their document ID equals their type name. */
export const SINGLETON_TYPES = ['siteSettings', 'homePage', 'creatorsPage', 'companyPage', 'eventsPage'] as const

export type PageId = 'homePage' | 'creatorsPage' | 'companyPage' | 'eventsPage'

export const PAGE_ROUTES: Record<PageId, {title: string; href: string}> = {
  homePage: {title: 'Home', href: '/'},
  creatorsPage: {title: 'Creators', href: '/creators'},
  companyPage: {title: 'Company', href: '/company'},
  eventsPage: {title: 'Events', href: '/events'},
}
