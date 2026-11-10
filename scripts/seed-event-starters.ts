/**
 * Creates the three "starting content" documents (Studio → Events → Starting content) that new
 * events are copied from. The shared parts (hero video, logo strip, testimonials, past creators,
 * venues, FAQ) are copied from existing events; the text is generic starter copy with [brackets]
 * where an editor fills in the specifics.
 *
 * Run: npm run seed:starters   (replaces the three documents; edit them in the Studio afterwards)
 */
import {randomBytes} from 'node:crypto'

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-01'}).withConfig({perspective: 'raw'})

const k = () => randomBytes(6).toString('hex')
const span = (text: string, marks: string[] = []) => ({_type: 'span', _key: k(), text, marks})
const block = (children: unknown[], extra: Record<string, unknown> = {}) => ({_type: 'block', _key: k(), style: 'normal', markDefs: [], children, ...extra})
const para = (text: string) => block([span(text)])
const h2 = (text: string) => block([span(text)], {style: 'h2'})
const item = (lead: string, text: string) => block([span(`${lead}  `, ['strong']), span(text)])
const bullet = (text: string) => block([span(text)], {listItem: 'bullet', level: 1})

type Doc = Record<string, unknown> & {sections?: Record<string, unknown>[]}
const get = (id: string) => client.fetch<Doc | null>(`*[_id == $id][0]`, {id})

async function run() {
  const supper = await get('event-an-evening-at-local-eclectic')
  const tashca = (await get('drafts.event-an-evening-at-tashca')) ?? (await get('event-an-evening-at-tashca'))
  const midTier = await get('event-nyc-aug-12-2025')
  const webinar = await get('event-ai-and-influence-april-3-2025')
  if (!supper || !midTier || !webinar) throw new Error('Source events are missing; run npm run seed:pages -- events first.')

  const starters: (Record<string, unknown> & {_id: string})[] = [
    {
      _id: 'eventStarter-supperClub',
      template: 'supperClub',
      theme: {background: 'dark', accent: 'pink'},
      logo: tashca?.logo ?? supper.logo, // "Supper Club by #paid"
      logoSize: 'regular',
      heroVideo: tashca?.heroVideo ?? supper.heroVideo,
      intro: 'Join #paid for an intimate dinner bringing together senior marketers and creators for an evening of great food, wine, and conversation.',
      body: [
        para('Hosted at [venue] in [neighbourhood], [one or two sentences on what makes this evening special]. Come hungry, leave with new connections.'),
        h2('The Experience'),
        item('A Private Table', 'Enjoy exclusive access to [venue] for an intimate evening designed for just [number] guests.'),
        item('Signature Menu', 'Sit down to a multi-course menu curated by the chef, with wine and drinks served throughout the evening.'),
        item('Dinner Party Details', 'From the table settings to the menu, the space will be thoughtfully styled for the evening.'),
        item('Curated Connections', 'A small group of senior marketers and creators gathered around one table, with plenty of time for conversation that feels more personal than professional.'),
      ],
      sections: supper.sections,
      registration: {heading: 'Ready to pull up a chair?'},
      moreInfoHeading: 'More Information',
      moreInfo: supper.moreInfo,
    },
    {
      _id: 'eventStarter-midTier',
      template: 'midTier',
      theme: {background: 'black', accent: 'default'},
      heroVideo: midTier.heroVideo,
      intro: 'Join #paid for [event name], a hands-on experience bringing together senior marketers and creators in [city].',
      bodyHeading: 'What awaits you:',
      body: [
        item('The Experience:', '[What guests will do, make or see.]'),
        item('Creative Collaboration:', 'Exchange ideas with industry peers and creators in a relaxed, upbeat setting.'),
        item('Industry Insights:', 'Take part in a short, impactful session exploring the future of creator marketing.'),
      ],
      sections: midTier.sections,
      registration: {heading: 'Ready to join us?'},
      moreInfoHeading: 'More Information',
      moreInfo: midTier.moreInfo,
    },
    {
      _id: 'eventStarter-webinar',
      template: 'webinar',
      theme: {background: 'light', accent: 'default'},
      intro: '[One short paragraph: the topic, why it matters right now, and who should attend.]',
      bodyHeading: 'This webinar will help you:',
      body: [bullet('[Takeaway one]'), bullet('[Takeaway two]'), bullet('[Takeaway three]')],
      // Speakers change every time: keep the section, clear the people.
      sections: (webinar.sections ?? []).map((section) => (section._type === 'eventPeople' ? {...section, people: []} : section)),
      registration: {heading: 'Save your spot!'},
      moreInfoHeading: 'More Information',
      moreInfo: [],
    },
  ]

  for (const starter of starters) {
    await client.createOrReplace({_type: 'eventStarter', ...starter})
    console.log(`${starter._id} ✓ (${(starter.sections as unknown[] | undefined)?.length ?? 0} sections)`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
