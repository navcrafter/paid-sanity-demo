import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineField, defineType} from 'sanity'

import {
  EVENT_ACCENTS,
  EVENT_BACKGROUNDS,
  EVENT_CATEGORIES,
  EVENT_TEMPLATES,
} from '../../constants'

// One collection for every event. Category sets the URL, Template sets the layout,
// Theme sets the colours. Section content (story blocks, galleries, speakers, FAQ...)
// is added in phase 4.

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'setup', title: 'Setup', default: true},
    {name: 'details', title: 'Details'},
    {name: 'registration', title: 'Registration'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
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
      description: 'Sets the URL: /events/{category}/{slug}.',
      options: {list: [...EVENT_CATEGORIES], layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'template',
      type: 'string',
      group: 'setup',
      description: 'Sets the page layout and which sections are available.',
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
          type: 'string',
          options: {list: [...EVENT_BACKGROUNDS], layout: 'radio'},
          initialValue: 'black',
        }),
        defineField({
          name: 'accent',
          type: 'string',
          description: 'Hero accent colour.',
          options: {list: [...EVENT_ACCENTS], layout: 'radio'},
          initialValue: 'default',
        }),
      ],
    }),
    defineField({
      name: 'startDateTime',
      title: 'Starts',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'details',
      description: 'City or "Online", e.g. "Los Angeles, CA".',
    }),
    defineField({
      name: 'venue',
      type: 'string',
      group: 'details',
      hidden: ({document}) => document?.template === 'webinar',
    }),
    defineField({
      name: 'registration',
      type: 'object',
      group: 'registration',
      fields: [
        defineField({
          name: 'heading',
          type: 'string',
          description: 'e.g. "Ready to pull up a chair?"',
        }),
        defineField({
          name: 'hubspotFormId',
          title: 'HubSpot form ID',
          type: 'string',
          description: 'Found in HubSpot → Marketing → Forms → (your form) → Share → Embed code.',
        }),
      ],
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {
      title: 'Event date, newest first',
      name: 'startDateTimeDesc',
      by: [{field: 'startDateTime', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', category: 'category', template: 'template', date: 'startDateTime'},
    prepare({title, category, template, date}) {
      const categoryTitle = EVENT_CATEGORIES.find((c) => c.value === category)?.title
      const templateTitle = EVENT_TEMPLATES.find((t) => t.value === template)?.title
      const day = date ? new Date(date).toLocaleDateString('en-US', {dateStyle: 'medium'}) : null
      return {
        title: title || 'Untitled event',
        subtitle: [categoryTitle, templateTitle, day].filter(Boolean).join(' · '),
      }
    },
  },
})
