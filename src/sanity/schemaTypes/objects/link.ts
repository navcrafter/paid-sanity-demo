import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

/** A label + URL pair. Internal pages use a path ("/creators"), everything else a full URL. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'A page on this site ("/creators", "/company#jobs") or a full URL ("https://…").',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          return /^(\/|#|https?:\/\/|mailto:|tel:)/.test(value)
            ? true
            : 'Start with "/" for a page on this site, or a full URL like "https://…".'
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
