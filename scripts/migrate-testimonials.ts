/**
 * One-off: moves the inline quotes of every "Testimonial carousel" section into the
 * Testimonials collection and replaces them with references (same order, same _key).
 *
 * Safe to re-run: testimonial ids are derived from the quote's _key, and quotes that are
 * already references are left alone. Handles published pages and their drafts.
 * Run: npm run migrate:testimonials
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-01'}).withConfig({perspective: 'raw'})

type Quote = {_key: string; _type: string; quote?: string; size?: string; name?: string; company?: string; photo?: unknown}
type Section = {_key: string; _type: string; quotes?: Quote[]}

async function run() {
  const pages = await client.fetch<{_id: string; sections?: Section[]}[]>(
    `*[defined(sections) && count(sections[_type == "testimonialCarouselSection"]) > 0]{_id, sections}`,
  )
  for (const page of pages) {
    for (const section of page.sections ?? []) {
      if (section._type !== 'testimonialCarouselSection') continue
      const inline = (section.quotes ?? []).filter((quote) => quote._type !== 'reference')
      if (!inline.length) continue

      const tx = client.transaction()
      for (const quote of inline) {
        const {_key, _type: _legacy, ...fields} = quote
        tx.createIfNotExists({_id: `testimonial-${_key}`, _type: 'testimonial', ...fields})
      }
      const quotes = (section.quotes ?? []).map((quote) =>
        quote._type === 'reference' ? quote : {_key: quote._key, _type: 'reference', _ref: `testimonial-${quote._key}`},
      )
      tx.patch(page._id, (patch) => patch.set({[`sections[_key=="${section._key}"].quotes`]: quotes}))
      await tx.commit()
      console.log(`${page._id}: ${inline.length} quotes moved to the Testimonials collection`)
    }
  }
  console.log('Done.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
