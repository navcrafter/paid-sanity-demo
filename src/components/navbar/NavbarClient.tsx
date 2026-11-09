'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'

import {PaidLogo} from '../icons'
import {SmartLink, type LinkData} from '../SmartLink'
import {LoginDropdown} from './LoginDropdown'
import {useOnDarkSection} from './useOnDarkSection'

type KeyedLink = LinkData & {_key?: string}

export interface NavigationData {
  links?: KeyedLink[] | null
  loginLabel?: string | null
  loginLinks?: KeyedLink[] | null
  cta?: LinkData | null
}

const TABLET_QUERY = '(max-width: 991px)'

export function NavbarClient({data}: {data: NavigationData | null}) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const isOnDark = useOnDarkSection(containerRef, pathname)
  const [menuOpen, setMenuOpen] = useState(false)

  const links = data?.links ?? []
  const loginLinks = data?.loginLinks ?? []
  const loginLabel = data?.loginLabel || 'Log in'
  const closeMenu = () => setMenuOpen(false)

  // Close the sheet with Escape, or when the window grows past the tablet breakpoint.
  useEffect(() => {
    if (!menuOpen) return
    const media = window.matchMedia(TABLET_QUERY)
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    const onChange = () => !media.matches && setMenuOpen(false)
    document.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', onChange)
    }
  }, [menuOpen])

  return (
    <div className={`navbar_component${menuOpen ? ' is-menu-open' : ''}`}>
      <div ref={containerRef} className={`navbar_container${isOnDark ? ' is-on-dark' : ''}`}>
        <div className="navbar_left">
          <Link href="/" className="navbar_logo-link" aria-label="#paid home" onClick={closeMenu}>
            <span className="navbar_logo">
              <PaidLogo />
            </span>
          </Link>
          <nav className="navbar_menu" aria-label="Main">
            {links.map((link, index) => (
              <SmartLink key={link._key ?? index} link={link} className="navbar_link" />
            ))}
          </nav>
        </div>

        <div className="navbar_button-wrapper">
          <LoginDropdown label={loginLabel} links={loginLinks} className="hide-tablet" />
          <SmartLink link={data?.cta} className="button" onClick={closeMenu} />
          <button
            type="button"
            className="navbar_menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="navbar-sheet"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-icon">
              <span className="menu-icon_line-top" />
              <span className="menu-icon_line-middle" />
              <span className="menu-icon_line-bottom" />
            </span>
          </button>
        </div>
      </div>

      {/* Tablet/mobile menu sheet */}
      <div id="navbar-sheet" className="navbar_sheet" inert={!menuOpen}>
        <nav className="navbar_sheet-links" aria-label="Main">
          {links.map((link, index) => (
            <SmartLink key={link._key ?? index} link={link} className="navbar_link" onClick={closeMenu} />
          ))}
          <SmartLink link={data?.cta} className="button" onClick={closeMenu} />
          <LoginDropdown label={loginLabel} links={loginLinks} />
        </nav>
      </div>
    </div>
  )
}
