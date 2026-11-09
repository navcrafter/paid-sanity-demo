'use client'

import {Children, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react'

/**
 * Endless sideways ticker (ported from the live "Creator reviews ticker" and
 * "Team marquee"): fills the row so it loops seamlessly, starts centred, glides at
 * `speed` px/s and can be dragged — a flick keeps it moving, then it eases back.
 */
export function Ticker({
  children,
  speed = 30,
  reverse = false,
  className = '',
  itemClassName = '',
}: {
  children: ReactNode
  speed?: number
  reverse?: boolean
  className?: string
  itemClassName?: string
}) {
  const items = Children.toArray(children)
  const viewRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [sets, setSets] = useState(2)
  const [timing, setTiming] = useState<{time: number; start: number} | null>(null)

  // Enough copies to fill the screen, then the same again for the loop
  useLayoutEffect(() => {
    const view = viewRef.current
    const track = trackRef.current
    if (!view || !track || !items.length) return
    const oneSet = track.scrollWidth / sets
    const copies = Math.max(1, Math.ceil(view.clientWidth / Math.max(oneSet, 1)))
    if (copies * 2 !== sets) {
      setSets(copies * 2)
      return
    }
    const half = track.scrollWidth / 2
    const time = half / speed
    setTiming({time, start: -(Math.max(0, (half - view.clientWidth) / 2) / speed)})
  }, [sets, items.length, speed])

  // Drag and flick: shift the animation by the distance moved
  useEffect(() => {
    const track = trackRef.current
    if (!track || !timing) return
    const anim = () => track.getAnimations()[0]
    const shift = (px: number) => {
      const a = anim()
      if (a) a.currentTime = Number(a.currentTime ?? 0) + ((reverse ? -px : px) * 1000) / speed
    }
    let press: {x: number; lastX: number; lastT: number; dragging: boolean} | null = null
    let vel = 0
    const onDown = (e: PointerEvent) => {
      const a = anim()
      if (e.button !== 0 || !a) return
      if (Number(a.currentTime ?? 0) < timing.time * 1000 * 10) a.currentTime = Number(a.currentTime ?? 0) + timing.time * 1000 * 100
      press = {x: e.clientX, lastX: e.clientX, lastT: e.timeStamp, dragging: false}
      vel = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!press) return
      if (!press.dragging) {
        if (Math.abs(e.clientX - press.x) < 6) return
        press.dragging = true
        track.classList.add('is-dragging')
      }
      const dx = e.clientX - press.lastX
      shift(-dx)
      vel = 0.6 * vel + (0.4 * dx) / Math.max(e.timeStamp - press.lastT, 1)
      press.lastX = e.clientX
      press.lastT = e.timeStamp
    }
    const onUp = (e: PointerEvent) => {
      if (!press) return
      const dragged = press.dragging
      if (e.timeStamp - press.lastT > 90) vel = 0
      press = null
      if (!dragged) return
      const glide = () => {
        if (press) return
        if (Math.abs(vel) > 0.02) {
          shift(-vel * 16)
          vel *= 0.94
          requestAnimationFrame(glide)
        } else {
          track.classList.remove('is-dragging')
        }
      }
      glide()
    }
    track.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      track.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [timing, speed, reverse])

  return (
    <div ref={viewRef} className="ticker_viewport">
      <div
        ref={trackRef}
        className={`ticker_track${reverse ? ' is-reverse' : ''}${timing ? ' is-ready' : ''} ${className}`.trim()}
        style={timing ? ({'--ticker-time': `${timing.time}s`, '--ticker-start': `${timing.start}s`} as CSSProperties) : undefined}
      >
        {Array.from({length: sets}, (_, s) =>
          items.map((item, i) => (
            <div key={`${s}-${i}`} className={itemClassName} aria-hidden={s > 0 || undefined}>
              {item}
            </div>
          )),
        )}
      </div>
    </div>
  )
}
