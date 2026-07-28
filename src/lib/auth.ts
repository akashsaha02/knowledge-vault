import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bootstrapPersonalWorkspace } from "@/features/workspaces/workspace.service";
import { getAuthSecret } from "@/lib/auth-secret";
import { sendEmail } from "@/lib/email";
import { BRAND_NAME } from "@/lib/brand";
import { db } from "@/lib/db";

export const auth = betterAuth({
  secret: getAuthSecret(),
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:8000",

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: `Reset your ${BRAND_NAME} password`,
        text: [
          `Hi ${user.name || "there"},`,
          "",
          `We received a request to reset your ${BRAND_NAME} password.`,
          `Use this link to choose a new password:`,
          url,
          "",
          "If you did not request this, you can ignore this email.",
        ].join("\n"),
      });
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
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
    process.env.BETTER_AUTH_URL ?? "http://localhost:8000",
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:8000",
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await bootstrapPersonalWorkspace(user.id, user.name || "User");
          } catch (error) {
            console.error("Failed to bootstrap personal workspace:", error);
          }
        },
      },
    },
  },

  plugins: [nextCookies()],
});
