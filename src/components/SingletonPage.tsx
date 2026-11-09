import {PagePlaceholder} from '@/components/PagePlaceholder'
import {cachedSanity, type FetchOptions} from '@/sanity/lib/live'
import {PAGE_QUERY} from '@/sanity/lib/queries'
import {WithFetchOptions} from '@/sanity/lib/WithFetchOptions'

type SingletonId = 'homePage' | 'creatorsPage' | 'companyPage'

/** Phase 1: loads a page document and renders the placeholder. Replaced by real sections in phase 3. */
export function SingletonPage({id, heading}: {id: SingletonId; heading: string}) {
  return <WithFetchOptions render={(options) => <Content id={id} heading={heading} options={options} />} />
}

async function Content({id, heading, options}: {id: SingletonId; heading: string; options: FetchOptions}) {
  const {data} = await cachedSanity({query: PAGE_QUERY, params: {id}, ...options})
  return <PagePlaceholder heading={heading} sanityTitle={data?.title} />
}
