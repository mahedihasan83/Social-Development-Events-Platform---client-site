/**
 * BetterAuth instance — email/password + Google social login, persisted in
 * MongoDB via the official MongoDB adapter, with the JWT plugin enabled so
 * the client can obtain a token for calling our protected REST endpoints.
 */

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { client, db } from "./db";

const serverUrl =
  process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";
const isProd = process.env.NODE_ENV === "production";

// Only register Google when credentials exist, so the API boots without them.
const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  appName: "Shohojog",
  baseURL: serverUrl,
  trustedOrigins: [clientUrl],
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    // Assignment rule: min 6 chars with at least one uppercase and one
    // lowercase letter (the character rules are enforced client-side too).
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  socialProviders,

  // In production the client (Vercel) and server (Render) sit on different
  // domains, so the session cookie must be SameSite=None + Secure.
  advanced: {
    useSecureCookies: isProd,
    ...(isProd
      ? { defaultCookieAttributes: { sameSite: "none" as const, secure: true } }
      : {}),
  },

  plugins: [
    jwt({
      jwt: {
        // Tokens live for one hour; the client requests a fresh one when needed.
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? null,
        }),
      },
    }),
  ],
});
