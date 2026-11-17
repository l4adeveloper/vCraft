import { readFileSync, readdirSync } from 'node:fs'
import { database, withTransaction } from '../src/server/db.ts'

const directory = new URL('../db/', import.meta.url)
const migrations = readdirSync(directory)
  .filter((name) => /^\d+-.+\.sql$/.test(name))
  .sort()
const db = database()
try {
  await withTransaction(async (client) => {
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('vcraft-schema'))",
    )
    await client.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY)',
    )
    const { rows } = await client.query(
      'SELECT filename FROM schema_migrations',
    )
    const applied = new Set(rows.map(({ filename }) => filename))
    for (const filename of migrations) {
      if (applied.has(filename)) continue
      await client.query(readFileSync(new URL(filename, directory), 'utf8'))
      await client.query(
        'INSERT INTO schema_migrations (filename) VALUES ($1)',
        [filename],
      )
    }
  })
  console.log('vCraft PostgreSQL schema is ready.')
} finally {
  await db.end()
}
