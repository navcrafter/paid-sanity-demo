'use client'

import {useEffect, useRef, type CSSProperties} from 'react'

import {Media, type MediaValue} from '../media/Media'

/**
 * Hero orbit: cards drift right to left through 3D on a CSS animation (see
 * galleries.css); dragging shifts every card's animation time (180px = one card).
 */
export function OrbitGallery({items, editAttrs}: {items: MediaValue[]; editAttrs?: Record<string, string | undefined>}) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof stage.getAnimations !== 'function') return
    const animations = stage
      .getAnimations({subtree: true})
      .filter((a) => (a as CSSAnimation).animationName === 'orbit')
    if (!animations.length) return

    const lap = Number(animations[0].effect?.getTiming().duration) || 40000
    const msPerPx = lap / animations.length / 180
    const shift = (ms: number) => animations.forEach((a) => (a.currentTime = Number(a.currentTime ?? 0) + ms))
    shift(lap * 1000) // head start so dragging back never runs out

    let lastX: number | null = null
    const onDown = (e: PointerEvent) => {
      lastX = e.clientX
      stage.classList.add('is-dragging')
      stage.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (lastX === null) return
      shift((lastX - e.clientX) * msPerPx)
      lastX = e.clientX
    }
    const stop = () => {
      lastX = null
      stage.classList.remove('is-dragging')
    }
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', stop)
    stage.addEventListener('pointercancel', stop)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', stop)
      stage.removeEventListener('pointercancel', stop)
    }
  }, [items.length])

  return (
    <div ref={stageRef} className="orbit_component">
      {items.map((item, i) => (
        <div
          key={item._key ?? i}
          className="orbit_card"
          style={{animationDelay: `calc(var(--orbit-time) * ${-i} / ${items.length})`} as CSSProperties}
          data-sanity={(item._key ? editAttrs?.[item._key] : undefined)}
        >
          <Media media={item} imageClassName="orbit_image" videoClassName="orbit_video" sizes="(max-width: 767px) 16rem, 27rem" priority={i < 3} />
        </div>
      ))}
    </div>
  )
}
