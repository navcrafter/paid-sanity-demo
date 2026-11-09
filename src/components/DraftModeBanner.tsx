'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

/** Shown when previewing drafts outside the Studio, with a way back to the published site. */
export function DraftModeBanner() {
  const isPresentationTool = useIsPresentationTool()
  if (isPresentationTool !== false) return null

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 9999,
        padding: '0.625rem 1rem',
        borderRadius: '999px',
        background: '#111',
        color: '#fff',
        font: '500 0.875rem/1 system-ui, sans-serif',
        textDecoration: 'none',
        boxShadow: '0 4px 16px rgb(0 0 0 / 0.2)',
      }}
    >
      Viewing drafts · Exit preview
    </a>
  )
}
