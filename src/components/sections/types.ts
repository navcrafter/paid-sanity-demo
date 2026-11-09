import type {EditAttr} from '@/sanity/lib/edit'
import type {FetchOptions} from '@/sanity/lib/live'

/** Every section component receives its data plus a click-to-edit helper scoped to it. */
export interface SectionProps<T> {
  data: T
  /** Builds a data-sanity attribute for a field path inside this section, e.g. edit('image'). */
  edit: EditAttr
  /** True for the first section on the page (load its media eagerly). */
  isFirst: boolean
  /** Draft/published fetch options, for sections that load their own data (e.g. Events list). */
  options: FetchOptions
}
