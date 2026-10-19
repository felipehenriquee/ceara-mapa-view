import Link from "next/link";
import InteractiveMap from "@/components/InteractiveMap";
import { listCityPreviews } from "@/lib/cities";

// registered cities come from the database; registering a city also revalidates this page right away
export const revalidate = 3600;

export default async function Home() {
  const previews = await listCityPreviews();

  return (
    <main className="page">
      <div className="pageHeader">
        <h1>Mapa do Ceará</h1>
        <Link href="/cadastro" className="primaryButton">
          Cadastrar cidade
        </Link>
      </div>
      <InteractiveMap previews={previews} />
    </main>
  );
}
