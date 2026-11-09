import {DocumentIcon} from '@sanity/icons/Document'
import {HomeIcon} from '@sanity/icons/Home'
import {UsersIcon} from '@sanity/icons/Users'
import {defineField, defineType} from 'sanity'

// Phase 1 shells for the three static pages. Each page gets its ordered list of
// design sections (hero, galleries, tabs, testimonials, FAQ...) in phase 3.

function definePage(name: string, title: string, icon: typeof DocumentIcon) {
  return defineType({
    name,
    title,
    type: 'document',
    icon,
    fields: [
      defineField({
        name: 'title',
        title: 'Internal title',
        type: 'string',
        initialValue: title,
        readOnly: true,
      }),
      defineField({
        name: 'footerCta',
        title: 'Footer call to action',
        description: 'Optional. Leave empty to use the default from Site settings.',
        type: 'footerCta',
      }),
      defineField({name: 'seo', title: 'SEO', type: 'seo'}),
    ],
    preview: {prepare: () => ({title})},
  })
}

export const homePage = definePage('homePage', 'Home', HomeIcon)
export const creatorsPage = definePage('creatorsPage', 'Creators', UsersIcon)
export const companyPage = definePage('companyPage', 'Company', DocumentIcon)
