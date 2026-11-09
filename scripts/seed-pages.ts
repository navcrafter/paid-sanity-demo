/**
 * Seeds page sections from scripts/content/<page>.json (content captured from the live site).
 *
 * The JSON is plain Sanity document data plus two placeholders, resolved here:
 *   {"_upload": {"url": "https://…", "type": "image" | "file"}}  → uploads the file, becomes an asset reference
 *   {"_vidzflowPoster": "<videoId>"}                             → uploads the Vidzflow thumbnail as an image
 *
 * Uploads are cached in scripts/.asset-cache.json so re-runs are fast (Sanity also
 * de-duplicates identical files). Run: npm run seed:pages [-- home creators company]
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {basename, join} from 'node:path'

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-01'})

const CONTENT_DIR = join(process.cwd(), 'scripts', 'content')
const CACHE_FILE = join(process.cwd(), 'scripts', '.asset-cache.json')
const PAGES: Record<string, string> = {home: 'homePage', creators: 'creatorsPage', company: 'companyPage'}

const cache: Record<string, string> = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf8')) : {}
const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))

async function upload(url: string, type: 'image' | 'file'): Promise<string> {
  const cacheKey = `${type}:${url}`
  if (cache[cacheKey]) return cache[cacheKey]
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename = decodeURIComponent(basename(new URL(url).pathname)).replace(/^[0-9a-f]{24}_/, '')
  const asset = await client.assets.upload(type, buffer, {filename})
  cache[cacheKey] = asset._id
  saveCache()
  process.stdout.write('.')
  return asset._id
}

async function vidzflowThumbnail(id: string): Promise<string> {
  const response = await fetch(`https://app.vidzflow.com/oembed?url=https://app.vidzflow.com/v/${id}`)
  if (!response.ok) throw new Error(`Vidzflow oEmbed failed for ${id}`)
  const {thumbnail_url: url} = (await response.json()) as {thumbnail_url: string}
  return upload(url, 'image')
}

/** Walks the content tree and replaces upload placeholders with asset references. */
async function resolve(value: unknown): Promise<unknown> {
  if (Array.isArray(value)) {
    const out = []
    for (const item of value) out.push(await resolve(item))
    return out
  }
  if (!value || typeof value !== 'object') return value
  const record = value as Record<string, unknown>

  if (record._upload) {
    const {url, type = 'image'} = record._upload as {url: string; type?: 'image' | 'file'}
    return {_type: 'reference', _ref: await upload(url, type)}
  }
  if (record._vidzflowPoster) {
    const {_vidzflowPoster: id, ...rest} = record
    return {...(await resolve(rest) as object), _type: 'image', asset: {_type: 'reference', _ref: await vidzflowThumbnail(String(id))}}
  }

  const out: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(record)) out[key] = await resolve(child)
  return out
}

async function seed(page: string) {
  const id = PAGES[page]
  const file = join(CONTENT_DIR, `${page}.json`)
  if (!id || !existsSync(file)) throw new Error(`No content for "${page}" (expected ${file})`)

  const content = JSON.parse(readFileSync(file, 'utf8')) as {sections: unknown[]}
  process.stdout.write(`${page}: uploading media `)
  const sections = await resolve(content.sections)
  await client
    .transaction()
    .createIfNotExists({_id: id, _type: id, title: page[0].toUpperCase() + page.slice(1)})
    .patch(id, (patch) => patch.set({sections}))
    .commit()
  console.log(` ✓ ${(sections as unknown[]).length} sections saved`)
}

async function run() {
  const requested = process.argv.slice(2).filter((arg) => PAGES[arg])
  for (const page of requested.length ? requested : Object.keys(PAGES)) {
    if (existsSync(join(CONTENT_DIR, `${page}.json`))) await seed(page)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
