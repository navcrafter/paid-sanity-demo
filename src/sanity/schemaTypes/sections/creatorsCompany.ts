import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {CaseIcon} from '@sanity/icons/Case'
import {CommentIcon} from '@sanity/icons/Comment'
import {ImagesIcon} from '@sanity/icons/Images'
import {StackIcon} from '@sanity/icons/Stack'
import {StarIcon} from '@sanity/icons/Star'
import {UsersIcon} from '@sanity/icons/Users'
import {VideoIcon} from '@sanity/icons/Video'
import {defineArrayMember, defineField} from 'sanity'

import {defineSection, headingField} from './defineSection'
import {colorSchemeField, iconSvgField} from './shared'

const groups = [
  {name: 'content', title: 'Content', default: true},
  {name: 'style', title: 'Style'},
]

const anchorField = defineField({
  name: 'anchorId',
  title: 'Anchor ID',
  description: 'Optional. Lets links jump to this section, e.g. "benefits" → /creators#benefits.',
  type: 'slug',
  group: 'style',
})

// ---------------------------------------------------------------- Stack cards (Creators)

export const stackCardsSection = defineSection({
  name: 'stackCardsSection',
  title: 'Stacked cards',
  description: 'Numbered steps that stack on top of each other as you scroll.',
  icon: StackIcon,
  groups,
  fields: [
    defineField({
      name: 'cards',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'stackCard',
          type: 'object',
          fields: [
            headingField(),
            defineField({name: 'text', type: 'text', rows: 3}),
            defineField({name: 'video', type: 'videoEmbed'}),
            defineField({
              name: 'color',
              type: 'string',
              options: {
                list: [
                  {title: 'Blue', value: 'blue'},
                  {title: 'Purple', value: 'purple'},
                  {title: 'Orange', value: 'orange'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'blue',
            }),
            iconSvgField(),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'text', media: 'video.poster'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'cards.0.heading', hidden: 'hidden'},
    prepare: ({title, hidden}) => ({title: title ?? 'Stacked cards', subtitle: `Stacked cards${hidden ? ' · hidden' : ''}`, media: StackIcon}),
  },
})

// ---------------------------------------------------------------- Benefits (+ optional job board)

export const benefitsSection = defineSection({
  name: 'benefitsSection',
  title: 'Benefits grid',
  description: 'Heading, a grid of benefit cards and an optional job board.',
  icon: StarIcon,
  groups: [...groups, {name: 'jobs', title: 'Job board'}],
  fields: [
    {...headingField(), group: 'content'},
    defineField({name: 'text', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'cards',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'benefitCard',
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'description', type: 'text', rows: 2}),
            iconSvgField(),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'jobBoard',
      title: 'Job board',
      type: 'object',
      group: 'jobs',
      fields: [
        defineField({name: 'heading', type: 'string'}),
        defineField({name: 'anchorId', title: 'Anchor ID', type: 'string', description: 'e.g. "jobs" → /company#jobs', initialValue: 'jobs'}),
        defineField({
          name: 'jobs',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'job',
              type: 'object',
              fields: [
                defineField({name: 'title', type: 'string'}),
                defineField({name: 'location', type: 'string'}),
                defineField({name: 'department', type: 'string'}),
                defineField({name: 'type', type: 'string', initialValue: 'Full-time'}),
                defineField({name: 'url', title: 'Application link', type: 'url'}),
              ],
              preview: {select: {title: 'title', subtitle: 'location'}},
            }),
          ],
        }),
      ],
    }),
    anchorField,
  ],
})

// ---------------------------------------------------------------- Creator testimonials

export const creatorTestimonialsSection = defineSection({
  name: 'creatorTestimonialsSection',
  title: 'Creator testimonials',
  description: 'A ticker of video testimonials that glides sideways (drag to move).',
  icon: CommentIcon,
  groups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({
      name: 'items',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'creatorTestimonial',
          type: 'object',
          fields: [
            defineField({name: 'quote', type: 'text', rows: 3}),
            defineField({name: 'handle', type: 'string', description: 'e.g. @mattkring'}),
            defineField({name: 'tag', type: 'string', initialValue: 'Creator'}),
            defineField({name: 'video', type: 'videoEmbed'}),
          ],
          preview: {select: {title: 'handle', subtitle: 'quote', media: 'video.poster'}},
        }),
      ],
    }),
  ],
})

// ---------------------------------------------------------------- Video banner

export const videoBannerSection = defineSection({
  name: 'videoBannerSection',
  title: 'Video banner',
  description: 'Heading and text above a full-width video with a "watch the full video" button.',
  icon: VideoIcon,
  groups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({name: 'text', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'video', title: 'Background video', type: 'videoEmbed', group: 'content'}),
    defineField({name: 'buttonLabel', type: 'string', group: 'content', initialValue: 'Watch the full video'}),
    defineField({
      name: 'fullVideoId',
      title: 'Full video (Vidzflow ID)',
      description: 'Plays over the page, with sound, when the button is clicked. Leave empty to hide the button.',
      type: 'string',
      group: 'content',
    }),
    {...colorSchemeField, initialValue: 'dark'},
  ],
})

// ---------------------------------------------------------------- FAQ

export const faqSection = defineSection({
  name: 'faqSection',
  title: 'FAQ',
  icon: BlockquoteIcon,
  groups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({name: 'intro', type: 'string', group: 'content', description: 'e.g. "Can’t find what you’re looking for? Visit our"'}),
    defineField({name: 'introLink', type: 'link', group: 'content'}),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'faqItem',
          type: 'object',
          fields: [defineField({name: 'question', type: 'string'}), defineField({name: 'answer', type: 'text', rows: 4})],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),
    {...colorSchemeField, initialValue: 'light'},
  ],
})

// ---------------------------------------------------------------- Mission blocks (Company)

export const missionSection = defineSection({
  name: 'missionSection',
  title: 'Mission blocks',
  description: 'Heading + text pairs, each over a large photo with an overlapping quote card.',
  icon: ImagesIcon,
  groups,
  fields: [
    defineField({
      name: 'blocks',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'missionBlock',
          type: 'object',
          fields: [
            headingField(),
            defineField({name: 'text', type: 'text', rows: 3}),
            defineField({name: 'image', type: 'altImage'}),
            defineField({name: 'quote', type: 'text', rows: 3}),
            defineField({
              name: 'quoteMeta',
              title: 'Quote details',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'quoteMetaItem',
                  type: 'object',
                  fields: [defineField({name: 'label', type: 'string'}), iconSvgField()],
                  preview: {select: {title: 'label'}},
                }),
              ],
            }),
            defineField({
              name: 'cardSide',
              title: 'Quote card side',
              type: 'string',
              options: {list: ['right', 'left'], layout: 'radio', direction: 'horizontal'},
              initialValue: 'right',
            }),
          ],
          preview: {select: {title: 'heading', subtitle: 'text', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'blocks.0.heading', hidden: 'hidden'},
    prepare: ({title, hidden}) => ({title: title ?? 'Mission blocks', subtitle: `Mission blocks${hidden ? ' · hidden' : ''}`, media: ImagesIcon}),
  },
})

// ---------------------------------------------------------------- Team marquee (Company)

export const teamMarqueeSection = defineSection({
  name: 'teamMarqueeSection',
  title: 'Team marquee',
  description: 'Rows of round team photos gliding sideways (drag a row to move it).',
  icon: UsersIcon,
  groups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({name: 'text', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'rows',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'photoRow',
          type: 'object',
          fields: [defineField({name: 'photos', type: 'array', of: [defineArrayMember({type: 'altImage'})], options: {layout: 'grid'}})],
          preview: {
            select: {photos: 'photos', media: 'photos.0'},
            prepare: ({photos, media}) => ({title: `${photos?.length ?? 0} photos`, media}),
          },
        }),
      ],
    }),
  ],
})

// ---------------------------------------------------------------- Events list (Events page)

export const eventsListSection = defineSection({
  name: 'eventsListSection',
  title: 'Events list',
  description: 'Cards for every event in the Events collection, with category filters. Upcoming and past are split automatically.',
  icon: CaseIcon,
  groups,
  fields: [
    defineField({name: 'upcomingHeading', type: 'string', group: 'content', initialValue: 'Upcoming events'}),
    defineField({name: 'pastHeading', type: 'string', group: 'content', initialValue: 'Past events'}),
    defineField({
      name: 'emptyText',
      title: 'No upcoming events text',
      type: 'string',
      group: 'content',
      initialValue: 'New events are on the way. Check back soon.',
    }),
    defineField({name: 'showFilters', title: 'Show category filters', type: 'boolean', group: 'style', initialValue: true}),
  ],
  preview: {
    select: {title: 'upcomingHeading', hidden: 'hidden'},
    prepare: ({title, hidden}) => ({title: title ?? 'Events list', subtitle: `Events list${hidden ? ' · hidden' : ''}`, media: CaseIcon}),
  },
})

// ---------------------------------------------------------------- Investors (Company)

export const investorsSection = defineSection({
  name: 'investorsSection',
  title: 'Investors',
  description: 'Sticky heading on the left, a grid of people on the right.',
  icon: CaseIcon,
  groups,
  fields: [
    {...headingField(), group: 'content'},
    defineField({name: 'text', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'people',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'person',
          type: 'object',
          fields: [
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'role', type: 'string'}),
            defineField({name: 'photo', type: 'altImage'}),
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        }),
      ],
    }),
  ],
})
