import {defineField, defineType, type FieldDefinition, type PreviewConfig} from 'sanity'

/**
 * Wraps a page section type: adds the shared "Hide this section" switch and a
 * consistent preview (section name + first heading).
 */
export function defineSection({
  name,
  title,
  description,
  icon,
  fields,
  preview,
  groups,
}: {
  name: string
  title: string
  description?: string
  icon?: React.ComponentType
  fields: FieldDefinition[]
  preview?: PreviewConfig
  groups?: {name: string; title: string; default?: boolean}[]
}) {
  return defineType({
    name,
    title,
    description,
    type: 'object',
    icon,
    groups,
    fields: [
      ...fields,
      defineField({
        name: 'hidden',
        title: 'Hide this section',
        description: 'Hidden sections stay in the Studio but are not shown on the site.',
        type: 'boolean',
        initialValue: false,
      }),
    ],
    preview: preview ?? {
      select: {heading: 'heading', hidden: 'hidden'},
      prepare: ({heading, hidden}: {heading?: string; hidden?: boolean}) => ({
        title: heading ? heading.replace(/\n/g, ' ') : title,
        subtitle: `${title}${hidden ? ' · hidden' : ''}`,
        media: icon,
      }),
    },
  })
}

/** Plain-text field whose line breaks are kept (used for big headings). */
export const headingField = (overrides: Partial<{name: string; title: string; description: string}> = {}) =>
  defineField({
    name: overrides.name ?? 'heading',
    title: overrides.title ?? 'Heading',
    type: 'text',
    rows: 2,
    description: overrides.description ?? 'Press Enter for a line break.',
  })
