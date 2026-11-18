import { AnySQLiteColumn, int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { project } from './project'
import { node } from './node'

export const edge = sqliteTable(
  'edge',
  {
    from: int()
      .notNull()
      .references((): AnySQLiteColumn => node.id, { onDelete: 'cascade' }),
    to: int()
      .notNull()
      .references((): AnySQLiteColumn => node.id, { onDelete: 'cascade' }),
    project_id: int()
      .notNull()
      .references((): AnySQLiteColumn => project.id, { onDelete: 'cascade' })
  },
  (table) => {
    return [
      primaryKey({
        name: 'edge_pk',
        columns: [table.from, table.to]
      })
    ]
  }
)

export type Edge = typeof edge.$inferSelect

export const edgeInsertSchema = createInsertSchema(edge)
export const edgeUpdateSchema = createUpdateSchema(edge)
