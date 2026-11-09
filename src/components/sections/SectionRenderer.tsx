import {stegaClean} from 'next-sanity'
import type {ComponentType} from 'react'

import type {EditAttr} from '@/sanity/lib/edit'

import {SECTION_COMPONENTS} from './registry'

export interface SectionData {
  _key: string
  _type: string
  hidden?: boolean | null
  [field: string]: unknown
}

/**
 * Renders a page's sections in order. Hidden sections are skipped; unknown types
 * render nothing (so a new section added in the Studio can't break the page).
 */
export function SectionRenderer({sections, edit}: {sections?: SectionData[] | null; edit: EditAttr}) {
  if (!sections?.length) return null
  const visible = sections.filter((section) => !stegaClean(section.hidden))

  return (
    <>
      {visible.map((section, index) => {
        const Component = SECTION_COMPONENTS[section._type] as ComponentType<{
          data: SectionData
          edit: EditAttr
          isFirst: boolean
        }>
        if (!Component) return null
        const base = `sections[_key=="${section._key}"]`
        const scopedEdit: EditAttr = (path) => edit(path ? `${base}.${path}` : base)
        return <Component key={section._key} data={section} edit={scopedEdit} isFirst={index === 0} />
      })}
    </>
  )
}
