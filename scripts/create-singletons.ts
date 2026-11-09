/**
 * Creates the singleton documents (pages + site settings) if they don't exist yet.
 * Run: npx sanity exec scripts/create-singletons.ts --with-user-token
 */
import type {IdentifiedSanityDocumentStub} from '@sanity/client'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-01'})

const singletons: IdentifiedSanityDocumentStub[] = [
  {_id: 'siteSettings', _type: 'siteSettings', title: '#paid', hubspotPortalId: '22409077'},
  {_id: 'homePage', _type: 'homePage', title: 'Home'},
  {_id: 'creatorsPage', _type: 'creatorsPage', title: 'Creators'},
  {_id: 'companyPage', _type: 'companyPage', title: 'Company'},
  {_id: 'eventsPage', _type: 'eventsPage', title: 'Events page'},
]

async function run() {
  const tx = client.transaction()
  for (const doc of singletons) tx.createIfNotExists(doc)
  const result = await tx.commit()
  console.log(`Ensured ${singletons.length} singleton documents (transaction ${result.transactionId}).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
