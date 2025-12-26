import { AnySQLiteColumn, int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { project } from './project'

export const node = sqliteTable(
  'node',
  {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    project_id: int()
      .notNull()
      .references((): AnySQLiteColumn => project.id, { onDelete: 'cascade' })
  },
  (table) => [unique().on(table.title, table.project_id)]
)

export type Node = typeof node.$inferSelect

export const nodeInsertSchema = createInsertSchema(node)
export const nodeUpdateSchema = createUpdateSchema(node)
