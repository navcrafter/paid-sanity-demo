import {Footer} from '@/components/footer/Footer'
import {PagePlaceholder} from '@/components/PagePlaceholder'
import {SectionRenderer, type SectionData} from '@/components/sections/SectionRenderer'
import {editAttrFor} from '@/sanity/lib/edit'
import {cachedSanity, type FetchOptions} from '@/sanity/lib/live'
import {PAGE_QUERY} from '@/sanity/lib/queries'
import {WithFetchOptions} from '@/sanity/lib/WithFetchOptions'

type SingletonId = 'homePage' | 'creatorsPage' | 'companyPage'

/** Loads a page document and renders its sections, followed by the site footer. */
export function SingletonPage({id, heading}: {id: SingletonId; heading: string}) {
  return <WithFetchOptions render={(options) => <Content id={id} heading={heading} options={options} />} />
}

async function Content({id, heading, options}: {id: SingletonId; heading: string; options: FetchOptions}) {
  const {data: page} = await cachedSanity({query: PAGE_QUERY, params: {id}, ...options})
  const sections = (page?.sections ?? []) as unknown as SectionData[]
  const edit = editAttrFor(page, options.stega)

  return (
    <>
      <main className="main-wrapper">
        {sections.length > 0 ? (
          <SectionRenderer sections={sections} edit={edit} />
        ) : (
          <PagePlaceholder heading={heading} sanityTitle={page?.title} />
        )}
      </main>
      <Footer options={options} ctaOverride={page?.footerCta} />
    </>
  )
}
