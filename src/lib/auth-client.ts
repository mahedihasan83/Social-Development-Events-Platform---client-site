/**
 * BetterAuth client — talks to the Express API (`/api/auth/*`).
 *
 * The jwtClient plugin adds `authClient.token()` which fetches the JWT we
 * attach to protected API calls (see src/lib/api.ts).
 */

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const authClient = createAuthClient({
  /** Base URL of the Express server (not the Next.js app). */
  baseURL: apiBaseUrl,
  plugins: [jwtClient()],
});

export const { useSession } = authClient;
