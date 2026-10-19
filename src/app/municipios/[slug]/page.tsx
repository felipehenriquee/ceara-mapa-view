import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CearaMap } from "ceara-map";
import { findCity, formatBirthday, formatNumber, summaryParagraphs } from "@/lib/cities";
import { MUNICIPALITIES, REGIONS, findMunicipality, regionColor } from "@/lib/municipalities";

type Props = { params: Promise<{ slug: string }> };

// city data comes from the database: the page is regenerated at most once an hour
export const revalidate = 3600;

export function generateStaticParams() {
  return MUNICIPALITIES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const municipality = findMunicipality((await params).slug);
  return { title: municipality ? `${municipality.name} · Mapa do Ceará` : "Mapa do Ceará" };
}

export default async function MunicipalityPage({ params }: Props) {
  const municipality = findMunicipality((await params).slug);
  if (!municipality) notFound();

  const city = await findCity(municipality);
  const summary = summaryParagraphs(city?.summary ?? null);
  const area = formatNumber(city?.area ?? null);
  const population = formatNumber(city?.population ?? null);
  const birthday = formatBirthday(city?.birthday ?? null);

  const facts = [
    { label: "Mesorregião", value: REGIONS[municipality.region].name },
    { label: "Microrregião", value: city?.microregion },
    { label: "População", value: population && `${population} hab.` },
    { label: "Área", value: area && `${area} km²` },
    { label: "Aniversário", value: birthday },
    { label: "Limites", value: city?.borders },
  ].filter((fact) => fact.value);

  return (
    <main className="page">
      <Link href="/" className="backLink">
        ← Voltar ao mapa
      </Link>
      <h1>{municipality.name}</h1>
      {city?.nickname && <p className="cityNickname">{city.nickname}</p>}

      <div className="cityLayout">
        <div className="card">
          {city?.photo && (
            // photos live on the portal's S3; a plain <img> avoids configuring domains for next/image
            <img className="cityPhoto" src={city.photo} alt={`Foto de ${municipality.name}`} />
          )}
          <div className="mapFrame mapFrameLarge">
            <CearaMap
              title={`${municipality.name} no mapa do Ceará`}
              fills={{ [municipality.slug]: regionColor(municipality.region) }}
              defaultFill="var(--inactive)"
            />
          </div>
        </div>

        <div className="card cityInfo">
          <dl className="cityFacts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          {summary.length > 0 ? (
            <div className="citySummary">
              {summary.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div className="notRegistered">
              <p className="emptyState">Ainda não há informações cadastradas sobre {municipality.name}.</p>
              {!city && (
                <Link href={`/cadastro?municipio=${municipality.slug}`} className="primaryButton">
                  Cadastrar {municipality.name}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
