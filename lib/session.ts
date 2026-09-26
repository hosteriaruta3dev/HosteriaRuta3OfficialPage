import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 días

interface AdminPayload {
  role: "admin";
}

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET no está configurada en el entorno.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<AdminPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin" ? { role: "admin" } : null;
  } catch {
    return null;
  }
}

/** Verifies a token coming from the request object (used by proxy.ts). */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}