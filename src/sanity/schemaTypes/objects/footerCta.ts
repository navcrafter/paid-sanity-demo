import {defineField, defineType} from 'sanity'

/** The heading + button at the top of the footer ("Don't start from zero" / "Get started"). */
export const footerCta = defineType({
  name: 'footerCta',
  title: 'Footer call to action',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'button', type: 'link'}),
  ],
})
