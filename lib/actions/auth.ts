"use server";

import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { headers } from "next/headers";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; resetAt: number }>();

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

async function clientKey(): Promise<string> {
  const list = (await headers()).get("x-forwarded-for");
  const ip = list?.split(",")[0]?.trim();
  return ip || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry) return false;
  if (now >= entry.resetAt) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now >= entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    attempts.set(key, { count: entry.count + 1, resetAt: entry.resetAt });
  }
}

function pruneAttempts(): void {
  if (attempts.size < 1000) return;
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (now >= entry.resetAt) attempts.delete(key);
  }
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const key = await clientKey();
  pruneAttempts();

  if (isRateLimited(key)) {
    return {
      error: "Demasiados intentos. Esperá unos minutos y volvé a intentar.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password.length === 0 || !safeEqual(password, adminPassword)) {
    recordAttempt(key);
    return { error: "Credenciales incorrectas." };
  }

  attempts.delete(key);
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}