import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const SOCIAL_PLATFORMS = [
  {title: 'Instagram', value: 'instagram'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'TikTok', value: 'tiktok'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'X (Twitter)', value: 'x'},
] as const

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'navigation', title: 'Navigation', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'general', title: 'General'},
  ],
  fields: [
    // ---------- Navigation ----------
    defineField({
      name: 'navigation',
      type: 'object',
      group: 'navigation',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'links',
          title: 'Menu links',
          type: 'array',
          of: [defineArrayMember({type: 'link'})],
          validation: (rule) => rule.max(6),
        }),
        defineField({
          name: 'loginLabel',
          title: 'Log in button label',
          type: 'string',
          initialValue: 'Log in',
        }),
        defineField({
          name: 'loginLinks',
          title: 'Log in options',
          description: 'Shown in the dropdown under the Log in button.',
          type: 'array',
          of: [defineArrayMember({type: 'link'})],
        }),
        defineField({
          name: 'cta',
          title: 'Main button',
          description: 'The black button on the right, e.g. "Join #paid".',
          type: 'link',
        }),
      ],
    }),

    // ---------- Footer ----------
    defineField({
      name: 'footer',
      type: 'object',
      group: 'footer',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'cta',
          title: 'Call to action',
          description: 'Default heading and button. Each page can override these.',
          type: 'footerCta',
        }),
        defineField({
          name: 'columns',
          title: 'Link columns',
          type: 'array',
          validation: (rule) => rule.max(4),
          of: [
            defineArrayMember({
              name: 'linkColumn',
              type: 'object',
              fields: [
                defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'links', type: 'array', of: [defineArrayMember({type: 'link'})]}),
              ],
              preview: {
                select: {title: 'title', links: 'links'},
                prepare: ({title, links}) => ({
                  title,
                  subtitle: `${links?.length ?? 0} links`,
                }),
              },
            }),
          ],
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social links',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'socialLink',
              type: 'object',
              fields: [
                defineField({
                  name: 'platform',
                  type: 'string',
                  options: {list: [...SOCIAL_PLATFORMS]},
                  validation: (rule) => rule.required(),
                }),
                defineField({name: 'url', type: 'url', validation: (rule) => rule.required()}),
              ],
              preview: {
                select: {platform: 'platform', url: 'url'},
                prepare: ({platform, url}) => ({
                  title: SOCIAL_PLATFORMS.find((p) => p.value === platform)?.title ?? platform,
                  subtitle: url,
                }),
              },
            }),
          ],
        }),
        defineField({
          name: 'badges',
          title: 'Partner badges',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'badge',
              type: 'image',
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'string',
                  description: 'Describe the badge for screen readers, e.g. "Meta Business Partner".',
                }),
                defineField({
                  name: 'size',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Regular', value: 'regular'},
                      {title: 'Small', value: 'small'},
                      {title: 'Small, wide logo', value: 'smallWide'},
                    ],
                    layout: 'radio',
                    direction: 'horizontal',
                  },
                  initialValue: 'regular',
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: 'companyName',
          title: 'Copyright name',
          description: 'Shown as "© {current year} {name}".',
          type: 'string',
          initialValue: 'Hashtag Paid Inc.',
        }),
        defineField({
          name: 'locations',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          options: {layout: 'tags'},
        }),
      ],
    }),

    // ---------- General ----------
    defineField({
      name: 'title',
      title: 'Site name',
      type: 'string',
      group: 'general',
      initialValue: '#paid',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hubspotPortalId',
      title: 'HubSpot portal ID',
      type: 'string',
      group: 'general',
      description: 'Shared by every HubSpot form on the site. Each event only needs its own form ID.',
      initialValue: '22409077',
    }),
    defineField({name: 'seo', title: 'Default SEO', type: 'seo', group: 'general'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
