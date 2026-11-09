'use client'

import {useEffect, useRef, type ElementType} from 'react'

import {splitStega} from './WordReveal'

/**
 * "Scrub words": words light up one at a time as the heading moves up the screen
 * (ported from the live Home statement). Scroll sets how many words should be lit;
 * a 120ms step paces them so they never land together.
 */
const START = 0.9
const END = 0.35
const STEP_MS = 120

export function ScrubText({as: Tag = 'h2', text, className}: {as?: ElementType; text?: string | null; className?: string}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = Array.from(el.querySelectorAll<HTMLElement>('.s-word'))
    if (!words.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => w.setAttribute('data-lit', ''))
      return
    }

    let lit = 0
    let target = 0
    let ticking = false
    let timer = 0

    const step = () => {
      if (lit < target) words[lit++].setAttribute('data-lit', '')
      else if (lit > target) words[--lit].removeAttribute('data-lit')
      timer = lit !== target ? window.setTimeout(step, STEP_MS) : 0
    }
    const update = () => {
      ticking = false
      const vh = window.innerHeight
      const rect = el.getBoundingClientRect()
      const progress = (START * vh - rect.top) / ((START - END) * vh + rect.height)
      target = Math.floor(Math.max(0, Math.min(1, progress)) * words.length)
      if (!timer) step()
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(timer)
    }
  }, [text])

  if (!text) return null
  const {clean, encoded} = splitStega(text)

  return (
    <Tag ref={ref} className={className} data-word-scrub="" suppressHydrationWarning>
      {clean.split('\n').map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(/(\s+)/).map((part, i) =>
            !part ? null : part.trim() ? (
              <span key={i} className="s-word">
                {part}
              </span>
            ) : (
              ' '
            ),
          )}
        </span>
      ))}
      {encoded}
    </Tag>
  )
}
