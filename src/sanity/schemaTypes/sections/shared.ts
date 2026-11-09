import {defineField} from 'sanity'

/** The scroll colour switch: themed sections share one background that flips as you scroll. */
export const colorSchemeField = defineField({
  name: 'colorScheme',
  title: 'Scroll colour switch',
  description:
    'When this section reaches the screen, every section with a colour switch turns this colour (as on the live Home page).',
  type: 'string',
  group: 'style',
  options: {
    list: [
      {title: 'Off', value: 'none'},
      {title: 'Dark', value: 'dark'},
      {title: 'Light', value: 'light'},
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'none',
})

/** Icon pasted as SVG code, so it can follow the text colour. */
export const iconSvgField = (group?: string) =>
  defineField({
    name: 'iconSvg',
    title: 'Icon (SVG code)',
    description: 'Paste SVG markup. Use stroke="currentColor"/fill="currentColor" so it follows the text colour.',
    type: 'text',
    rows: 3,
    group,
  })
