/**
 * Shown at the top of every page, event and testimonial in the Studio. It answers
 * "where is this right now, and what do I click next?" for the three states a document can be in:
 *
 *   1. Draft, never published   → not on the site yet.            [Preview draft]
 *   2. Published, no new edits  → live.                           [View live page] [Open in visual editor]
 *   3. Published + newer draft  → live site shows the OLD version. [Preview changes] [View live page]
 *
 * For anyone used to Webflow: the draft is the staging copy, Preview is the staging site,
 * and Publish (bottom right) is the only thing that changes the live site.
 */
import type {CSSProperties, ReactNode} from 'react'
import {type ObjectInputProps, useEditState, useFormValue} from 'sanity'
import {useRouter} from 'sanity/router'

import {PAGE_ROUTES, type PageId} from '../constants'
import {studioUrl} from '../env'

/** The site path a document is shown on, or null if it has no page yet. */
function usePagePath(type?: string): string | null {
  const category = useFormValue(['category']) as string | undefined
  const slug = useFormValue(['slug', 'current']) as string | undefined
  if (!type) return null
  if (type in PAGE_ROUTES) return PAGE_ROUTES[type as PageId].href
  if (type === 'event') return category && slug ? `/events/${category}/${slug}` : null
  if (type === 'testimonial') return PAGE_ROUTES.homePage.href
  return null
}

const TONES = {
  draft: {dot: '#f5a524', label: 'Draft'},
  live: {dot: '#3ab667', label: 'Live'},
  changes: {dot: '#f5a524', label: 'Unpublished changes'},
} as const

const buttonBase: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
}
const primaryButton: CSSProperties = {...buttonBase, background: '#f74b93', color: '#fdfbf7'}
const secondaryButton: CSSProperties = {
  ...buttonBase,
  color: 'var(--card-fg-color, inherit)',
  border: '1px solid var(--card-border-color, rgba(128,128,128,0.4))',
}

export function PreviewBanner(props: ObjectInputProps) {
  const router = useRouter()
  const type = useFormValue(['_type']) as string | undefined
  const rawId = (useFormValue(['_id']) as string | undefined) ?? ''
  const publishedId = rawId.replace(/^drafts\./, '')
  const {draft, published} = useEditState(publishedId, type ?? '')
  const path = usePagePath(type)

  const state: keyof typeof TONES = !published ? 'draft' : draft ? 'changes' : 'live'
  const where = type === 'testimonial' ? 'on Home' : ''
  const previewHref = path ? `${studioUrl}/presentation?preview=${encodeURIComponent(path)}` : undefined

  const message: Record<keyof typeof TONES, ReactNode> = {
    draft: (
      <>
        <strong>Not on the live site yet.</strong> Your edits save automatically as a draft. Preview it, adjust, then press
        Publish (bottom right) when it is ready.
      </>
    ),
    live: (
      <>
        <strong>This is live.</strong> Any edit you make starts a new draft; the live site only changes when you press
        Publish again.
      </>
    ),
    changes: (
      <>
        <strong>The live site still shows the last published version.</strong> Preview your changes, then press Publish
        (bottom right) to push them live.
      </>
    ),
  }

  const preview = previewHref && (
    <a
      key="preview"
      href={previewHref}
      onClick={(event) => {
        // Stay inside the Studio (no full page reload) on a plain click.
        if (event.metaKey || event.ctrlKey || event.shiftKey) return
        event.preventDefault()
        router.navigateUrl({path: previewHref})
      }}
      style={state === 'live' ? secondaryButton : primaryButton}
    >
      {state === 'draft' ? `Preview draft ${where}` : state === 'changes' ? `Preview changes ${where}` : 'Open in visual editor'} →
    </a>
  )
  const viewLive = path && published && (
    <a key="live" href={path} target="_blank" rel="noopener noreferrer" style={state === 'live' ? primaryButton : secondaryButton}>
      View live page ↗
    </a>
  )

  return (
    <div style={{display: 'grid', gap: 24}}>
      <div
        style={{
          display: 'grid',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 8,
          border: '1px solid var(--card-border-color, rgba(128,128,128,0.3))',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase'}}>
          <span style={{width: 8, height: 8, borderRadius: 8, background: TONES[state].dot}} />
          {TONES[state].label}
        </div>
        <div style={{fontSize: 13, lineHeight: 1.5, color: 'var(--card-muted-fg-color, #8b8b8c)'}}>{message[state]}</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {path ? (
            state === 'live' ? [viewLive, preview] : [preview, viewLive]
          ) : (
            <span style={{fontSize: 13, color: 'var(--card-muted-fg-color, #8b8b8c)'}}>Add a category and slug (Setup tab) to preview this page.</span>
          )}
        </div>
      </div>
      {props.renderDefault(props)}
    </div>
  )
}
