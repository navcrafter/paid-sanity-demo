/**
 * Seeds Site settings (navigation + footer) and the per-page footer overrides with the
 * content from the live hashtagpaid.com. Partner badges are downloaded from the live
 * site and uploaded to Sanity's asset library. Safe to re-run (assets are de-duplicated).
 *
 * Run: npm run seed:settings
 */
import {randomUUID} from 'node:crypto'

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-01'})

const LIVE = 'https://hashtagpaid.com'
const WEBFLOW_CDN = 'https://cdn.prod.website-files.com/5c34f4c0ee3329913fc72eac'

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

/** Pages that exist in this demo stay relative; everything else points at the live site. */
const DEMO_PAGES = new Set(['/', '/creators', '/company', '/events'])
function link(label: string, href: string, openInNewTab = false) {
  const path = href.split('#')[0]
  const resolved = href.startsWith('/') && !DEMO_PAGES.has(path) ? `${LIVE}${href}` : href
  return {_key: key(), _type: 'link', label, href: resolved, openInNewTab}
}

const BADGES = [
  {
    file: '687e815976675c15e37e2363_MBP-Partner-Badge-RGB.png',
    alt: 'Meta Business Partner',
    size: 'smallWide',
  },
  {file: '6471294f2718a7b0dd9f619e_hashtag-paid-tiktok.png', alt: 'TikTok Marketing Partner', size: 'regular'},
  {file: '656519d00d54584693120da2_tiktokwhite.svg', alt: 'TikTok Shop Partner', size: 'small'},
  {
    file: '6839ba92860b5a51c123b8b0_Snap%20Ads%20Production%20Partner%20Badge.avif',
    alt: 'Snapchat Ads Production Partner 2025',
    size: 'regular',
  },
  {
    file: '6839ba91cf4bb1a509664b6d_Snap%20Marketing%20Platform%20Badge.avif',
    alt: 'Snapchat Marketing Platform Partner',
    size: 'regular',
  },
  {
    file: '6a188f88b3a01405dd98ab17_InfluencerMarketingPlatforms_Leader_Leader%20(1).svg',
    alt: 'G2 Leader: Influencer Marketing Platforms',
    size: 'regular',
  },
]

async function uploadBadge(file: string) {
  const response = await fetch(`${WEBFLOW_CDN}/${file}`)
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${file}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = decodeURIComponent(file).replace(/^[0-9a-f]+_/, '')
  const asset = await client.assets.upload('image', buffer, {filename})
  return asset._id
}

async function run() {
  console.log('Uploading partner badges…')
  const badges = []
  for (const badge of BADGES) {
    const assetId = await uploadBadge(badge.file)
    badges.push({
      _key: key(),
      _type: 'badge',
      asset: {_type: 'reference', _ref: assetId},
      alt: badge.alt,
      size: badge.size,
    })
    console.log(`  ✓ ${badge.alt}`)
  }

  const navigation = {
    links: [link('Creators', '/creators'), link('Company', '/company'), link('Events', '/events')],
    loginLabel: 'Log in',
    loginLinks: [
      link('Creator', 'https://app.hashtagpaid.app/sign-in'),
      link('Talent Agency', 'https://app.hashtagpaid.app/talent-agency/sign-in'),
      link('Brand', 'https://creator.hashtagpaid.app/login'),
    ],
    cta: {...link('Join #paid', '/create-account'), _key: undefined},
  }

  const footer = {
    cta: {heading: 'Don’t start from zero', button: {...link('Get started', '/book-a-demo'), _key: undefined}},
    columns: [
      {
        _key: key(),
        _type: 'linkColumn',
        title: 'Solutions',
        links: [
          link('Get started', '/book-a-demo'),
          link('Brands', '/brands'),
          link('Creators', '/creators'),
          link('Case studies', '/case-studies'),
        ],
      },
      {
        _key: key(),
        _type: 'linkColumn',
        title: 'Resources',
        links: [
          link('Creator Marketing Summit', '/creator-marketing-summit'),
          link('Creator Signals Report', '/creator-signals'),
          link('News', '/banknotes'),
          link('Press releases', '/banknotes'),
          link('Product Updates', '/banknotes'),
        ],
      },
      {
        _key: key(),
        _type: 'linkColumn',
        title: 'Company',
        links: [
          link('Company', '/company'),
          link('Careers', '/company#jobs'),
          link('Help centre', 'https://hashtagpaid.zendesk.com/hc/en-us', true),
          link('Privacy policy', '/privacy'),
          link('Terms of service', '/terms'),
        ],
      },
    ],
    socialLinks: [
      {_key: key(), _type: 'socialLink', platform: 'instagram', url: 'https://www.instagram.com/hashtagpaid/'},
      {_key: key(), _type: 'socialLink', platform: 'youtube', url: 'https://www.youtube.com/@hashtagpaid.'},
      {_key: key(), _type: 'socialLink', platform: 'tiktok', url: 'https://www.tiktok.com/@hashtagpaid'},
      {_key: key(), _type: 'socialLink', platform: 'linkedin', url: 'https://www.linkedin.com/company/hashtagpaid/'},
      {_key: key(), _type: 'socialLink', platform: 'x', url: 'https://x.com/hashtagpaid'},
    ],
    badges,
    companyName: 'Hashtag Paid Inc.',
    locations: ['New York', 'Toronto', 'Chicago', 'Los Angeles', 'Miami'],
  }

  // Strip the helper `_key` on single (non-array) links.
  const clean = <T>(value: T): T => JSON.parse(JSON.stringify(value))

  await client
    .transaction()
    .createIfNotExists({_id: 'siteSettings', _type: 'siteSettings', title: '#paid'})
    .patch('siteSettings', (patch) => patch.set({navigation: clean(navigation), footer: clean(footer)}))
    // Per-page footer overrides, matching the live pages.
    .patch('creatorsPage', (patch) =>
      patch.set({
        footerCta: clean({
          heading: 'Find your next brand opportunity today',
          button: {...link('Join now', '/create-account'), _key: undefined},
        }),
      }),
    )
    .patch('companyPage', (patch) =>
      patch.set({footerCta: clean({button: {...link('Join #paid', '/create-account'), _key: undefined}})}),
    )
    .patch('homePage', (patch) => patch.unset(['footerCta']))
    .commit()

  console.log('Site settings, navigation, footer and page footer overrides saved.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
