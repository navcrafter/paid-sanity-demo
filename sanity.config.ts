'use client'

/**
 * Sanity Studio configuration. The Studio is served by Next.js at /studio
 * (see src/app/studio/[[...tool]]/page.tsx).
 */
import {assist} from '@sanity/assist'
import {defineConfig, type InitialValueResolverContext} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {SINGLETON_TYPES, type EventTemplate} from './src/sanity/constants'
import {dataset, projectId, studioUrl} from './src/sanity/env'
import {eventStarter} from './src/sanity/eventStarters'
import {resolve} from './src/sanity/presentation/resolve'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {StudioLogo} from './src/sanity/StudioLogo'

type StarterContext = InitialValueResolverContext
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const hiddenFromCreateMenu = new Set(['event', 'event-in-category'])
// Fixed documents (one per page / per event template): no create, duplicate or delete.
const fixedTypes = new Set<string>([...SINGLETON_TYPES, 'eventStarter'])

// Which layout a new event starts with when created inside a category folder.
const DEFAULT_TEMPLATE_BY_CATEGORY: Record<string, EventTemplate> = {
  supperclub: 'supperClub',
  industry: 'supperClub',
  med: 'midTier',
  shopping: 'midTier',
  webinar: 'webinar',
}

export default defineConfig({
  name: 'default',
  title: '#paid Demo',
  icon: StudioLogo,
  basePath: studioUrl,
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
    templates: (templates) => [
      // Singletons can't be created from the "+" menu.
      ...templates.filter(({schemaType}) => !fixedTypes.has(schemaType)),
      // Event starters: replace the Webflow "[Draft] ... Template" pages.
      {
        id: 'event-supper-club',
        title: 'Supper Club event',
        schemaType: 'event',
        value: (_params: unknown, context: StarterContext) => eventStarter('supperClub', undefined, context.getClient),
      },
      {
        id: 'event-mid-tier',
        title: 'Mid Tier event',
        schemaType: 'event',
        value: (_params: unknown, context: StarterContext) => eventStarter('midTier', undefined, context.getClient),
      },
      {
        id: 'event-webinar',
        title: 'Webinar',
        schemaType: 'event',
        value: (_params: unknown, context: StarterContext) => eventStarter('webinar', undefined, context.getClient),
      },
      // Used by the category folders in the sidebar to pre-fill the category.
      {
        id: 'event-in-category',
        title: 'Event in category',
        schemaType: 'event',
        parameters: [{name: 'category', type: 'string'}],
        value: ({category}: {category: string}, context: StarterContext) =>
          eventStarter(DEFAULT_TEMPLATE_BY_CATEGORY[category] ?? 'supperClub', category, context.getClient),
      },
    ],
  },

  document: {
    // Singletons: no duplicate/delete, and hidden from the global "Create" menu.
    actions: (input, context) =>
      fixedTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
    // The global "Create" menu offers the three event starters instead of a blank event.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter(({templateId}) => !hiddenFromCreateMenu.has(templateId))
        : prev,
  },

  plugins: [
    structureTool({structure}),
    // AI Assist: "Generate" / "Improve" on text fields, driven by per-field instructions set in the Studio.
    assist(),
    presentationTool({
      title: 'Visual editing',
      resolve,
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
    }),
  ],
})
