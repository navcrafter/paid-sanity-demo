// Temporary stand-in used until each page is built (phases 3 and 4).
// Proves the Sanity connection: the title below comes from the dataset.

export function PagePlaceholder({
  heading,
  sanityTitle,
  details,
  dark = false,
}: {
  heading: string
  sanityTitle?: string | null
  details?: Record<string, string | null | undefined>
  dark?: boolean
}) {
  return (
    <section className={dark ? 'background-color-black' : 'background-color-cream'}>
      <div className="padding-global padding-section-huge">
        <div className="container-large text-align-center">
          <div className="flex-vertical is-align-center is-gap-1-5">
            <p className="text-size-small text-color-secondary">#paid demo · placeholder</p>
            <h1 className="heading-style-h1 is-display">{heading}</h1>
            <p className="text-size-large">
              {sanityTitle
                ? <>Connected to Sanity. Document title: <strong>{sanityTitle}</strong></>
                : 'Connected to Sanity. This document has not been created in the Studio yet.'}
            </p>
            {details && (
              <dl className="text-size-regular" style={{display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.25rem 1rem', textAlign: 'left'}}>
                {Object.entries(details).map(([label, value]) => (
                  <div key={label} style={{display: 'contents'}}>
                    <dt className="text-color-secondary">{label}</dt>
                    <dd style={{margin: 0}}>{value || '—'}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
