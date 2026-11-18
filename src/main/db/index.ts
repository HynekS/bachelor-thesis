import { app } from 'electron'
import path from 'path'
import { cpSync, existsSync } from 'fs'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { createClient } from '@libsql/client'

const client = createClient({
  url: app.isPackaged
    ? `file:${path.join(app.getPath('userData'), 'database.sqlite')}`
    : `file:${path.join(__dirname, '../../src/main/db/local.db')}`
})
const db = drizzle({ client })

const sourceMigrations = app.isPackaged
  ? path.join(__dirname, './migrations')
  : path.join(__dirname, '../../src/main/db/migrations')

const targetMigrations = path.join(app.getPath('userData'), 'migrations')

export const runMigration = (): void => {
  try {
    if (!existsSync(targetMigrations)) {
      cpSync(sourceMigrations, targetMigrations, { recursive: true })
    }
  } catch (error) {
    console.error('Failed to copy migration files:', error)
  }

  migrate(db, {
    migrationsFolder: targetMigrations,
    migrationsSchema: path.join(__dirname, './schema/index.ts')
  })
}

export default db
