import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineArrayMember, defineField, defineType, type ConditionalPropertyCallbackContext} from 'sanity'

import {HeroColorInput} from '../../components/HeroColorInput'
import {PreviewBanner} from '../../components/PreviewBanner'
import {EVENT_BACKGROUNDS, EVENT_CATEGORIES, EVENT_TEMPLATES, HERO_COLORS} from '../../constants'

// One collection for every event. Category sets the URL, Template sets the layout
// (hero style and which fields apply), Theme sets the colours. The optional
// sections can be reordered or removed; each template starts with its usual set.

const isWebinar = ({document}: ConditionalPropertyCallbackContext) => document?.template === 'webinar'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  icon: CalendarIcon,
  components: {input: PreviewBanner},
  groups: [
    {name: 'setup', title: 'Setup', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'content', title: 'Content'},
    {name: 'sections', title: 'Sections'},
    {name: 'registration', title: 'Registration'},
    {name: 'info', title: 'More info'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---------------- Setup
    defineField({
      name: 'title',
      type: 'string',
      group: 'setup',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'setup',
      description: 'The last part of the URL, e.g. "an-evening-at-local-eclectic".',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'setup',
      description: 'Sets the URL (/events/{category}/{slug}) and the filter on the Events page.',
      options: {list: [...EVENT_CATEGORIES], layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'template',
      type: 'string',
      group: 'setup',
      description: 'Sets the hero layout and which fields apply. Supper Club: video hero with date, location and time. Mid Tier: same layout, lighter card. Webinar: image hero with speakers.',
      options: {list: [...EVENT_TEMPLATES], layout: 'radio', direction: 'horizontal'},
      initialValue: 'supperClub',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'theme',
      type: 'object',
      group: 'setup',
      options: {columns: 2},
      fields: [
        defineField({
          name: 'background',
          title: 'Page background',
          type: 'string',
          options: {list: [...EVENT_BACKGROUNDS], layout: 'radio'},
          initialValue: 'black',
        }),
        defineField({
          name: 'accent',
          title: 'Hero colour',
          type: 'string',
          description: 'Brand colour for the hero card and the band behind it. Default keeps the template\u2019s own look.',
          options: {list: HERO_COLORS.map(({title, value}) => ({title, value}))},
          components: {input: HeroColorInput},
          initialValue: 'default',
        }),
      ],
    }),
    defineField({
      name: 'startDateTime',
      title: 'Starts',
      type: 'datetime',
      group: 'setup',
      description: 'Used to sort events and split upcoming from past on the Events page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'owner',
      title: 'Event owner',
      type: 'string',
      group: 'setup',
      description: 'Internal. Who runs this event on the team (the "Event Owner" column in the events sheet). Not shown on the site.',
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'altImage',
      group: 'setup',
      description: 'Shown on the Events page. Falls back to the hero image or video poster.',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 2,
      group: 'setup',
      description: 'One or two sentences for the Events page card.',
    }),

    // ---------------- Hero
    defineField({
      name: 'logo',
      title: 'Event logo',
      type: 'altImage',
      group: 'hero',
      description: 'Optional, shown above the title (e.g. a partner or series logo).',
      hidden: isWebinar,
    }),
    defineField({
      name: 'logoSize',
      type: 'string',
      group: 'hero',
      options: {list: [{title: 'Regular', value: 'regular'}, {title: 'Large', value: 'large'}], layout: 'radio', direction: 'horizontal'},
      initialValue: 'regular',
      hidden: isWebinar,
    }),
    defineField({
      name: 'dateLabel',
      title: 'Date (as shown)',
      type: 'string',
      group: 'hero',
      description: 'e.g. "December 3, 2026" or "Thursday, April 3".',
    }),
    defineField({name: 'timeLabel', title: 'Time (as shown)', type: 'string', group: 'hero', description: 'e.g. "6:00 PM - 8:30 PM".'}),
    defineField({name: 'location', type: 'string', group: 'hero', hidden: isWebinar}),
    defineField({name: 'locationUrl', title: 'Map link', type: 'url', group: 'hero', hidden: isWebinar}),
    defineField({
      name: 'heroVideo',
      title: 'Hero video',
      type: 'videoEmbed',
      group: 'hero',
      hidden: isWebinar,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'hero',
      hidden: ({document}) => document?.template !== 'webinar',
    }),

    // ---------------- Content
    defineField({name: 'intro', type: 'text', rows: 3, group: 'content', description: 'The bold opening paragraph.'}),
    defineField({name: 'bodyHeading', title: 'Body heading', type: 'string', group: 'content', description: 'e.g. "What awaits you:" (optional).'}),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Subheading', value: 'h3'},
          ],
          lists: [{title: 'Bullets', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                fields: [defineField({name: 'href', type: 'url', validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto']})})],
              }),
            ],
          },
        }),
      ],
    }),

    // ---------------- Sections
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Shown under the main text. Drag to reorder; remove what this event doesn’t need.',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({
          name: 'eventLogoStrip',
          title: 'Logo strip',
          type: 'object',
          fields: [
            defineField({name: 'heading', type: 'string', initialValue: 'A glimpse of who we’ve hosted'}),
            defineField({name: 'image', title: 'Logo strip image', type: 'altImage', description: 'A wide image of logos; it scrolls sideways.'}),
          ],
          preview: {select: {title: 'heading', media: 'image'}, prepare: ({title, media}) => ({title, subtitle: 'Logo strip', media})},
        }),
        defineArrayMember({
          name: 'eventTestimonials',
          title: 'Testimonials',
          type: 'object',
          fields: [
            defineField({name: 'heading', type: 'string', initialValue: 'Who’s been at our table'}),
            defineField({
              name: 'quotes',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'eventQuote',
                  type: 'object',
                  fields: [
                    defineField({name: 'quote', type: 'text', rows: 3}),
                    defineField({name: 'name', type: 'string'}),
                    defineField({name: 'logo', title: 'Company logo', type: 'altImage'}),
                  ],
                  preview: {select: {title: 'name', subtitle: 'quote', media: 'logo'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'heading', quotes: 'quotes'}, prepare: ({title, quotes}) => ({title, subtitle: `Testimonials · ${quotes?.length ?? 0}`})},
        }),
        defineArrayMember({
          name: 'eventPeople',
          title: 'People',
          type: 'object',
          description: 'Creators, speakers or hosts.',
          fields: [
            defineField({name: 'heading', type: 'string', initialValue: 'Past Creators'}),
            defineField({
              name: 'people',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'eventPerson',
                  type: 'object',
                  fields: [
                    defineField({name: 'name', type: 'string'}),
                    defineField({name: 'subtitle', type: 'string', description: 'Handle or company, e.g. "@mdmotivator".'}),
                    defineField({name: 'photo', type: 'altImage'}),
                    defineField({name: 'url', title: 'Link', type: 'url'}),
                  ],
                  preview: {select: {title: 'name', subtitle: 'subtitle', media: 'photo'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'heading', people: 'people'}, prepare: ({title, people}) => ({title, subtitle: `People · ${people?.length ?? 0}`})},
        }),
        defineArrayMember({
          name: 'eventVenues',
          title: 'Venues',
          type: 'object',
          fields: [
            defineField({name: 'heading', type: 'string', initialValue: 'Past Restaurants'}),
            defineField({
              name: 'venues',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'eventVenue',
                  type: 'object',
                  fields: [defineField({name: 'name', type: 'string'}), defineField({name: 'logo', type: 'altImage'})],
                  preview: {select: {title: 'name', media: 'logo'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'heading', venues: 'venues'}, prepare: ({title, venues}) => ({title, subtitle: `Venues · ${venues?.length ?? 0}`})},
        }),
      ],
    }),

    // ---------------- Registration
    defineField({
      name: 'registration',
      type: 'object',
      group: 'registration',
      options: {collapsible: false},
      fields: [
        defineField({name: 'heading', type: 'string', description: 'e.g. "Ready to pull up a chair?"'}),
        defineField({
          name: 'hubspotFormId',
          title: 'HubSpot form ID',
          type: 'string',
          description: 'HubSpot → Marketing → Forms → (your form) → Share → Embed code: the formId value.',
        }),
      ],
    }),

    // ---------------- More info
    defineField({name: 'moreInfoHeading', title: 'Heading', type: 'string', group: 'info', initialValue: 'More Information'}),
    defineField({
      name: 'moreInfo',
      title: 'Questions',
      type: 'array',
      group: 'info',
      of: [
        defineArrayMember({
          name: 'eventFaq',
          type: 'object',
          fields: [defineField({name: 'question', type: 'string'}), defineField({name: 'answer', type: 'text', rows: 3})],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),

    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Event date, newest first', name: 'startDateTimeDesc', by: [{field: 'startDateTime', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category', template: 'template', date: 'startDateTime', owner: 'owner', media: 'cardImage', poster: 'heroVideo.poster', heroImage: 'heroImage'},
    prepare({title, category, template, date, owner, media, poster, heroImage}) {
      const categoryTitle = EVENT_CATEGORIES.find((c) => c.value === category)?.title
      const templateTitle = EVENT_TEMPLATES.find((t) => t.value === template)?.title
      const day = date ? new Date(date).toLocaleDateString('en-US', {dateStyle: 'medium'}) : null
      return {
        title: title || 'Untitled event',
        subtitle: [categoryTitle, templateTitle, day, owner].filter(Boolean).join(' · '),
        media: media ?? heroImage ?? poster,
      }
    },
  },
})

// ---------------------------------------------------------------- Starting content

/** Event fields a new event starts with. Everything else (title, date, location, form ID…) is per event. */
const STARTER_FIELDS = [
  'template',
  'theme',
  'logo',
  'logoSize',
  'heroVideo',
  'intro',
  'bodyHeading',
  'body',
  'sections',
  'registration',
  'moreInfoHeading',
  'moreInfo',
]

/**
 * "Starting content" for each template: one document per template (id `eventStarter-<template>`),
 * edited in Studio → Events → Starting content. A new event is created as a copy of the published
 * version (see eventStarters.ts), so the team changes the defaults here, without a developer.
 * Reuses the event's own field definitions so the two can never drift apart.
 */
export const eventStarter = defineType({
  name: 'eventStarter',
  title: 'Event starting content',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'setup', title: 'Look', default: true},
    {name: 'hero', title: 'Hero'},
    {name: 'content', title: 'Content'},
    {name: 'sections', title: 'Sections'},
    {name: 'registration', title: 'Registration'},
    {name: 'info', title: 'More info'},
  ],
  fields: event.fields
    .filter((field) => STARTER_FIELDS.includes(field.name))
    .map((field) =>
      field.name === 'template'
        ? {...field, readOnly: true, description: 'Which template this starting content belongs to.'}
        : field,
    ),
  preview: {
    select: {template: 'template', sections: 'sections'},
    prepare: ({template, sections}) => ({
      title: `${EVENT_TEMPLATES.find((t) => t.value === template)?.title ?? 'Event'}: starting content`,
      subtitle: `New events start as a copy of this · ${sections?.length ?? 0} sections`,
    }),
  },
})
