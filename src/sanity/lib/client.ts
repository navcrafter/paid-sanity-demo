import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Stega encodes edit links into strings while in draft mode, which powers
  // click-to-edit overlays in the Presentation tool. Off on the public site.
  stega: {studioUrl},
})
