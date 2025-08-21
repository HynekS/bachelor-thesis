import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/main/db/migrations',
  schema: './src/main/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
