import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_PREFIX = "share_auth_";

export function shareAuthCookieName(token: string) {
  return `${COOKIE_PREFIX}${token}`;
}

export function createShareAuthCookieValue(
  token: string,
  linkId: string,
  secret: string,
) {
  const payload = `${linkId}:${token}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

export function verifyShareAuthCookieValue(
  value: string,
  token: string,
  linkId: string,
  secret: string,
) {
  const parts = value.split(":");
  if (parts.length < 3) return false;
  const sig = parts.pop();
  const cookieToken = parts.pop();
  const cookieLinkId = parts.join(":");
  if (cookieToken !== token || cookieLinkId !== linkId || !sig) return false;

  const expected = createHmac("sha256", secret)
    .update(`${linkId}:${token}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
