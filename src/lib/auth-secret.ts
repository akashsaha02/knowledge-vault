export function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("BETTER_AUTH_SECRET is required in production");
  }
  return secret || "development-secret-change-me";
}
