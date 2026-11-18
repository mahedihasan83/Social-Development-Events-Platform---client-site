
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const authClient = createAuthClient({
 
  baseURL: apiBaseUrl,
  plugins: [jwtClient()],
});

export const { useSession } = authClient;
