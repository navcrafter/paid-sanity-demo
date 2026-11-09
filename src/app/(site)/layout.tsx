import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'

import {DraftModeBanner} from '@/components/DraftModeBanner'
import {SanityLive} from '@/sanity/lib/live'

// Layout for every public page (everything except /studio).
// Navbar and footer arrive in phase 2.

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <>
      {children}
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode && (
        <>
          <VisualEditing />
          <DraftModeBanner />
        </>
      )}
    </>
  )
}
