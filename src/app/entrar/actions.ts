"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession, endSession } from "@/lib/auth";

export type LoginState = { error?: string };

// only internal paths are accepted, so the login can't be used as an open redirect
function safeRedirectTarget(value: FormDataEntryValue | null) {
  const target = typeof value === "string" ? value : "";
  return target.startsWith("/") && !target.startsWith("//") ? target : "/cadastro";
}

export async function login(_state: LoginState, form: FormData): Promise<LoginState> {
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "Informe usuário e senha." };

  let session;
  try {
    session = await authenticate(username, password);
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Não foi possível conectar ao banco. Tente de novo em instantes." };
  }
  if (!session) return { error: "Usuário ou senha incorretos." };

  await createSession(session);
  redirect(safeRedirectTarget(form.get("redirectTo")));
}

export async function logout() {
  await endSession();
  redirect("/");
}
