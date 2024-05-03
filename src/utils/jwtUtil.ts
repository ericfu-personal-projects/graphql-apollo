import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const jwtSecret: string = process.env.JWT_SECRET || 'mysecret';
const jwtExpiry: string = process.env.JWT_EXPIRY || '12h';
const issuer: string = process.env.JWT_ISSUER || 'zhongyi';

export function getToken(email: string, _id: string): string {
  return jwt.sign({ iss: issuer, email, userId: _id }, jwtSecret, { expiresIn: jwtExpiry });
}

export function getHashedPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
}

export function getSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function verifyToken(token: string): any {
  return jwt.verify(token, jwtSecret);
}
