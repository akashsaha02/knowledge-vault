const LOCAL_DEV_ORIGIN = "http://localhost:8000";

type Env = Record<string, string | undefined>;

function isLocalhostOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function normalizeOrigin(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const href = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    return new URL(href).origin;
  } catch {
    return undefined;
  }
}

function hostedOrigin(env: Env): string | undefined {
  return (
    normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL) ??
    (env.VERCEL_URL ? normalizeOrigin(`https://${env.VERCEL_URL}`) : undefined)
  );
}

function shouldIgnoreLocalhostEnv(env: Env): boolean {
  return env.NODE_ENV === "production" || Boolean(env.VERCEL_ENV);
}

function usableConfiguredOrigin(
  value: string | undefined,
  env: Env,
): string | undefined {
  const origin = normalizeOrigin(value);
  if (!origin) return undefined;
  if (shouldIgnoreLocalhostEnv(env) && isLocalhostOrigin(origin)) {
    return undefined;
  }
  return origin;
}

/** Canonical origin for the auth server (cookies, OAuth, reset links). */
export function getAuthBaseUrl(env: Env = process.env): string {
  return (
    usableConfiguredOrigin(env.BETTER_AUTH_URL, env) ??
    usableConfiguredOrigin(env.APP_URL, env) ??
    hostedOrigin(env) ??
    LOCAL_DEV_ORIGIN
  );
}

/** Origins allowed to call `/api/auth`. */
export function getTrustedOrigins(env: Env = process.env): string[] {
  const origins = new Set<string>();
  const add = (value?: string) => {
    const origin = normalizeOrigin(value);
    if (origin) origins.add(origin);
  };

  add(usableConfiguredOrigin(env.BETTER_AUTH_URL, env));
  add(usableConfiguredOrigin(env.APP_URL, env));
  add(hostedOrigin(env));
  add(getAuthBaseUrl(env));

  if (!shouldIgnoreLocalhostEnv(env)) {
    add(LOCAL_DEV_ORIGIN);
  }

  return [...origins];
}

/**
 * Browser calls must use the page origin. Server env like `APP_URL` is not
 * available in the client bundle, and must not be inlined with `NEXT_PUBLIC_`.
 */
export function getBrowserAuthBaseUrl(
  env: Env = process.env,
  locationOrigin?: string,
): string {
  const origin =
    locationOrigin ??
    (typeof window !== "undefined" ? window.location.origin : undefined);

  if (origin) return origin;
  return getAuthBaseUrl(env);
}
