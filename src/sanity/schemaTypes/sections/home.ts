import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {CaseIcon} from '@sanity/icons/Case'
import {ImagesIcon} from '@sanity/icons/Images'
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'
import {TextIcon} from '@sanity/icons/Text'
import {ThListIcon} from '@sanity/icons/ThList'
import {defineArrayMember, defineField} from 'sanity'

import {defineSection, headingField} from './defineSection'
import {colorSchemeField, iconSvgField} from './shared'

const styleGroups = [
  {name: 'content', title: 'Content', default: true},
  {name: 'style', title: 'Style'},
]

// ---------------------------------------------------------------- Statement

export const statementSection = defineSection({
  name: 'statementSection',
  title: 'Statement',
  description: 'One large centred heading.',
  icon: TextIcon,
  groups: styleGroups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({
      name: 'effect',
      type: 'string',
      group: 'style',
      options: {
        list: [
          {title: 'Words light up as you scroll', value: 'scrub'},
          {title: 'Words fade in', value: 'reveal'},
          {title: 'None', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'scrub',
    }),
  ],
})

// ---------------------------------------------------------------- Showcase

export const showcaseSection = defineSection({
  name: 'showcaseSection',
  title: 'Product showcase',
  description: 'Large product image, a big heading and a drifting gallery.',
  icon: ImagesIcon,
  groups: styleGroups,
  fields: [
    defineField({name: 'image', type: 'altImage', group: 'content'}),
    {...headingField(), group: 'content'},
    defineField({
      name: 'gallery',
      description: 'Drifting row: photos show tall; videos are stacked in pairs.',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'mediaItem'})],
      options: {layout: 'grid'},
    }),
    {...colorSchemeField, initialValue: 'dark'},
  ],
})

// ---------------------------------------------------------------- Feature tabs

export const featureTabsSection = defineSection({
  name: 'featureTabsSection',
  title: 'Feature tabs',
  description: 'Groups of auto-advancing tabs, each with its own image.',
  icon: ThListIcon,
  groups: styleGroups,
  fields: [
    defineField({
      name: 'groups',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'featureTabGroup',
          title: 'Tab group',
          type: 'object',
          fields: [
            defineField({name: 'tag', type: 'string'}),
            headingField(),
            defineField({
              name: 'imageSide',
              title: 'Image side',
              type: 'string',
              options: {list: ['right', 'left'], layout: 'radio', direction: 'horizontal'},
              initialValue: 'right',
            }),
            defineField({
              name: 'tabs',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'featureTab',
                  type: 'object',
                  fields: [
                    defineField({name: 'title', type: 'string'}),
                    defineField({name: 'description', type: 'text', rows: 3}),
                    defineField({name: 'image', type: 'altImage'}),
                    iconSvgField(),
                  ],
                  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'tag', media: 'tabs.0.image'},
            prepare: ({title, subtitle, media}) => ({title: title?.replace(/\n/g, ' '), subtitle, media}),
          },
        }),
      ],
    }),
    defineField({
      name: 'tabDuration',
      title: 'Seconds per tab',
      type: 'number',
      group: 'style',
      initialValue: 8,
      validation: (rule) => rule.min(2).max(30),
    }),
    {...colorSchemeField, initialValue: 'light'},
  ],
  preview: {
    select: {title: 'groups.0.heading', hidden: 'hidden'},
    prepare: ({title, hidden}) => ({
      title: title?.replace(/\n/g, ' ') ?? 'Feature tabs',
      subtitle: `Feature tabs${hidden ? ' · hidden' : ''}`,
      media: ThListIcon,
    }),
  },
})

// ---------------------------------------------------------------- Testimonial carousel

export const testimonialCarouselSection = defineSection({
  name: 'testimonialCarouselSection',
  title: 'Testimonial carousel',
  icon: BlockquoteIcon,
  groups: styleGroups,
  fields: [
    defineField({
      name: 'quotes',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'carouselQuote',
          type: 'object',
          fields: [
            defineField({name: 'quote', type: 'text', rows: 3}),
            defineField({
              name: 'size',
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
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'company', type: 'string'}),
            defineField({name: 'photo', type: 'altImage'}),
          ],
          preview: {select: {title: 'name', subtitle: 'company', media: 'photo'}},
        }),
      ],
    }),
    defineField({
      name: 'autoplaySeconds',
      title: 'Seconds per quote',
      type: 'number',
      group: 'style',
      initialValue: 6,
    }),
  ],
  preview: {
    select: {quotes: 'quotes', hidden: 'hidden'},
    prepare: ({quotes, hidden}) => ({
      title: `${quotes?.length ?? 0} quotes`,
      subtitle: `Testimonial carousel${hidden ? ' · hidden' : ''}`,
      media: BlockquoteIcon,
    }),
  },
})

// ---------------------------------------------------------------- Comparison

const comparisonList = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group: 'content',
    fields: [
      defineField({name: 'label', type: 'string'}),
      defineField({name: 'items', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    ],
  })

export const comparisonSection = defineSection({
  name: 'comparisonSection',
  title: 'Comparison',
  description: '"Without #paid" vs "With #paid".',
  icon: SplitHorizontalIcon,
  groups: styleGroups,
  fields: [{...headingField(), group: 'content'}, comparisonList('without', 'Without'), comparisonList('with', 'With')],
})

// ---------------------------------------------------------------- Case studies

export const CASE_STUDY_PALETTES = [
  {title: 'Purple / grey text', value: 'purple'},
  {title: 'Pink / burgundy text', value: 'pink'},
  {title: 'Light blue / green text', value: 'lightBlue'},
  {title: 'Cream / red text', value: 'cream'},
  {title: 'Grey / light green text', value: 'grey'},
]

export const caseStudiesSection = defineSection({
  name: 'caseStudiesSection',
  title: 'Case studies',
  description: 'A fanned hand of case study cards (a swipeable carousel on phones).',
  icon: CaseIcon,
  groups: styleGroups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({
      name: 'studies',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.max(5),
      of: [
        defineArrayMember({
          name: 'caseStudyCard',
          type: 'object',
          fields: [
            defineField({name: 'brand', type: 'string'}),
            defineField({name: 'image', type: 'altImage'}),
            defineField({name: 'link', type: 'link'}),
            defineField({
              name: 'palette',
              title: 'Card colour',
              type: 'string',
              options: {list: CASE_STUDY_PALETTES},
              initialValue: 'purple',
            }),
          ],
          preview: {select: {title: 'brand', subtitle: 'link.href', media: 'image'}},
        }),
      ],
    }),
  ],
})
