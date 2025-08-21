import path from 'path'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

const db = drizzle({ connection: { source: process.env.DATABASE_URL } })

export const runMigration = (): void => {
  console.log(path.join(__dirname, './migrations/'))
  migrate(db, {
    migrationsFolder: path.join(__dirname, './migrations/'),
    migrationsSchema: path.join(__dirname, './schema/index.ts')
  })
}

export default db
