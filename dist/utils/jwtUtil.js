import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const jwtSecret = process.env.JWT_SECRET || 'mysecret';
const jwtExpiry = process.env.JWT_EXPIRY || '12h';
const issuer = process.env.JWT_ISSUER || 'zhongyi';
export function getToken(email, _id) {
    return jwt.sign({ iss: issuer, email, userId: _id }, jwtSecret, { expiresIn: jwtExpiry });
}
export function getHashedPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
}
export function getSalt() {
    return crypto.randomBytes(16).toString('hex');
}
export function verifyToken(token) {
    return jwt.verify(token, jwtSecret);
}
