/**
 * Configuration for the Sanity CLI (`npx sanity ...`), e.g. dataset import/export and typegen.
 */
import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({api: {projectId, dataset}})
