import {stegaClean} from 'next-sanity'
import type {CSSProperties, ElementType} from 'react'

/**
 * Splits CMS text so the visual-editing marker (invisible characters appended to
 * the string in draft mode) stays on the outer element, not inside a word.
 */
export function splitStega(text: string) {
  const clean = stegaClean(text)
  const encoded = text.startsWith(clean) ? text.slice(clean.length) : ''
  return {clean, encoded}
}

/**
 * Heading whose words fade in one after another when it scrolls into view
 * (the live site's data-word-reveal). Line breaks in the CMS text become <br>.
 * Rendered server-side; ScrollEffects adds data-revealed when it's on screen.
 */
export function WordReveal({
  as: Tag = 'h2',
  text,
  className,
  delay = 200,
  id,
}: {
  as?: ElementType
  text?: string | null
  className?: string
  delay?: number
  id?: string
}) {
  if (!text) return null
  const {clean, encoded} = splitStega(text)

  let index = 0
  const lines = clean.split('\n')

  return (
    <Tag
      id={id}
      className={className}
      data-word-reveal=""
      suppressHydrationWarning
      style={{'--reveal-delay': `${delay}ms`} as CSSProperties}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(/(\s+)/).map((part, partIndex) => {
            if (!part) return null
            if (!part.trim()) return ' '
            const i = index++
            return (
              <span key={partIndex} className="t-word">
                <span style={{'--i': i} as CSSProperties}>{part}</span>
              </span>
            )
          })}
        </span>
      ))}
      {encoded}
    </Tag>
  )
}

/** Plain multi-line text: CMS line breaks become <br>. */
export function MultilineText({text}: {text?: string | null}) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  )
}
