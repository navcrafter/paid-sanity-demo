import type {Metadata} from 'next'

import {SingletonPage} from '@/components/SingletonPage'

export const metadata: Metadata = {title: 'Company'}

export default function CompanyPage() {
  return <SingletonPage id="companyPage" heading="Company" />
}
