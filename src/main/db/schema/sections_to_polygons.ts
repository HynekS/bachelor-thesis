import { AnySQLiteColumn, int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { polygon } from './polygon'
import { section } from './section'

export const sectionsToPolygons = sqliteTable(
  'sections_to_polygons',
  {
    polygon_id: int()
      .notNull()
      .references((): AnySQLiteColumn => polygon.id),
    section_id: int()
      .notNull()
      .references((): AnySQLiteColumn => section.id)
  },
  (table) => {
    return [
      primaryKey({
        name: 'sections_to_polygons_pk',
        columns: [table.polygon_id, table.section_id]
      })
    ]
  }
)

export const sectionInsertSchema = createInsertSchema(sectionsToPolygons)
export const sectionUpdateSchema = createUpdateSchema(sectionsToPolygons)
