'use client'

import {useEffect, useId, useRef, useState} from 'react'

import {SmartLink, type LinkData} from '../SmartLink'

/** "Log in" pill that opens a list of sign-in destinations (Creator / Talent Agency / Brand). */
export function LoginDropdown({
  label,
  links,
  className = '',
}: {
  label: string
  links: (LinkData & {_key?: string})[]
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!links.length) return null

  return (
    <div ref={rootRef} className={`login-dropdown${open ? ' is-open' : ''} ${className}`.trim()}>
      <button
        type="button"
        className="button is-secondary login-dropdown_toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </button>
      <nav id={listId} className="login-dropdown_list" aria-label={label}>
        {links.map((link, index) => (
          <SmartLink
            key={link._key ?? index}
            link={link}
            className="login-dropdown_link"
            onClick={() => setOpen(false)}
          />
        ))}
      </nav>
    </div>
  )
}
