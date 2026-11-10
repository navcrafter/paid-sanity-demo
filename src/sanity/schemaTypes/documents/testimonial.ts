import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {defineField, defineType} from 'sanity'

import {PreviewBanner} from '../../components/PreviewBanner'

// One collection of customer quotes. Sections (e.g. the Home testimonial carousel)
// pick quotes from here, so a quote is written once and can be reused or reordered per page.

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  icon: BlockquoteIcon,
  components: {input: PreviewBanner},
  fields: [
    defineField({name: 'quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'company', title: 'Role / company', type: 'string', description: 'e.g. "VP Marketing, Acme".'}),
    defineField({name: 'photo', type: 'altImage'}),
    defineField({
      name: 'size',
      title: 'Text size',
      type: 'string',
      description: 'Use "Smaller" for long quotes.',
      options: {
        list: [
          {title: 'Large', value: 'large'},
          {title: 'Smaller', value: 'small'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'large',
    }),
  ],
  preview: {
    select: {title: 'name', company: 'company', quote: 'quote', media: 'photo'},
    prepare: ({title, company, quote, media}) => ({
      title: [title, company].filter(Boolean).join(' · ') || 'Untitled testimonial',
      subtitle: quote,
      media,
    }),
  },
})
