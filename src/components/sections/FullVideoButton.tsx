'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {createPortal} from 'react-dom'

/**
 * "Watch the full video": opens the Vidzflow video over the page, with sound and
 * controls (ported from the live Creators page). Esc, the close button or a click
 * outside closes it; removing the player stops the sound.
 */
export function FullVideoButton({vidzflowId, className, children}: {vidzflowId: string; className?: string; children: ReactNode}) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    html.classList.add('video-modal-open')
    const frame = requestAnimationFrame(() => {
      setVisible(true)
      closeRef.current?.focus()
    })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      html.classList.remove('video-modal-open')
    }
  }, [open])

  function close() {
    setVisible(false)
    window.setTimeout(() => {
      setOpen(false)
      buttonRef.current?.focus()
    }, 400)
  }

  const src = `https://app.vidzflow.com/v/${vidzflowId}?dq=1080&ap=true&muted=false&loop=false&controls=true&playsinline=true&ctp=true`

  return (
    <>
      <button ref={buttonRef} type="button" className={className} data-hover="roll" onClick={() => setOpen(true)}>
        {children}
      </button>
      {open &&
        createPortal(
          <div
            className={`video-modal${visible ? ' is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Video"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="video-modal_frame">
              <iframe src={src} title="Video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            </div>
            <button ref={closeRef} type="button" className="video-modal_close" aria-label="Close video" onClick={close}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
