import {DocumentIcon} from '@sanity/icons/Document'
import {HomeIcon} from '@sanity/icons/Home'
import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {sectionTypes} from '../sections'

// Home, Creators and Company: an ordered list of design sections. Any section type
// can be used on any page; sections can be reordered, duplicated or hidden.

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
        hidden: true,
      }),
      defineField({
        name: 'sections',
        title: 'Page sections',
        description: 'Drag to reorder. Use "Hide this section" inside a section to take it off the page without deleting it.',
        type: 'array',
        of: sectionTypes.map((section) => defineArrayMember({type: section.name})),
        options: {insertMenu: {views: [{name: 'list'}]}},
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
