import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bootstrapPersonalWorkspace } from "@/features/workspaces/workspace.service";
import { db } from "@/lib/db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? "development-secret-change-me",
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000",

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      ),
    },
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await bootstrapPersonalWorkspace(user.id, user.name || "User");
        },
      },
    },
  },

  plugins: [nextCookies()],
});
