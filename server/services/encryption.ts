import crypto from 'node:crypto'

// Ensure the ENCRYPTION_KEY is set
const ENCRYPTION_KEY = '12345678901234567890123456789012'
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32)
  throw new Error('ENCRYPTION_KEY must be set and exactly 32 characters long')

const IV_LENGTH = 16 // AES block size

/**
 * Encrypt a string
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH) // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}` // Combine IV and encrypted data
}

/**
 * Decrypt a string
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':')
  if (parts.length !== 2)
    throw new Error('Invalid encrypted text format')

  const iv = Buffer.from(parts[0], 'hex')
  const encrypted = Buffer.from(parts[1], 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString('utf8')
}
