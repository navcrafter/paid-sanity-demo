'use client'

import {useEffect, useState, type RefObject} from 'react'

/**
 * True while the element floats over a dark section (ported from the live site's
 * "Navbar: dark glass over dark sections" script).
 *
 * Watches a 1px line through the middle of the element and only reads a section's
 * background when the section under that line changes, not on every scroll.
 * Sections inside a colour-switch zone ([data-theme]) follow html[data-scheme].
 */
export function useOnDarkSection(ref: RefObject<HTMLElement | null>, routeKey: string) {
  const [isOnDark, setIsOnDark] = useState(false)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return

    const html = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section, footer'))
    const under = new Set<Element>()
    const known = new Map<Element, boolean>()
    let observer: IntersectionObserver | undefined

    function isDark(section: HTMLElement) {
      const scheme = html.getAttribute('data-scheme')
      if (scheme && section.hasAttribute('data-theme')) return scheme === 'dark'
      if (!known.has(section)) {
        let dark = false
        // First solid background from the section outwards
        for (let el: HTMLElement | null = section; el; el = el.parentElement) {
          const rgba = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)
          if (!rgba || (rgba[3] !== undefined && Number(rgba[3]) < 0.5)) continue
          const [r, g, b] = rgba.map(Number)
          dark = (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
          break
        }
        known.set(section, dark)
      }
      return known.get(section) ?? false
    }

    function paint() {
      const section = sections.find((s) => under.has(s))
      setIsOnDark(Boolean(section && isDark(section)))
    }

    function watch() {
      observer?.disconnect()
      under.clear()
      const rect = bar!.getBoundingClientRect()
      const y = Math.round(rect.top + rect.height / 2)
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) under.add(entry.target)
            else under.delete(entry.target)
          }
          paint()
        },
        {rootMargin: `${-y}px 0px ${-(window.innerHeight - y - 1)}px 0px`},
      )
      sections.forEach((s) => observer!.observe(s))
    }

    function onResize() {
      known.clear()
      watch()
    }

    watch()
    window.addEventListener('resize', onResize)
    const schemeObserver = new MutationObserver(paint)
    schemeObserver.observe(html, {attributes: true, attributeFilter: ['data-scheme']})

    return () => {
      observer?.disconnect()
      schemeObserver.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [ref, routeKey])

  return isOnDark
}
