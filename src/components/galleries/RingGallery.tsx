'use client'

import {useEffect, useRef, useState} from 'react'

import {Media, type MediaValue} from '../media/Media'

/**
 * Spin ring: tall cards turning in a 3D ring (ported from the live Creators hero).
 * The ring is filled to 10 cards, drifts slowly, arrives with a fast spin, and can be
 * dragged or flicked. Only cards near the front run their video player.
 */
const RING = 10
const SPEED = 5.6
const SPACING = 0.3
const DELAY = 450

export function RingGallery({items, editAttrs}: {items: MediaValue[]; editAttrs?: Record<string, string | undefined>}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const count = items.length ? Math.max(RING, items.length) : 0
  const cards = Array.from({length: count}, (_, i) => ({item: items[i % items.length], copy: i >= items.length}))
  const [live, setLive] = useState<boolean[]>(() => cards.map(() => false))

  useEffect(() => {
    const stage = stageRef.current
    const els = cardRefs.current.slice(0, count).filter(Boolean) as HTMLDivElement[]
    if (!stage || !els.length) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const n = els.length
    const step = 360 / n
    let angle = 0
    let intro = reduce ? 0 : 140
    let radius = 0
    let cut = 0
    let onScreen = true
    const liveState = els.map(() => false)

    const fadeOf = (facing: number) => Math.max(0, Math.min(1, (facing - cut - 0.02) / 0.28))

    // Ring size: as wide as the stage allows inside its side padding
    function measure() {
      const width = els[0].offsetWidth || 1
      const cs = getComputedStyle(stage!)
      const eye = parseFloat(cs.perspective) || width * 7
      const close = (width * (1 + SPACING)) / 2 / Math.tan(Math.PI / n)
      radius = close
      cut = radius / (eye + radius)
      const room = (stage!.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / 2
      let showing = Math.acos(Math.min(0.99, cut + 0.16))
      const reach = (R: number) => {
        let most = 0
        for (let a = 0; a <= showing; a += 0.02) {
          const c = Math.cos(a)
          const s = Math.sin(a)
          most = Math.max(most, ((R * s + (width / 2) * c) * eye) / (eye + R * (1 - c) + (width / 2) * s))
        }
        return most
      }
      for (let round = 0; round < 4; round++) {
        let lo = width / 2
        let hi = width * 30
        for (let j = 0; j < 32; j++) {
          const mid = (lo + hi) / 2
          if (reach(mid) < room) lo = mid
          else hi = mid
        }
        radius = Math.max(close, lo)
        cut = radius / (eye + radius)
        showing = Math.acos(Math.min(0.99, cut + 0.16))
      }
    }

    const shown = els.map(() => -1)
    const layer = els.map(() => -1)
    function place() {
      const base = angle + intro
      let changed = false
      for (let i = 0; i < n; i++) {
        const card = els[i]
        const a = ((((i * step + base) % 360) + 540) % 360) - 180
        const facing = Math.cos((a * Math.PI) / 180)
        const o = Math.round(fadeOf(facing) * 100) / 100
        if (o !== shown[i]) {
          shown[i] = o
          card.style.opacity = String(o)
          card.style.visibility = o > 0 ? '' : 'hidden'
        }
        if (o > 0) {
          card.style.transform = `translate3d(0,0,${(-radius).toFixed(1)}px) rotateY(${a.toFixed(2)}deg) translate3d(0,0,${radius.toFixed(1)}px)`
        }
        const z = Math.round((facing + 1) * 50)
        if (z !== layer[i]) {
          layer[i] = z
          card.style.zIndex = String(z)
        }
        // Player on near the front, off well round the back
        const at = Math.abs(((((i * step + angle) % 360) + 540) % 360) - 180)
        const next = !onScreen || at > 110 ? false : at < 85 ? true : liveState[i]
        if (next !== liveState[i]) {
          liveState[i] = next
          changed = true
        }
      }
      if (changed) setLive([...liveState])
    }

    measure()
    place()
    const onResize = () => {
      measure()
      place()
    }
    window.addEventListener('resize', onResize)

    // Fade and rise in while the ring arrives turning fast
    const start = performance.now() + DELAY
    stage.animate([{opacity: 0, transform: 'translateY(24px)'}, {opacity: 1, transform: 'none'}], {
      duration: reduce ? 0 : 1000,
      delay: reduce ? 0 : DELAY,
      easing: 'cubic-bezier(.2,.7,.2,1)',
      fill: 'both',
    })

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        place()
      },
      {rootMargin: '100px'},
    )
    io.observe(stage)

    let fling = 0
    let held = false
    let last = performance.now()
    let frame = 0
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const frames = Math.min(now - last, 100) / (1000 / 60)
      last = now
      if (!onScreen || held) return
      const t = Math.min(1, Math.max(0, (now - start) / 2400))
      intro = 140 * Math.pow(1 - t, 3)
      angle += (-SPEED / 60) * frames + fling * frames
      fling *= Math.pow(0.94, frames)
      if (Math.abs(fling) < 0.005) fling = 0
      place()
    }
    if (!reduce) frame = requestAnimationFrame(tick)

    // Drag or swipe to spin; let go to throw it
    const perPx = () => 180 / (Math.PI * radius)
    let press: {id: number; x: number; y: number; from: number; lastX: number; lastT: number; v: number; dragging: boolean; touch: boolean} | null = null
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || reduce) return
      press = {id: e.pointerId, x: e.clientX, y: e.clientY, from: angle, lastX: e.clientX, lastT: performance.now(), v: 0, dragging: false, touch: e.pointerType !== 'mouse'}
    }
    const onMove = (e: PointerEvent) => {
      if (!press || e.pointerId !== press.id) return
      const dx = e.clientX - press.x
      if (!press.dragging) {
        const slop = press.touch ? 10 : 5
        if (Math.abs(dx) < slop && Math.abs(e.clientY - press.y) < slop) return
        if (Math.abs(dx) < Math.abs(e.clientY - press.y)) {
          press = null // scrolling the page
          return
        }
        press.dragging = true
        held = true
        fling = 0
        stage.classList.add('is-dragging')
      }
      angle = press.from + dx * perPx()
      const now = performance.now()
      const dt = now - press.lastT
      if (dt > 0) {
        press.v = ((e.clientX - press.lastX) * perPx()) / (dt / (1000 / 60))
        press.lastX = e.clientX
        press.lastT = now
      }
      place()
    }
    const release = (e: PointerEvent) => {
      if (!press || e.pointerId !== press.id) return
      if (press.dragging) {
        fling = Math.max(-8, Math.min(8, press.v))
        stage.classList.remove('is-dragging')
      }
      held = false
      press = null
    }
    stage.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, {passive: true})
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      stage.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [count])

  return (
    <div ref={stageRef} className="ring_component">
      {cards.map(({item, copy}, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el
          }}
          className="ring_card"
          aria-hidden={copy || undefined}
          data-sanity={copy ? undefined : (item._key ? editAttrs?.[item._key] : undefined)}
        >
          <Media
            media={copy ? {...item, image: item.image ? {...item.image, alt: ''} : item.image} : item}
            imageClassName="ring_image"
            videoClassName="ring_video"
            sizes="(max-width: 767px) 13rem, 28rem"
            active={live[i] ?? false}
          />
        </div>
      ))}
    </div>
  )
}
