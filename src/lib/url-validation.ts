import { isIP } from "net";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "metadata.google.internal",
  "169.254.169.254",
]);

function isPrivateIp(hostname: string) {
  if (!isIP(hostname)) return false;
  if (hostname.startsWith("10.")) return true;
  if (hostname.startsWith("192.168.")) return true;
  if (hostname.startsWith("172.")) {
    const second = Number(hostname.split(".")[1]);
    return second >= 16 && second <= 31;
  }
  return hostname === "127.0.0.1" || hostname === "::1";
}

export function validateBookmarkUrl(rawUrl: string) {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host) || isPrivateIp(host) || host.endsWith(".local")) {
    throw new Error("URL is not allowed");
  }

  return url.toString();
}
