import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { registeredSlugs } from "@/lib/cities";
import { logout } from "../entrar/actions";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Cadastrar cidade · Mapa do Ceará" };
export const dynamic = "force-dynamic";

// the query param stays in Portuguese because it's part of the public URL
type Props = { searchParams: Promise<{ municipio?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { municipio: initial } = await searchParams;
  if (!(await getSession())) {
    const back = initial ? `/cadastro?municipio=${encodeURIComponent(initial)}` : "/cadastro";
    redirect(`/entrar?voltar=${encodeURIComponent(back)}`);
  }

  const registered = await registeredSlugs();

  return (
    <main className="page">
      <div className="pageHeader">
        <Link href="/" className="backLink">
          ← Voltar ao mapa
        </Link>
        <form action={logout}>
          <button type="submit" className="linkButton">
            Sair
          </button>
        </form>
      </div>
      <h1>Cadastrar cidade</h1>
      <RegisterForm registered={registered} initial={initial} />
    </main>
  );
}
