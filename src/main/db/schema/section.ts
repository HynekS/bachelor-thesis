import { AnySQLiteColumn, int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { project } from './project'

export const section = sqliteTable(
  'section',
  {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text(),
    project_id: int().references((): AnySQLiteColumn => project.id, { onDelete: 'cascade' })
  },
  (table) => [unique().on(table.title, table.project_id)]
)

export const sectionInsertSchema = createInsertSchema(section)
export const sectionUpdateSchema = createUpdateSchema(section)
