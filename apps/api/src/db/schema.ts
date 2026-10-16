import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Optional. Nothing in the API uses the database yet. Replace this example table
// once an integration needs to persist data (e.g. newsletter signups, cached feeds).
export const examples = pgTable('examples', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
