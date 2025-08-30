// Utility classification and normalization helpers

export const USER_ID = process.env.USER_ID || "john_doe_17091999";
export const EMAIL = process.env.EMAIL || "john@xyz.com";
export const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

export const isIntegerString = (s) => /^[+-]?\d+$/.test(s);
export const isAlphaOnly = (s) => /^[A-Za-z]+$/.test(s);
export const isSpecialChar = (s) => s.length === 1 && !isIntegerString(s) && !isAlphaOnly(s);

export function normalizeCandidate(value) {
  if (typeof value === "number") {
    if (Number.isFinite(value) && Number.isInteger(value)) return value.toString();
    return null;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    if (s.length === 1) {
      if (isIntegerString(s) || isAlphaOnly(s) || isSpecialChar(s)) return s;
    } else if (isIntegerString(s) || isAlphaOnly(s)) {
      return s;
    }
    return null;
  }
  if (typeof value === "bigint") return value.toString();
  return null;
}
