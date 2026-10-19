"use client";

import { useActionState, useState } from "react";
import { CearaMap } from "ceara-map";
import {
  MUNICIPALITIES_BY_NAME,
  REGIONS,
  findMunicipality,
  regionColor,
  type Municipality,
} from "@/lib/municipalities";
import { registerCity, type RegisterState } from "./actions";

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

type Props = { registered: string[]; initial?: string };

export default function RegisterForm({ registered, initial }: Props) {
  const isRegistered = new Set(registered);
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerCity, {});
  const [selected, setSelected] = useState(initial && !isRegistered.has(initial) ? initial : "");

  const municipality = findMunicipality(selected);
  const value = (field: string) => state.fields?.[field] ?? "";

  function getFill(m: Municipality) {
    if (m.slug === selected) return regionColor(m.region);
    if (isRegistered.has(m.slug)) return "var(--inactive)";
    return undefined;
  }

  function select(m: Municipality) {
    if (!isRegistered.has(m.slug)) setSelected(m.slug);
  }

  return (
    <form action={action} className="registerLayout">
      <div className="card">
        <span className="sectionLabel">1. Escolha o município</span>
        <select
          name="municipality"
          className="select"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          required
        >
          <option value="">Selecione…</option>
          {MUNICIPALITIES_BY_NAME.map((m) => (
            <option key={m.slug} value={m.slug} disabled={isRegistered.has(m.slug)}>
              {m.name}
              {isRegistered.has(m.slug) ? " (já cadastrado)" : ""}
            </option>
          ))}
        </select>
        <div className="mapFrame mapFrameLarge">
          <CearaMap
            getFill={getFill}
            onClick={select}
            tooltip={{ content: (m) => ({ subtitle: isRegistered.has(m.slug) ? "Já cadastrado" : "Clique para escolher" }) }}
            title="Clique no município"
          />
        </div>
        <p className="helpText">
          {municipality
            ? `${municipality.name} · ${REGIONS[municipality.region].name}`
            : "Clique no mapa ou use a lista. Municípios em cinza já têm cadastro."}
        </p>
      </div>

      <div className="card">
        <span className="sectionLabel">2. Informações da cidade</span>
        <div className="form">
          <label className="field">
            <span>Apelido</span>
            <input name="nickname" placeholder="Ex.: Terra da Luz" defaultValue={value("nickname")} />
          </label>
          <div className="fieldRow">
            <label className="field">
              <span>População</span>
              <input name="population" inputMode="numeric" placeholder="Ex.: 131050" defaultValue={value("population")} />
            </label>
            <label className="field">
              <span>Área (km²)</span>
              <input name="area" inputMode="decimal" placeholder="Ex.: 1138.15" defaultValue={value("area")} />
            </label>
          </div>
          <div className="fieldRow">
            <label className="field">
              <span>Aniversário (dia)</span>
              <input name="birthdayDay" type="number" min={1} max={31} defaultValue={value("birthdayDay")} />
            </label>
            <label className="field">
              <span>Aniversário (mês)</span>
              <select name="birthdayMonth" className="select" defaultValue={value("birthdayMonth")}>
                <option value="">—</option>
                {MONTHS.map((month, i) => (
                  <option key={month} value={i + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Microrregião</span>
            <input name="microregion" placeholder="Ex.: Cariri" defaultValue={value("microregion")} />
          </label>
          <label className="field">
            <span>Limites</span>
            <textarea name="borders" rows={2} placeholder="Ao norte: …; ao sul: …" defaultValue={value("borders")} />
          </label>
          <label className="field">
            <span>Link da foto</span>
            <input name="photo" type="url" placeholder="https://…" defaultValue={value("photo")} />
          </label>
          <label className="field">
            <span>Resumo</span>
            <textarea
              name="summary"
              rows={8}
              placeholder="Separe os parágrafos com uma linha em branco."
              defaultValue={value("summary")}
            />
          </label>
          {state.error && (
            <p className="errorMessage" role="alert">
              {state.error}
            </p>
          )}
          <button type="submit" className="primaryButton" disabled={pending || !municipality}>
            {pending ? "Salvando…" : municipality ? `Cadastrar ${municipality.name}` : "Escolha um município"}
          </button>
        </div>
      </div>
    </form>
  );
}
