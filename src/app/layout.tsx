import type {Metadata} from 'next'

import {fontVariables} from '@/fonts'

// Site styles are imported by app/(site)/layout.tsx, not here, so they never
// load into the embedded Studio at /studio.

export const metadata: Metadata = {
  title: {default: '#paid', template: '%s | #paid'},
  // Demo build: keep it out of search results so it never competes with hashtagpaid.com.
  robots: {index: false, follow: false},
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
