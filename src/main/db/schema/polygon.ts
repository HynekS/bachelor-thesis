import { AnySQLiteColumn, int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { project } from './project'

export const polygon = sqliteTable(
  'polygon',
  {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text(),
    project_id: int().references((): AnySQLiteColumn => project.id)
  },
  (table) => [unique().on(table.title, table.project_id)]
)

export const polygonInsertSchema = createInsertSchema(polygon)
export const polygonUpdateSchema = createUpdateSchema(polygon)
