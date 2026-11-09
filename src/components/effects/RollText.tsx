import {stegaClean} from 'next-sanity'
import type {CSSProperties} from 'react'

import {splitStega} from './WordReveal'

/**
 * Letter "roll" on hover (the live site's data-hover="roll"): each letter is doubled
 * and slides up one line, staggered, when the parent link is hovered.
 * Words stay intact so long titles still wrap. Screen readers get the plain text.
 */
export function RollText({text, className = 'roll'}: {text?: string | null; className?: string}) {
  if (!text) return null
  const {clean, encoded} = splitStega(text)
  let i = 0

  return (
    <>
      <span className="sr-only">{stegaClean(clean)}</span>
      {clean.split(/(\s+)/).map((word, wordIndex) =>
        word.trim() ? (
          <span key={wordIndex} className={className} aria-hidden="true">
            {Array.from(word).map((char, charIndex) => (
              <span key={charIndex} style={{'--i': i++} as CSSProperties}>
                <span>{char}</span>
                <span>{char}</span>
              </span>
            ))}
          </span>
        ) : (
          word && ' '
        ),
      )}
      {encoded}
    </>
  )
}
