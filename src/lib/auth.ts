import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

const COOKIE = "map_session";
const DURATION_S = 8 * 60 * 60;

export type Session = { id: number; username: string };

function sign(payload: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set in .env");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Same login as the portal admin panel: `usuarios` table, MD5 passwords. */
export async function authenticate(username: string, password: string): Promise<Session | null> {
  const md5 = createHash("md5").update(password).digest("hex");
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT id, usuario FROM usuarios WHERE usuario = ? AND senha = ? LIMIT 1",
    [username, md5],
  );
  return rows[0] ? { id: rows[0].id, username: rows[0].usuario } : null;
}

export async function createSession(session: Session) {
  const expiresAt = Math.floor(Date.now() / 1000) + DURATION_S;
  const payload = Buffer.from(JSON.stringify({ ...session, expiresAt })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURATION_S,
  });
}

export async function getSession(): Promise<Session | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  const [payload, signature] = value?.split(".") ?? [];
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  const { id, username, expiresAt } = JSON.parse(Buffer.from(payload, "base64url").toString());
  return expiresAt > Date.now() / 1000 ? { id, username } : null;
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
