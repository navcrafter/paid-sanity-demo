'use client'

import {useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react'

/**
 * Testimonial carousel (ported from the live Home slider takeover):
 * the front card is pink, neighbours are burgundy and scaled down; the active dot
 * fills up and then moves on. Pauses on hover and off screen; drag/swipe or click a
 * side card to move.
 */
const SCALE = 0.9

export function TestimonialCarousel({slides, autoplaySeconds}: {slides: {key: string; content: ReactNode; editAttr?: string}[]; autoplaySeconds: number}) {
  const n = slides.length
  const rootRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [jumping, setJumping] = useState<Record<number, number>>({})
  const [hovered, setHovered] = useState(false)
  const [onScreen, setOnScreen] = useState(true)
  const [dragging, setDragging] = useState(false)
  const lastD = useRef<number[]>([])

  const offset = (k: number, a: number) => {
    let d = (k - a) % n
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  const go = (k: number) => {
    const next = ((k % n) + n) % n
    // Slides that come round the back start just off-screen instead of flying across
    const jumps: Record<number, number> = {}
    for (let i = 0; i < n; i++) {
      const before = lastD.current[i]
      const after = offset(i, next)
      if (before !== undefined && Math.abs(after - before) > 1) jumps[i] = after > 0 ? after + 1 : after - 1
    }
    setJumping(jumps)
    setActive(next)
  }

  // After a jump frame has painted, let those slides transition to their real spot
  useEffect(() => {
    if (!Object.keys(jumping).length) return
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setJumping({})))
    return () => cancelAnimationFrame(frame)
  }, [jumping])

  // Latest values for the pointer handlers (attached once)
  const activeRef = useRef(active)
  const goRef = useRef(go)
  useEffect(() => {
    lastD.current = slides.map((_, k) => offset(k, active))
    activeRef.current = active
    goRef.current = go
  })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {rootMargin: '0px 0px -15% 0px'})
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // Drag or swipe; a click on a side quote brings it forward
  useEffect(() => {
    const mask = maskRef.current
    if (!mask) return
    let press: {x: number; y: number; dx: number; moved: boolean} | null = null
    const onDown = (e: PointerEvent) => {
      if (e.button === 0) press = {x: e.clientX, y: e.clientY, dx: 0, moved: false}
    }
    const onMove = (e: PointerEvent) => {
      if (!press) return
      press.dx = e.clientX - press.x
      if (!press.moved) {
        if (Math.abs(press.dx) < 6) return
        if (Math.abs(press.dx) < Math.abs(e.clientY - press.y)) {
          press = null
          return
        }
        press.moved = true
        setDragging(true)
      }
      mask.style.setProperty('--drag', `${press.dx * 0.85}px`)
    }
    const onUp = (e: PointerEvent) => {
      if (!press) return
      const p = press
      press = null
      if (!p.moved) {
        const slide = (e.target as HTMLElement).closest?.('[data-slide-index]')
        const k = slide ? Number(slide.getAttribute('data-slide-index')) : -1
        if (k > -1 && k !== activeRef.current) goRef.current(k)
        return
      }
      setDragging(false)
      mask.style.setProperty('--drag', '0px')
      const width = mask.querySelector<HTMLElement>('.testimonial-carousel_slide')?.offsetWidth ?? 400
      if (Math.abs(p.dx) > Math.min(80, width * 0.2)) goRef.current(activeRef.current + (p.dx < 0 ? 1 : -1))
    }
    mask.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, {passive: true})
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      mask.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [n])

  if (!n) return null
  const paused = hovered || !onScreen

  return (
    <div
      ref={rootRef}
      className={`testimonial-carousel${paused ? ' is-paused' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{'--autoplay': `${autoplaySeconds}s`} as CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div ref={maskRef} className="testimonial-carousel_mask">
        {slides.map((slide, k) => {
          const d = jumping[k] ?? offset(k, active)
          const a = Math.abs(offset(k, active))
          return (
            <div
              key={slide.key}
              className={`testimonial-carousel_slide${k in jumping ? ' is-jump' : ''}`}
              data-slide-index={k}
              aria-hidden={offset(k, active) !== 0}
              data-sanity={slide.editAttr}
              style={
                {
                  '--d': d,
                  '--s': k in jumping || a ? SCALE : 1,
                  '--z': n - a,
                  '--o': a <= 1 ? 1 : 0,
                } as CSSProperties
              }
            >
              {slide.content}
            </div>
          )
        })}
      </div>
      <div className="testimonial-carousel_nav">
        {slides.map((slide, k) => (
          <button
            // Re-mounting the active dot restarts its fill
            key={k === active ? `active-${active}` : slide.key}
            type="button"
            className={`testimonial-carousel_dot${k === active ? ' is-active' : ''}`}
            aria-label={`Show ${k + 1} of ${n}`}
            aria-current={k === active}
            onClick={() => go(k)}
            onAnimationEnd={() => k === active && go(active + 1)}
          />
        ))}
      </div>
    </div>
  )
}
