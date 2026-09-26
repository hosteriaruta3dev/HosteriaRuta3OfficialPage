"use client";

import { useActionState } from "react";
import { Lock, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-brand-900"
        >
          Contraseña de administrador
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none transition-colors placeholder:text-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        {state?.error && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-sand-100 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Lock className="h-4 w-4 animate-pulse" />
            Ingresando…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Ingresar al panel
          </>
        )}
      </button>
    </form>
  );
}