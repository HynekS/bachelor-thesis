import { AnySQLiteColumn, int, sqliteTable, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { project } from './project'
import { node } from './node'

export const edge = sqliteTable(
  'edge',
  {
    id: int().primaryKey({ autoIncrement: true }),
    from: int().references((): AnySQLiteColumn => node.id),
    to: int().references((): AnySQLiteColumn => node.id),
    project_id: int().references((): AnySQLiteColumn => project.id)
  },
  (table) => [unique().on(table.from, table.to, table.project_id)]
)

export const edgeInsertSchema = createInsertSchema(edge)
export const edgeUpdateSchema = createUpdateSchema(edge)
