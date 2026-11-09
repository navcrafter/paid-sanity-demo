import {draftMode} from 'next/headers'
import {Suspense, type ReactNode} from 'react'

import {getDraftFetchOptions, PUBLISHED, type FetchOptions} from './live'

type Render = (options: FetchOptions) => Promise<ReactNode> | ReactNode

/**
 * Renders published content from the cache for visitors, and switches to a
 * dynamic, draft-aware render (inside Suspense) when draft mode is on.
 *
 * Usage in a page:
 *   <WithFetchOptions render={(options) => <HomeContent options={options} />} />
 */
export async function WithFetchOptions({render}: {render: Render}) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) return render(PUBLISHED)

  return (
    <Suspense fallback={null}>
      <DraftRender render={render} />
    </Suspense>
  )
}

async function DraftRender({render}: {render: Render}) {
  const options = await getDraftFetchOptions()
  return render(options)
}
