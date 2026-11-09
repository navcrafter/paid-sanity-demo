'use client'

import {useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode} from 'react'

/**
 * Auto-advancing tabs (ported from the live Home "Auto tabs"): on desktop the
 * active row's bar fills, then moves to the next tab — only while on screen.
 * Tablet/phone: no auto-advance; the image opens inside the row.
 */
export interface FeatureTabView {
  key: string
  header: ReactNode
  description: ReactNode
  mobileImage: ReactNode
  image: ReactNode
  editAttr?: string
}

export function FeatureTabs({
  tabs,
  imageSide,
  durationMs,
}: {
  tabs: FeatureTabView[]
  imageSide: 'left' | 'right'
  durationMs: number
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const [paused, setPaused] = useState(true)

  // Desktop only, and not with reduced motion
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 992px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAutoplay(desktop.matches && !reduce.matches)
    sync()
    desktop.addEventListener('change', sync)
    return () => desktop.removeEventListener('change', sync)
  }, [])

  // Waits while off screen
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {threshold: 0.35})
    io.observe(root)
    return () => io.disconnect()
  }, [])

  const show = (index: number) => setCurrent(((index % tabs.length) + tabs.length) % tabs.length)

  const onKeyDown = (event: KeyboardEvent) => {
    const step = ({ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1} as Record<string, number>)[event.key]
    if (!step) return
    event.preventDefault()
    const next = (current + step + tabs.length) % tabs.length
    show(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      ref={rootRef}
      className={`feature-tabs${paused ? ' is-paused' : ''}`}
      style={{'--tab-duration': `${durationMs}ms`} as CSSProperties}
    >
      <div className={`feature-tabs_menu${imageSide === 'left' ? ' is-right' : ''}`} role="tablist" onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => {
          const isCurrent = i === current
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              tabIndex={isCurrent ? 0 : -1}
              className={`feature-tabs_tab${isCurrent ? ' is-current' : ''}`}
              onClick={() => !isCurrent && show(i)}
              data-sanity={tab.editAttr}
            >
              <span className="feature-tabs_header">{tab.header}</span>
              <span className="feature-tabs_description">
                <span>{tab.description}</span>
              </span>
              <span className="feature-tabs_mobile-image">
                <span>{tab.mobileImage}</span>
              </span>
              <span
                // Re-mounting restarts the fill animation for the newly active tab
                key={isCurrent ? `on-${current}` : 'off'}
                className={`feature-tabs_timer-bar${isCurrent && autoplay ? ' is-playing' : ''}`}
                onAnimationEnd={(event) => {
                  if (event.animationName === 'feature-tabs-progress' && isCurrent) show(current + 1)
                }}
              />
            </button>
          )
        })}
      </div>
      <div className={`feature-tabs_content${imageSide === 'left' ? ' is-left' : ''}`}>
        {tabs.map((tab, i) => (
          <div key={tab.key} className={`feature-tabs_pane${i === current ? ' is-active' : ''}`} aria-hidden={i !== current}>
            {tab.image}
          </div>
        ))}
      </div>
    </div>
  )
}
