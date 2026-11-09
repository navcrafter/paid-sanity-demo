import type {Metadata} from 'next'

import {SingletonPage} from '@/components/SingletonPage'

export const metadata: Metadata = {title: 'Events'}

export default function EventsPage() {
  return <SingletonPage id="eventsPage" heading="Events" />
}
