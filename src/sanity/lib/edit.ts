import {createDataAttribute} from 'next-sanity'

import {dataset, projectId, studioUrl} from '../env'

/**
 * Click-to-edit targets for the Presentation tool.
 * Text gets these automatically (stega); images, videos and list items need a
 * data-sanity attribute pointing at their field. Only emitted in draft mode.
 */
export type EditAttr = (path: string) => string | undefined

export function editAttrFor(doc: {_id: string; _type: string} | null | undefined, enabled: boolean): EditAttr {
  if (!enabled || !doc) return () => undefined
  const attr = createDataAttribute({id: doc._id, type: doc._type, baseUrl: studioUrl, projectId, dataset})
  return (path) => attr(path)
}
