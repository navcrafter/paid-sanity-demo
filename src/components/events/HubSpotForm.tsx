'use client'

import {useEffect, useId, useRef} from 'react'

declare global {
  interface Window {
    hbspt?: {forms: {create: (options: Record<string, unknown>) => void}}
  }
}

let loader: Promise<void> | null = null

/** Loads HubSpot's form script once per page. */
function loadHubSpot() {
  if (window.hbspt) return Promise.resolve()
  loader ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loader = null
      reject(new Error('HubSpot forms script failed to load'))
    }
    document.head.appendChild(script)
  })
  return loader
}

/** HubSpot form embed (portal ID from Site settings, form ID from the event). */
export function HubSpotForm({portalId, formId}: {portalId: string; formId: string}) {
  const targetId = `hs-form-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    loadHubSpot()
      .then(() => {
        if (cancelled || !window.hbspt || !containerRef.current) return
        containerRef.current.innerHTML = ''
        window.hbspt.forms.create({portalId, formId, target: `#${targetId}`, css: ''})
      })
      .catch(() => {
        if (containerRef.current) containerRef.current.textContent = 'The registration form could not be loaded. Please refresh the page.'
      })
    return () => {
      cancelled = true
    }
  }, [portalId, formId, targetId])

  return <div id={targetId} ref={containerRef} className="hubspot-form" />
}
