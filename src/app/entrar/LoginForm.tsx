"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="form">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="field">
        <span>Usuário</span>
        <input name="username" autoComplete="username" required />
      </label>
      <label className="field">
        <span>Senha</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && (
        <p className="errorMessage" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="primaryButton" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
