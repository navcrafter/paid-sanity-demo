import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField} from 'sanity'

import {defineSection, headingField} from './defineSection'

export const heroSection = defineSection({
  name: 'heroSection',
  title: 'Hero',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'gallery', title: 'Gallery'},
    {name: 'logos', title: 'Logos'},
    {name: 'style', title: 'Style'},
  ],
  fields: [
    defineField({
      name: 'announcement',
      type: 'object',
      group: 'content',
      description: 'The small pill + link above the heading.',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'tag', type: 'string', initialValue: 'New'}),
        defineField({name: 'link', type: 'link'}),
      ],
    }),
    {...headingField(), group: 'content'},
    defineField({name: 'text', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'cta', title: 'Button', type: 'link', group: 'content'}),

    defineField({
      name: 'galleryStyle',
      title: 'Gallery style',
      type: 'string',
      group: 'gallery',
      options: {
        list: [
          {title: 'Orbit: cards drift through 3D (drag to move)', value: 'orbit'},
          {title: 'Ring: tall cards spin in a 3D ring (drag to spin)', value: 'ring'},
          {title: 'Drift: endless row of photos and videos', value: 'drift'},
          {title: 'None', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'orbit',
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({type: 'mediaItem'})],
      options: {layout: 'grid'},
      hidden: ({parent}) => parent?.galleryStyle === 'none',
    }),

    defineField({name: 'logosHeading', title: 'Logos heading', type: 'string', group: 'logos'}),
    defineField({
      name: 'logoRows',
      title: 'Logo rows',
      description: 'Rows take turns fading in and out (2–4 rows).',
      type: 'array',
      group: 'logos',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          name: 'logoRow',
          type: 'object',
          fields: [
            defineField({
              name: 'logos',
              type: 'array',
              of: [defineArrayMember({type: 'altImage'})],
              options: {layout: 'grid'},
            }),
          ],
          preview: {
            select: {logos: 'logos', media: 'logos.0'},
            prepare: ({logos, media}) => ({title: `${logos?.length ?? 0} logos`, media}),
          },
        }),
      ],
    }),

    defineField({
      name: 'theme',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Cream', value: 'cream'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'cream',
    }),
    defineField({
      name: 'headingSize',
      title: 'Heading size',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Display (extra large)', value: 'display'},
          {title: 'Large', value: 'large'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'display',
    }),
  ],
})
