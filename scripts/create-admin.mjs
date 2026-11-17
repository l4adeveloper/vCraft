import { readFileSync } from 'node:fs'
import { database, withTransaction } from '../src/server/db.ts'
import { hashPassword } from '../src/server/password.ts'

const email = process.argv[2]?.trim().toLowerCase()
if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error(
    'Usage: npm run admin:create -- admin@example.com (password on stdin)',
  )
  process.exit(1)
}
if (process.stdin.isTTY) {
  console.error('Pass the password on stdin, as shown in README.md.')
  process.exit(1)
}
const password = readFileSync(0, 'utf8').replace(/\r?\n$/, '')
if (password.length < 15 || Buffer.byteLength(password) > 128) {
  console.error(
    'The password must contain at least 15 characters and at most 128 UTF-8 bytes.',
  )
  process.exit(1)
}

const passwordHash = await hashPassword(password)
const db = database()
try {
  await withTransaction(async (client) => {
    const account = await client.query(
      `INSERT INTO accounts (email, password_hash, role) VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = excluded.password_hash
       WHERE accounts.role = 'admin'`,
      [email, passwordHash],
    )
    if (!account.rowCount) {
      throw new Error(
        'This email belongs to a visitor account. Use a separate admin email.',
      )
    }
    await client.query('DELETE FROM sessions WHERE account_email = $1', [email])
  })
  console.log(
    `Admin account ready for ${email}. Existing sessions were revoked.`,
  )
} finally {
  await db.end()
}
