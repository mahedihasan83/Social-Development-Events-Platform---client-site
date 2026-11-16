/**
 * JWT authentication middleware.
 *
 * The client fetches a short-lived JWT from BetterAuth's `/api/auth/token`
 * endpoint and sends it as `Authorization: Bearer <token>`. We verify the
 * signature against BetterAuth's JWKS endpoint (`/api/auth/jwks`) — no
 * database lookup needed, exactly like the BetterAuth docs describe.
 */

import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AuthedUser } from "../types";

const serverUrl =
  process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;

// JWKS keys are cached indefinitely by jose; `kid` mismatches trigger a refetch.
const JWKS = createRemoteJWKSet(new URL(`${serverUrl}/api/auth/jwks`));

async function verifyBearerToken(header: string | undefined) {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  if (!token) return null;

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: serverUrl, // must match BetterAuth baseURL
    audience: serverUrl, // BetterAuth sets audience = baseURL by default
  });

  if (typeof payload.id !== "string" || typeof payload.email !== "string") {
    return null;
  }

  const user: AuthedUser = {
    id: payload.id,
    email: payload.email,
    name: typeof payload.name === "string" ? payload.name : payload.email,
    image: typeof payload.image === "string" ? payload.image : null,
  };
  return user;
}

/** 401s unless the request carries a valid JWT. Use on protected routes. */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await verifyBearerToken(req.headers.authorization);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication required. Please log in to continue." });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      error: "Your session has expired. Please log in again.",
    });
  }
}

/** Attaches `req.user` when a valid JWT is present, but never rejects. */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    req.user = (await verifyBearerToken(req.headers.authorization)) ?? undefined;
  } catch {
    req.user = undefined;
  }
  next();
}
