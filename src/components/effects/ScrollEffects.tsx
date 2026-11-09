'use client'

import {useEffect, useState} from 'react'

import {PathnameWatcher} from '../PathnameWatcher'

/**
 * Page-wide scroll effects, ported from the live site's custom code. Works through
 * data attributes so it never fights React over class names:
 *
 * - [data-word-reveal]  → data-revealed once 40% visible (words fade in, CSS)
 * - [data-fade-up]      → data-in when its top passes 88% of the screen; elements
 *                          arriving together are staggered 0.1s, in reading order
 * - [data-theme]        → html[data-scheme] follows the last themed section whose top
 *                          has passed 75% down the screen (dark ↔ light colour switch)
 *
 * Re-scans on navigation and when the page content changes (live preview).
 */
export function ScrollEffects() {
  const [pathname, setPathname] = useState<string | null>(null)

  useEffect(() => {
    if (pathname === null) return // set by <PathnameWatcher> right after mount
    const html = document.documentElement
    const cleanups: Array<() => void> = []

    // ---------- Word reveal ----------
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          revealObserver.unobserve(entry.target)
        }
      },
      {threshold: 0.4},
    )
    cleanups.push(() => revealObserver.disconnect())

    // ---------- Fade up ----------
    const STAGGER = 0.1
    const show = (el: HTMLElement, delay: number) => {
      el.style.setProperty('--fade-delay', `${delay.toFixed(2)}s`)
      el.setAttribute('data-in', '')
      fadeObserver.unobserve(el)
    }
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => {
            if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) show(entry.target as HTMLElement, 0)
            return entry.isIntersecting
          })
          .sort((a, b) => {
            const ra = a.boundingClientRect
            const rb = b.boundingClientRect
            return Math.abs(ra.top - rb.top) > 4 ? ra.top - rb.top : ra.left - rb.left
          })
          .forEach((entry, i) => {
            const base = parseFloat(entry.target.getAttribute('data-fade-up') || '0') || 0
            show(entry.target as HTMLElement, base + i * STAGGER)
          })
      },
      {rootMargin: '0px 0px -12% 0px'},
    )
    cleanups.push(() => fadeObserver.disconnect())

    function scan() {
      document.querySelectorAll('[data-word-reveal]:not([data-revealed])').forEach((el) => revealObserver.observe(el))
      document.querySelectorAll('[data-fade-up]:not([data-in])').forEach((el) => fadeObserver.observe(el))
    }
    scan()

    // ---------- Section colour switch ----------
    let zones: HTMLElement[] = []
    let current: string | null = null
    let ticking = false
    const LINE = 0.75
    function checkScheme() {
      ticking = false
      const line = window.innerHeight * LINE
      let active: HTMLElement | null = null
      for (const zone of zones) if (zone.getBoundingClientRect().top <= line) active = zone
      const name = active?.getAttribute('data-theme') ?? null
      if (name === current) return
      current = name
      if (name) html.setAttribute('data-scheme', name)
      else html.removeAttribute('data-scheme')
    }
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(checkScheme)
      }
    }
    function collectZones() {
      zones = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'))
      checkScheme()
    }
    collectZones()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', checkScheme)
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', checkScheme)
      html.removeAttribute('data-scheme')
    })

    // ---------- Live preview: content can change under us ----------
    let pending = 0
    const mutationObserver = new MutationObserver(() => {
      window.clearTimeout(pending)
      pending = window.setTimeout(() => {
        scan()
        collectZones()
      }, 150)
    })
    const main = document.querySelector('main') ?? document.body
    mutationObserver.observe(main, {childList: true, subtree: true})
    cleanups.push(() => {
      mutationObserver.disconnect()
      window.clearTimeout(pending)
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [pathname])

  return <PathnameWatcher onChange={setPathname} />
}
