import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
} as const;

export function hashSharePassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifySharePassword(password: string, stored: string): boolean {
  if (stored.startsWith("scrypt:")) {
    const [, saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(actual, expected);
  }

  // Legacy plaintext values (migrate on successful verify elsewhere if needed)
  return password === stored;
}
