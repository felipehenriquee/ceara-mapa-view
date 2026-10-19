"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CearaMap } from "ceara-map";
import type { CityPreview } from "@/lib/cities";
import {
  MUNICIPALITIES_BY_NAME,
  REGION_ORDER,
  REGIONS,
  municipalityHref,
  normalize,
  regionColor,
  type Municipality,
  type RegionKey,
} from "@/lib/municipalities";

type Filter = RegionKey | "registered";

export default function InteractiveMap({ previews }: { previews: Record<string, CityPreview> }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter | null>(null);
  const [hoveredInList, setHoveredInList] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const registered = useMemo(() => new Set(Object.keys(previews)), [previews]);

  const visible = useMemo(() => {
    const term = normalize(search);
    return MUNICIPALITIES_BY_NAME.filter(
      (m) => (!term || normalize(m.name).includes(term)) && (filter !== "registered" || registered.has(m.slug)),
    );
  }, [search, filter, registered]);

  function getFill(municipality: Municipality) {
    if (!filter) return undefined;
    if (filter === "registered") return registered.has(municipality.slug) ? "var(--registered)" : "var(--inactive)";
    return municipality.region === filter ? regionColor(filter) : "var(--inactive)";
  }

  function toggle(key: Filter) {
    setFilter((current) => (current === key ? null : key));
  }

  return (
    <div className="card">
      <div className="toolbar">
        <span className="sectionLabel">Filtrar por região</span>
        <div className="regionLegend">
          {REGION_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              className={`regionButton${filter === key ? " active" : ""}`}
              aria-pressed={filter === key}
              onClick={() => toggle(key)}
            >
              <span className="regionSwatch" style={{ backgroundColor: regionColor(key) }} />
              {REGIONS[key].name}
            </button>
          ))}
          <button
            type="button"
            className={`regionButton${filter === "registered" ? " active" : ""}`}
            aria-pressed={filter === "registered"}
            onClick={() => toggle("registered")}
          >
            <span className="regionSwatch" style={{ backgroundColor: "var(--registered)" }} />
            Com cadastro ({registered.size})
          </button>
        </div>
      </div>

      <div className="mapBody">
        <div className="mapFrame">
          <CearaMap
            getFill={getFill}
            highlighted={hoveredInList}
            getHref={(m) => municipalityHref(m.slug)}
            onClick={(m, event) => {
              event.preventDefault();
              router.push(municipalityHref(m.slug));
            }}
            tooltip={{
              content: (m) => ({ image: previews[m.slug]?.photo, subtitle: previews[m.slug]?.nickname }),
              touch: "first-tap",
            }}
          />
        </div>

        <div className="cityList">
          <div className="searchBar">
            <svg className="searchIcon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="15.3" y1="15.3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Procure por cidade"
              autoComplete="off"
              aria-label="Procure por cidade"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="results">
            <ul className="cityGrid">
              {visible.map((municipality) => (
                <li key={municipality.slug}>
                  <Link
                    href={municipalityHref(municipality.slug)}
                    onMouseEnter={() => setHoveredInList(municipality.slug)}
                    onMouseLeave={() => setHoveredInList(null)}
                    onFocus={() => setHoveredInList(municipality.slug)}
                    onBlur={() => setHoveredInList(null)}
                  >
                    {municipality.name}
                    {registered.has(municipality.slug) && <span className="registeredDot" title="Com cadastro" />}
                  </Link>
                </li>
              ))}
            </ul>
            {visible.length === 0 && <p className="emptyState">Nenhum município encontrado.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
