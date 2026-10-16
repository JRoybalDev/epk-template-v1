import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Serverless functions get a fresh process per invocation (or a handful of warm ones),
// so keep at most one connection each rather than a large local pool. `prepare: false`
// is required when DATABASE_URL points at a transaction-mode pooler (e.g. Neon/Supabase
// pgbouncer), which can't hold prepared statements across pooled connections. Both
// settings are harmless against a normal, non-pooled local Postgres too.
const sql = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: process.env.VERCEL ? 1 : 10,
})
export const db = drizzle(sql, { schema })
