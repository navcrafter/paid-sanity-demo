/**
 * Seeds the Q4 2026 events from scripts/content/q4-events.json as DRAFTS (unpublished),
 * so they show up in the Studio ready to review and publish. Content comes from the events
 * team's website-copy docs and the "Event Content for Landing Pages & Integrations" sheet.
 *
 * Same placeholders as seed-pages.ts ({"_upload": …}, {"_vidzflowPoster": …}).
 * Run: npm run seed:q4   (re-running replaces the drafts; published copies are untouched)
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {basename, join} from 'node:path'

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-01'})
const FILE = join(process.cwd(), 'scripts', 'content', 'q4-events.json')
const CACHE_FILE = join(process.cwd(), 'scripts', '.asset-cache.json')

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

async function run() {
  const {events} = JSON.parse(readFileSync(FILE, 'utf8')) as {events: {_id: string; _type: string}[]}
  for (const event of events) {
    if (!event._id.startsWith('drafts.')) throw new Error(`${event._id} must be a draft id (drafts.…)`)
    process.stdout.write(`${event._id}: uploading media `)
    const doc = (await resolve(event)) as {_id: string; _type: string}
    await client.createOrReplace(doc)
    console.log(' ✓ draft saved')
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
