import {cachedSanity} from '@/sanity/lib/live'
import {NAVIGATION_QUERY} from '@/sanity/lib/queries'
import {WithFetchOptions} from '@/sanity/lib/WithFetchOptions'

import {NavbarClient} from './NavbarClient'

/** Site navbar. Content comes from Site settings → Navigation. */
export function Navbar() {
  return (
    <WithFetchOptions
      render={async (options) => {
        const {data} = await cachedSanity({query: NAVIGATION_QUERY, ...options})
        return <NavbarClient data={data} />
      }}
    />
  )
}
