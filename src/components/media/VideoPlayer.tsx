'use client'

import {useEffect, useRef, useState} from 'react'

/**
 * Background video (muted, looping, no controls), loaded only near the viewport.
 * Ported from the live site's "Vidzflow: hold every player until it's needed":
 * - the iframe only gets its src when within half a screen of view, and is unloaded far off screen
 * - the poster shows until the player reports playback, then the video fades in
 * - a player that never starts or stalls is reloaded (up to 3 times)
 * An uploaded MP4 uses a native <video> with the same lazy behaviour.
 */

const VIDZFLOW_ORIGIN = 'https://app.vidzflow.com'
const STALL_MS = 8000
const MAX_RETRIES = 3

function vidzflowSrc(id: string) {
  const params = new URLSearchParams({
    dq: '576',
    ap: 'true',
    muted: 'true',
    loop: 'true',
    ctp: 'false',
    bv: 'true',
    piv: 'false',
    playsinline: 'false',
    bc: '#4E5FFD',
    controls: 'false',
  })
  return `${VIDZFLOW_ORIGIN}/v/${id}?${params}`
}

export function VideoPlayer({
  vidzflowId,
  fileUrl,
  posterUrl,
  className,
  title = 'Video',
  eager = false,
  active,
  editAttr,
}: {
  vidzflowId?: string | null
  fileUrl?: string | null
  posterUrl?: string | null
  className?: string
  title?: string
  /** Load immediately instead of waiting for the viewport (e.g. a slide in view). */
  eager?: boolean
  /** Parent decides when the player runs (e.g. only cards facing front in the 3D ring). */
  active?: boolean
  editAttr?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [inView, setInView] = useState(eager)
  const [playing, setPlaying] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const near = active ?? inView

  // Load when within half a screen of view; unload when far away.
  useEffect(() => {
    if (eager || active !== undefined) return
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (!entry.isIntersecting) setPlaying(false)
      },
      {rootMargin: '50% 25%'},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [eager, active])

  // Vidzflow reports playback through postMessage; reload if it never starts or stalls.
  useEffect(() => {
    if (!near || !vidzflowId) return
    let lastSignOfLife = Date.now()
    let retries = 0

    function onMessage(event: MessageEvent) {
      if (event.origin !== VIDZFLOW_ORIGIN || event.source !== iframeRef.current?.contentWindow) return
      let data = event.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch {
          return
        }
      }
      if (data?.eventType !== 'videoTimeUpdate') return
      lastSignOfLife = Date.now()
      retries = 0
      setPlaying(true)
    }
    function onVisibility() {
      if (!document.hidden) lastSignOfLife = Date.now()
    }
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() - lastSignOfLife < STALL_MS || retries >= MAX_RETRIES) return
      retries += 1
      lastSignOfLife = Date.now()
      setPlaying(false)
      setAttempt((value) => value + 1)
    }, 2000)

    window.addEventListener('message', onMessage)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('message', onMessage)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearInterval(timer)
    }
  }, [near, vidzflowId])

  return (
    <div
      ref={wrapperRef}
      className={`video-player${playing ? ' is-playing' : ''}${className ? ` ${className}` : ''}`}
      style={posterUrl ? {backgroundImage: `url("${posterUrl}")`} : undefined}
      data-sanity={editAttr}
    >
      {near && vidzflowId && (
        <iframe
          key={attempt}
          ref={iframeRef}
          className="video-player_frame"
          src={vidzflowSrc(vidzflowId)}
          title={title}
          allow="autoplay; fullscreen"
          tabIndex={-1}
        />
      )}
      {near && !vidzflowId && fileUrl && (
        <video
          className="video-player_frame"
          src={fileUrl}
          poster={posterUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => setPlaying(true)}
        />
      )}
    </div>
  )
}
