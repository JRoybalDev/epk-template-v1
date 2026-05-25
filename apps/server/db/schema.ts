import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import type { EPK } from '../../../packages/schema'

export const epks = pgTable('epks', {
  slug: text('slug').primaryKey(),
  content: jsonb('content').notNull().$type<EPK>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const assets = pgTable('assets', {
  id: text('id').primaryKey(),
  epkSlug: text('epk_slug').notNull().references(() => epks.slug, { onDelete: 'cascade' }),
  type: text('type', { enum: ['photos', 'branding', 'assets'] }).notNull(),
  filename: text('filename').notNull(),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
