import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/main/db/migrations',
  schema: './src/main/db/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: `./src/main/db/local.db`
  }
})
