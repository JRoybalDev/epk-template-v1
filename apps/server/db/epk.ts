import { and, eq } from 'drizzle-orm'
import { db } from './client'
import { epks, assets } from './schema'
import type { EPK } from '../../../packages/schema'
import { EPKSchema } from '../../../packages/schema'
import { randomUUID } from 'crypto'

export type AssetType = typeof assets.$inferInsert.type

export const getEPK = async (slug: string): Promise<EPK | null> => {
  const result = await db
    .select()
    .from(epks)
    .where(eq(epks.slug, slug))
    .limit(1)

  if (!result[0]) return null
  return EPKSchema.parse(result[0].content)
}

export const saveEPK = async (slug: string, data: EPK): Promise<void> => {
  const validated = EPKSchema.parse(data)

  await db
    .insert(epks)
    .values({
      slug,
      content: validated,
    })
    .onConflictDoUpdate({
      target: epks.slug,
      set: {
        content: validated,
        updatedAt: new Date(),
      },
    })
}

export const saveAsset = async (
  epkSlug: string,
  type: AssetType,
  filename: string,
  path: string,
) => {
  const result = await db
    .insert(assets)
    .values({
      id: randomUUID(),
      epkSlug,
      type,
      filename,
      path,
    })
    .returning()

  return result[0]
}

export const getAssets = async (epkSlug: string, type?: AssetType) => {
  const filters = type
    ? and(eq(assets.epkSlug, epkSlug), eq(assets.type, type))
    : eq(assets.epkSlug, epkSlug)

  return db.select().from(assets).where(filters)
}
