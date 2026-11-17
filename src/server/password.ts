import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const SCRYPT = { N: 2 ** 17, r: 8, p: 1, maxmem: 160 * 1024 * 1024 }

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, SCRYPT, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const key = await derive(password, salt)
  return `${salt.toString('hex')}:${key.toString('hex')}`
}

export async function verifyPassword(password: string, hash?: string) {
  const [salt, key] = hash?.split(':') ?? []
  const actual = await derive(
    password,
    salt ? Buffer.from(salt, 'hex') : Buffer.alloc(16),
  )
  return key ? timingSafeEqual(actual, Buffer.from(key, 'hex')) : false
}
