import {stegaClean} from 'next-sanity'

/**
 * Renders an icon stored as SVG code in the CMS, inline so it can follow the
 * text colour (currentColor). Scripts and event handlers are stripped.
 */
export function InlineSvg({svg, className}: {svg?: string | null; className?: string}) {
  const code = stegaClean(svg)?.trim()
  if (!code || !code.startsWith('<svg')) return null
  const safe = code
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{__html: safe}} />
}
