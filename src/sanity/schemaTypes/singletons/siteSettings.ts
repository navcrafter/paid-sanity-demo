import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site name',
      type: 'string',
      initialValue: '#paid',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hubspotPortalId',
      title: 'HubSpot portal ID',
      type: 'string',
      description: 'Shared by every HubSpot form on the site. Each event only needs its own form ID.',
      initialValue: '22409077',
    }),
    defineField({name: 'seo', title: 'Default SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
