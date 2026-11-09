'use client'

import {stegaClean} from 'next-sanity'
import {useEffect, useRef, type CSSProperties} from 'react'

import {Media, type MediaValue} from '../media/Media'

/**
 * Full-bleed row of photo/video columns that drifts left forever (~40px/s), with
 * per-column parallax while scrolling and a staggered entrance. Pauses on hover.
 *
 * Editors add a flat list of images and videos; columns are built automatically,
 * matching the live layout: a single tall photo, or two videos stacked, with the
 * columns stepped down by alternating amounts.
 */
type Column = {key: string; items: MediaValue[]; offset: 'none' | 'medium' | 'large'}

function buildColumns(items: MediaValue[]): Column[] {
  const columns: Column[] = []
  let pairIndex = 0
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const isVideo = stegaClean(item.kind) === 'video'
    if (isVideo) {
      const next = items[i + 1]
      const pair = next && stegaClean(next.kind) === 'video' ? [item, next] : [item]
      if (pair.length === 2) i++
      columns.push({key: item._key ?? String(i), items: pair, offset: pairIndex++ % 2 === 0 ? 'none' : 'large'})
    } else {
      columns.push({key: item._key ?? String(i), items: [item], offset: 'medium'})
    }
  }
  return columns
}

const SPEEDS = [-0.6, 0.4, -0.3, 0.7, -0.5, 0.3]

export function DriftGallery({items, editAttrs}: {items: MediaValue[]; editAttrs?: Record<string, string | undefined>}) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const columns = buildColumns(items)

  useEffect(() => {
    const gallery = galleryRef.current
    const track = trackRef.current
    if (!gallery || !track) return

    const setSpeed = () => track.style.setProperty('--drift', `${Math.round(track.scrollWidth / 2 / 40)}s`)
    setSpeed()
    window.addEventListener('resize', setSpeed)

    // Scroll depth: --shift runs from 60 (below the fold) to -60 (above), only while on screen
    let onScreen = false
    let ticking = false
    const update = () => {
      ticking = false
      const r = gallery.getBoundingClientRect()
      const progress = (r.top + r.height / 2) / window.innerHeight - 0.5
      gallery.style.setProperty('--shift', (Math.max(-1, Math.min(1, progress * 2)) * 60).toFixed(1))
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen && entry.intersectionRatio >= 0.2) gallery.setAttribute('data-in', '')
        update()
      },
      {threshold: [0, 0.2]},
    )
    io.observe(gallery)
    const onScroll = () => {
      if (onScreen && !ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, {passive: true})
    update()

    return () => {
      io.disconnect()
      window.removeEventListener('resize', setSpeed)
      window.removeEventListener('scroll', onScroll)
    }
  }, [columns.length])

  // Columns, then a copy so the loop is seamless
  const all = [...columns.map((c) => ({...c, copy: false})), ...columns.map((c) => ({...c, copy: true}))]

  return (
    <div ref={galleryRef} className="drift_component" suppressHydrationWarning>
      <div ref={trackRef} className="drift_track">
        {all.map((column, i) => (
          <div
            key={`${column.copy ? 'copy-' : ''}${column.key}`}
            className={`drift_column is-offset-${column.offset}`}
            aria-hidden={column.copy || undefined}
            style={{'--speed': SPEEDS[i % SPEEDS.length], '--enter-delay': `${(i % columns.length) * 0.08}s`} as CSSProperties}
          >
            {column.items.map((item, j) => (
              <div
                key={item._key ?? j}
                className="drift_item"
                data-sanity={item._key ? editAttrs?.[item._key] : undefined}
              >
                <Media
                  media={column.copy && item.image ? {...item, image: {...item.image, alt: ''}} : item}
                  imageClassName="drift_image"
                  videoClassName="drift_video"
                  sizes="(max-width: 767px) 7.2rem, 20rem"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
