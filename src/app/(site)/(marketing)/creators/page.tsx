import type {Metadata} from 'next'

import {SingletonPage} from '@/components/SingletonPage'

export const metadata: Metadata = {title: 'Creators'}

export default function CreatorsPage() {
  return <SingletonPage id="creatorsPage" heading="Creators" />
}
