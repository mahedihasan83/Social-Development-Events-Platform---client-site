

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const TOKEN_TTL_MS = 10 * 60 * 1000; 
let cachedToken: { value: string; fetchedAt: number } | null = null;

export function clearTokenCache() {
  cachedToken = null;
}

async function getJwt(): Promise<string | null> {
  if (cachedToken && Date.now() - cachedToken.fetchedAt < TOKEN_TTL_MS) {
    return cachedToken.value;
  }
  try {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      return null;
    }
    cachedToken = { value: data.token, fetchedAt: Date.now() };
    return data.token;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
 
  auth?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth) {
    const token = await getJwt();
    if (!token) {
      throw new ApiError("You need to be logged in to do that.", 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      credentials: "include", 
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Is the API running?",
      0
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok) {
    if (response.status === 401) {
      clearTokenCache(); 
    }
    throw new ApiError(
      payload?.error ?? `Request failed with status ${response.status}.`,
      response.status
    );
  }

  return payload as T;
}
