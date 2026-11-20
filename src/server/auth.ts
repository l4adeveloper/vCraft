import { createHash, randomBytes } from 'node:crypto'
import {
  getCookie,
  getRequestIP,
  setCookie,
} from '@tanstack/react-start/server'
import { database, withTransaction } from './db'
import { hashPassword, verifyPassword } from './password'
import type { AccountRole, ArtisanStatus, SignupRole } from '#/lib/account'
import type { PoolClient } from 'pg'

const SECURE = process.env.NODE_ENV === 'production'
const COOKIE = SECURE ? '__Host-vcraft_session' : 'vcraft_session'
const MAX_AGE = 8 * 60 * 60
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: SECURE,
  sameSite: 'strict',
  path: '/',
} as const
const WINDOW_MS = 10 * 60_000
const MAX_ATTEMPTS = 12
const attempts = new Map<string, { count: number; until: number }>()
let nextCleanup = 0
let verifying = 0

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function currentToken() {
  const token = getCookie(COOKIE)
  return token && /^[a-f0-9]{64}$/.test(token) ? hashToken(token) : undefined
}

type Account = {
  email: string
  displayName: string | null
  role: AccountRole
  artisanStatus: ArtisanStatus | null
}

export async function currentAccount() {
  const token = currentToken()
  if (!token) return null
  const { rows } = await database().query<Account>(
    `SELECT accounts.email, accounts.display_name AS "displayName", accounts.role,
            accounts.artisan_status AS "artisanStatus"
     FROM accounts JOIN sessions ON sessions.account_email = accounts.email
     WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP`,
    [token],
  )
  return rows.at(0) ?? null
}

export async function currentAdmin() {
  const account = await currentAccount()
  return account?.role === 'admin' ? { email: account.email } : null
}

function beginPasswordAttempt() {
  const ip = getRequestIP() ?? 'unknown'
  const now = Date.now()

  if (now >= nextCleanup) {
    for (const [key, attempt] of attempts) {
      if (attempt.until <= now) attempts.delete(key)
    }
    nextCleanup = now + WINDOW_MS
  }
  const current = attempts.get(ip)
  const attempt =
    current && current.until > now
      ? current
      : { count: 0, until: now + WINDOW_MS }
  if (attempt.count >= MAX_ATTEMPTS || verifying >= 2) return null
  attempt.count += 1
  attempts.set(ip, attempt)

  verifying += 1
  return ip
}

async function issueSession(client: PoolClient, email: string) {
  const old = currentToken()
  if (old)
    await client.query('DELETE FROM sessions WHERE token_hash = $1', [old])
  await client.query(
    'DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP',
  )

  const token = randomBytes(32).toString('hex')
  await client.query(
    `INSERT INTO sessions (token_hash, account_email, expires_at)
     VALUES ($1, $2, CURRENT_TIMESTAMP + ($3::integer * interval '1 second'))`,
    [hashToken(token), email, MAX_AGE],
  )
  return token
}

function setSessionCookie(token: string) {
  setCookie(COOKIE, token, { ...COOKIE_OPTIONS, maxAge: MAX_AGE })
}

export async function signIn(email: string, password: string) {
  const ip = beginPasswordAttempt()
  if (!ip) return 'limited'

  let hash: string | undefined
  try {
    const { rows } = await database().query<{ password_hash: string }>(
      'SELECT password_hash FROM accounts WHERE email = $1',
      [email],
    )
    hash = rows.at(0)?.password_hash
    if (!(await verifyPassword(password, hash))) return 'invalid'
  } finally {
    verifying -= 1
  }

  const session = await withTransaction(async (client) => {
    // Keep the account locked until its new session has been stored.
    const { rows } = await client.query<Pick<Account, 'role'>>(
      'SELECT role FROM accounts WHERE email = $1 AND password_hash = $2 FOR UPDATE',
      [email, hash],
    )
    const account = rows.at(0)
    if (!account) return null
    return { role: account.role, token: await issueSession(client, email) }
  })
  if (!session) return 'invalid'

  attempts.delete(ip)
  setSessionCookie(session.token)
  return session.role
}

export async function signUp(
  email: string,
  name: string,
  password: string,
  role: SignupRole,
) {
  if (beginPasswordAttempt() === null) return 'limited'

  let hash: string
  try {
    hash = await hashPassword(password)
  } finally {
    verifying -= 1
  }
  const token = await withTransaction(async (client) => {
    const inserted = await client.query(
      `INSERT INTO accounts (email, display_name, password_hash, role, artisan_status)
       VALUES ($1, $2, $3, $4, CASE WHEN $4 = 'artisan' THEN 'pending' END)
       ON CONFLICT (email) DO NOTHING`,
      [email, name, hash, role],
    )
    return inserted.rowCount ? await issueSession(client, email) : null
  })
  if (!token) return 'unavailable'
  setSessionCookie(token)
  return 'ok'
}

export async function signOut() {
  const token = currentToken()
  if (token)
    await database().query('DELETE FROM sessions WHERE token_hash = $1', [
      token,
    ])
  setCookie(COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 })
}
