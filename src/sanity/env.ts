// Environment values shared by the Next.js app and the embedded Studio.
// NEXT_PUBLIC_ variables are referenced literally so Next.js can inline them.

function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined || value === '') throw new Error(message)
  return value
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-11-01'

export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio'
