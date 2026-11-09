'use client'

import {useEffect, useState, type ReactNode} from 'react'

/** Event testimonials: one quote at a time, sliding every 4s, with arrows (pauses on hover). */
export function EventTestimonials({slides}: {slides: {key: string; content: ReactNode}[]}) {
  const n = slides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (n < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % n), 4000)
    return () => window.clearTimeout(timer)
  }, [index, n, paused])

  if (!n) return null
  const go = (step: number) => setIndex((i) => (i + step + n) % n)

  return (
    <div className="event-quotes" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="event-quotes_mask">
        <div className="event-quotes_track" style={{transform: `translateX(${-index * 100}%)`}}>
          {slides.map((slide, i) => (
            <div key={slide.key} className="event-quotes_slide" aria-hidden={i !== index}>
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      {n > 1 && (
        <>
          <button type="button" className="event-quotes_arrow is-left" aria-label="Previous testimonial" onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="event-quotes_arrow is-right" aria-label="Next testimonial" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
