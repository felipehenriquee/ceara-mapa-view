import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Entrar · Mapa do Ceará" };

// the query param stays in Portuguese because it's part of the public URL
type Props = { searchParams: Promise<{ voltar?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { voltar: redirectTo = "/cadastro" } = await searchParams;

  return (
    <main className="page pageNarrow">
      <Link href="/" className="backLink">
        ← Voltar ao mapa
      </Link>
      <h1>Entrar</h1>
      <div className="card">
        <p className="helpText">Use o mesmo usuário e senha do painel do portal Ceará Hoje.</p>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
