/**
 * Shown at the top of every page and event in the Studio: a clear "Preview" button.
 *
 * How publishing works here (for anyone used to Webflow's staging → publish):
 *   - Every edit is saved automatically as a DRAFT. Drafts are the staging copy; visitors never see them.
 *   - "Preview" opens the real page with the draft applied, inside the Studio.
 *   - "Publish" (bottom right) is the only thing that changes the live site.
 */
import {type ObjectInputProps, useFormValue} from 'sanity'
import {useRouter} from 'sanity/router'

import {PAGE_ROUTES, type PageId} from '../constants'
import {studioUrl} from '../env'

/** The site path a document is shown on, or null if it has no page yet. */
function usePreviewPath(): string | null {
  const type = useFormValue(['_type']) as string | undefined
  const category = useFormValue(['category']) as string | undefined
  const slug = useFormValue(['slug', 'current']) as string | undefined
  if (!type) return null
  if (type in PAGE_ROUTES) return PAGE_ROUTES[type as PageId].href
  if (type === 'event') return category && slug ? `/events/${category}/${slug}` : null
  if (type === 'testimonial') return PAGE_ROUTES.homePage.href
  return null
}

export function PreviewBanner(props: ObjectInputProps) {
  const path = usePreviewPath()
  const router = useRouter()
  const type = useFormValue(['_type']) as string | undefined
  const href = path ? `${studioUrl}/presentation?preview=${encodeURIComponent(path)}` : undefined

  return (
    <div style={{display: 'grid', gap: 24}}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid var(--card-border-color, rgba(128,128,128,0.3))',
        }}
      >
        <div style={{fontSize: 13, lineHeight: 1.45, color: 'var(--card-muted-fg-color, #8b8b8c)', maxWidth: 420}}>
          <strong style={{color: 'var(--card-fg-color, inherit)'}}>Edits save as a draft.</strong> Nothing changes on the
          live site until you press Publish.
        </div>
        {href ? (
          <a
            href={href}
            onClick={(event) => {
              // Stay inside the Studio (no full page reload) on a plain click.
              if (event.metaKey || event.ctrlKey || event.shiftKey) return
              event.preventDefault()
              router.navigateUrl({path: href})
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              background: '#f74b93',
              color: '#fdfbf7',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Preview {type === 'testimonial' ? 'on Home' : 'this page'} →
          </a>
        ) : (
          <span style={{fontSize: 13, color: 'var(--card-muted-fg-color, #8b8b8c)'}}>Add a category and slug to preview.</span>
        )}
      </div>
      {props.renderDefault(props)}
    </div>
  )
}
