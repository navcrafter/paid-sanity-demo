'use client'

import {useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react'

/**
 * Case studies (ported from the live Home): a fanned hand of cards on desktop that
 * deals out from a stack the first time it scrolls into view; on phones, equal cards
 * side by side with neighbours peeking in, moved by swipe, tap or arrows.
 */
const SPOTS = [
  {x: 0, z: 3},
  {x: 106.8, z: 2},
  {x: 213.6, z: 1},
]

export function CaseStudies({cards}: {cards: {key: string; content: ReactNode; editAttr?: string}[]}) {
  const n = cards.length
  const sliderRef = useRef<HTMLDivElement>(null)
  const [dealt, setDealt] = useState(false)
  const [settled, setSettled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [active, setActive] = useState(0)
  const [arriving, setArriving] = useState<Set<number>>(new Set())
  const lastD = useRef<number[]>([])

  const wrap = (d: number) => {
    d = ((d % n) + n) % n
    return d > n / 2 ? d - n : d
  }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  // Desktop: deal the cards out the first time the fan is 78% up the screen
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        setDealt(true)
        timer = window.setTimeout(() => setSettled(true), 1500)
      },
      {rootMargin: '0px 0px -22% 0px'},
    )
    io.observe(slider)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  const go = (index: number) => {
    const step = wrap(index - active)
    if (!mobile || !step) return
    const next = ((index % n) + n) % n
    // Cards that wrap round fade in instead of flying across
    const jumped = new Set<number>()
    cards.forEach((_, i) => {
      if (wrap(i - next) !== lastD.current[i] - step) jumped.add(i)
    })
    setArriving(jumped)
    setActive(next)
  }

  useEffect(() => {
    lastD.current = cards.map((_, i) => wrap(i - active))
  })

  // Swipe (phones only)
  const startX = useRef<number | null>(null)
  const swiped = useRef(false)

  return (
    <div className="case-studies_component" onKeyDown={(e) => {
      if (e.key === 'ArrowRight') go(active + 1)
      if (e.key === 'ArrowLeft') go(active - 1)
    }}>
      <div
        ref={sliderRef}
        className={`case-studies_slider${dealt ? ' is-dealt' : ''}${settled ? ' is-settled' : ''}`}
        onPointerDown={(e) => {
          startX.current = e.clientX
          swiped.current = false
        }}
        onPointerUp={(e) => {
          const dx = startX.current === null ? 0 : e.clientX - startX.current
          startX.current = null
          if (mobile && Math.abs(dx) > 40) {
            swiped.current = true
            go(active + (dx < 0 ? 1 : -1))
          }
        }}
      >
        {cards.map((card, i) => {
          const d = wrap(i - active)
          const spot = SPOTS[Math.min(Math.abs(d), SPOTS.length - 1)]
          return (
            <div
              key={card.key}
              className={`case-studies_item${d === 0 ? ' is-active' : ''}${arriving.has(i) ? ' is-arriving' : ''}`}
              style={{'--x': `${d < 0 ? -spot.x : spot.x}%`, '--z': spot.z} as CSSProperties}
              aria-hidden={mobile ? d !== 0 : undefined}
              data-sanity={card.editAttr}
              onClickCapture={(e) => {
                if (!mobile) return
                if (swiped.current) {
                  e.preventDefault()
                  swiped.current = false
                  return
                }
                if (i !== active) {
                  e.preventDefault()
                  go(i)
                }
              }}
            >
              {card.content}
            </div>
          )
        })}
      </div>
      <div className="case-studies_nav">
        <button type="button" className="case-studies_nav-button" aria-label="Previous case study" onClick={() => go(active - 1)}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
            <path d="M50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50C38.8071 50 50 38.8071 50 25Z" fill="#F4F3F1" />
            <path d="M27.8343 19.3311L22.1658 24.9995L27.8343 30.668" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#060606" />
          </svg>
        </button>
        <button type="button" className="case-studies_nav-button" aria-label="Next case study" onClick={() => go(active + 1)}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
            <path d="M0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25Z" fill="#F4F3F1" />
            <path d="M22.1658 19.3311L27.8342 24.9995L22.1658 30.668" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#060606" />
          </svg>
        </button>
      </div>
    </div>
  )
}
