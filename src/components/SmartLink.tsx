import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import type {ReactNode} from 'react'

export interface LinkData {
  label?: string | null
  href?: string | null
  openInNewTab?: boolean | null
}

/**
 * Renders a CMS link. Pages on this site use next/link (client-side navigation);
 * everything else is a plain <a>. The href is cleaned of visual-editing markers.
 */
export function SmartLink({
  link,
  className,
  children,
  onClick,
  ariaLabel,
}: {
  link?: LinkData | null
  className?: string
  children?: ReactNode
  onClick?: () => void
  ariaLabel?: string
}) {
  if (!link?.href) return null

  const href = stegaClean(link.href)
  const newTab = Boolean(link.openInNewTab)
  const content = children ?? link.label

  if (href.startsWith('/') && !newTab) {
    return (
      <Link href={href} className={className} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  )
}
