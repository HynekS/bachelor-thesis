import { AnySQLiteColumn, int, sqliteTable, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { project } from './project'
import { node } from './node'

export const edge = sqliteTable(
  'edge',
  {
    id: int().primaryKey({ autoIncrement: true }),
    from: int()
      .notNull()
      .references((): AnySQLiteColumn => node.id),
    to: int()
      .notNull()
      .references((): AnySQLiteColumn => node.id),
    project_id: int()
      .notNull()
      .references((): AnySQLiteColumn => project.id, { onDelete: 'cascade' })
  },
  (table) => [unique().on(table.from, table.to, table.project_id)]
)

export const edgeInsertSchema = createInsertSchema(edge)
export const edgeUpdateSchema = createUpdateSchema(edge)
