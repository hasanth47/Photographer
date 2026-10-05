"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label htmlFor="username" className="label block text-muted">
          Username
        </label>
        <input id="username" name="username" type="text" required autoComplete="username" className="field" />
      </div>

      <div>
        <label htmlFor="password" className="label block text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-solid label w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
