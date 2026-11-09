// Temporary stand-in used until each page is built (phases 3 and 4).
// Proves the Sanity connection: the title below comes from the dataset.

export function PagePlaceholder({
  heading,
  sanityTitle,
  details,
}: {
  heading: string
  sanityTitle?: string | null
  details?: Record<string, string | null | undefined>
}) {
  return (
    <main style={{maxWidth: '48rem', margin: '0 auto', padding: '6rem 1.5rem'}}>
      <p style={{margin: 0, opacity: 0.6, fontSize: '0.875rem'}}>#paid demo · placeholder</p>
      <h1 style={{margin: '0.5rem 0 1.5rem', fontSize: '2.5rem'}}>{heading}</h1>
      <p style={{margin: 0}}>
        {sanityTitle
          ? <>Connected to Sanity. Document title: <strong>{sanityTitle}</strong></>
          : 'Connected to Sanity. This document has not been created in the Studio yet.'}
      </p>
      {details && (
        <dl style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.25rem 1rem'}}>
          {Object.entries(details).map(([label, value]) => (
            <div key={label} style={{display: 'contents'}}>
              <dt style={{opacity: 0.6}}>{label}</dt>
              <dd style={{margin: 0}}>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  )
}
