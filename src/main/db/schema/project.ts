import { sql } from 'drizzle-orm'
import { AnySQLiteColumn, int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const project = sqliteTable('project', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  country: text(),
  region: text(),
  city: text(),
  district: text(),
  created_at: text('created_at')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull()
})

export const projectInsertSchema = createInsertSchema(project)
export const projectUpdateSchema = createUpdateSchema(project)

export type Project = typeof project.$inferSelect
