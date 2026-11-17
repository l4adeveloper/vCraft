import { DatabaseSync } from 'node:sqlite'
import { database, withTransaction } from '../src/server/db.ts'

const sourcePath = process.argv[2]
if (!sourcePath) {
  console.error('Usage: npm run db:import-sqlite -- path/to/vcraft.sqlite')
  process.exit(1)
}

const db = database()
try {
  const sqlite = new DatabaseSync(sourcePath, { readOnly: true })
  try {
    sqlite.exec('BEGIN')
    const { admins, quotes } = await withTransaction(async (client) => {
      let admins = 0
      let quotes = 0
      for (const row of sqlite
        .prepare('SELECT email, password_hash FROM admins')
        .iterate()) {
        const result = await client.query(
          `INSERT INTO accounts (email, password_hash, role) VALUES ($1, $2, 'admin')
           ON CONFLICT (email) DO NOTHING`,
          [row.email, row.password_hash],
        )
        admins += result.rowCount
      }
      for (const row of sqlite
        .prepare(
          'SELECT id, created_at, request, status, allocations, version FROM quotes',
        )
        .iterate()) {
        const result = await client.query(
          `INSERT INTO quotes (id, created_at, request, status, allocations, version)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
          [
            row.id,
            row.created_at,
            row.request,
            row.status,
            row.allocations,
            row.version,
          ],
        )
        quotes += result.rowCount
      }
      return { admins, quotes }
    })
    console.log(
      `Imported ${admins} admins and ${quotes} quotes. Imported admins can sign in with their existing passwords.`,
    )
  } finally {
    sqlite.close()
  }
} finally {
  await db.end()
}
