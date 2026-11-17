import pg from 'pg'
import type { Pool, PoolClient } from 'pg'

let pool: Pool | undefined

export function database() {
  if (pool) return pool

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Set DATABASE_URL to the vCraft PostgreSQL connection URL.')
  }
  pool = new pg.Pool({ connectionString, connectionTimeoutMillis: 5000 })
  pool.on('error', (error) => {
    console.error('PostgreSQL idle connection failed:', error.message)
  })
  return pool
}

export async function withTransaction<T>(
  run: (client: PoolClient) => Promise<T>,
) {
  const client = await database().connect()
  let discard = false
  try {
    await client.query('BEGIN')
    const result = await run(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {
      discard = true
    }
    throw error
  } finally {
    client.release(discard)
  }
}
