import { createAuthClient } from "better-auth/react";
import { getBrowserAuthBaseUrl } from "@/lib/auth-url";

export const authClient = createAuthClient({
  baseURL: getBrowserAuthBaseUrl(),
});
