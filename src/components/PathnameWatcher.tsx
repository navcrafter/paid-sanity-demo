'use client'

import {usePathname} from 'next/navigation'
import {Suspense, useEffect} from 'react'

function Watcher({onChange}: {onChange: (pathname: string) => void}) {
  const pathname = usePathname()
  useEffect(() => onChange(pathname), [pathname, onChange])
  return null
}

/**
 * Reports the current path after each navigation, for effects that re-run on a new page.
 *
 * Next.js 16 (Cache Components) won't prerender a route whose URL is unknown in advance,
 * such as /events/[category]/[slug] after a publish expires the cache, while a component
 * outside <Suspense> reads it. Reading it here, inside its own boundary, keeps the navbar
 * and page in the static shell. Pass a stable callback, e.g. a useState setter.
 */
export function PathnameWatcher({onChange}: {onChange: (pathname: string) => void}) {
  return (
    <Suspense fallback={null}>
      <Watcher onChange={onChange} />
    </Suspense>
  )
}
