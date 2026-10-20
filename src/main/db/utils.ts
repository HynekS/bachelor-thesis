import { SQL, sql } from 'drizzle-orm'
import { SQLiteColumn } from 'drizzle-orm/sqlite-core'

export const lower = (column: SQLiteColumn): SQL => {
  return sql`(lower(${column}))`
}
