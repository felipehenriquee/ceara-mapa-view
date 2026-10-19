"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CITIES_CACHE_TAG, CityAlreadyRegistered, insertCity } from "@/lib/cities";
import { findMunicipality, municipalityHref } from "@/lib/municipalities";

export type RegisterState = { error?: string; fields?: Record<string, string> };

function integerBetween(value: string, min: number, max: number) {
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

export async function registerCity(_state: RegisterState, form: FormData): Promise<RegisterState> {
  if (!(await getSession())) redirect("/entrar?voltar=/cadastro");

  const fields = Object.fromEntries(
    [...form.entries()].map(([name, value]) => [name, typeof value === "string" ? value.trim() : ""]),
  );
  const fail = (error: string) => ({ error, fields });

  const municipality = findMunicipality(fields.municipality ?? "");
  if (!municipality) return fail("Escolha o município no mapa ou na lista.");

  const birthdayDay = fields.birthdayDay ? integerBetween(fields.birthdayDay, 1, 31) : null;
  const birthdayMonth = fields.birthdayMonth ? integerBetween(fields.birthdayMonth, 1, 12) : null;
  if ((fields.birthdayDay || fields.birthdayMonth) && !(birthdayDay && birthdayMonth)) {
    return fail("Informe dia (1 a 31) e mês do aniversário, ou deixe os dois em branco.");
  }
  if (fields.population && !/^\d+$/.test(fields.population)) {
    return fail("População deve ser um número inteiro, sem pontos (ex.: 131050).");
  }
  if (fields.area && !/^\d+([.,]\d+)?$/.test(fields.area)) {
    return fail("Área deve ser um número em km² (ex.: 1138.15).");
  }
  if (fields.photo && !/^https?:\/\//i.test(fields.photo)) {
    return fail("O link da foto deve começar com http:// ou https://.");
  }

  try {
    await insertCity({
      municipality,
      nickname: fields.nickname ?? "",
      summary: fields.summary ?? "",
      area: (fields.area ?? "").replace(",", "."),
      borders: fields.borders ?? "",
      population: fields.population ?? "",
      birthdayDay,
      birthdayMonth,
      microregion: fields.microregion ?? "",
      photo: fields.photo ?? "",
    });
  } catch (error) {
    if (error instanceof CityAlreadyRegistered) return fail(error.message);
    console.error("Failed to register city:", error);
    return fail("Não foi possível salvar no banco. Tente de novo.");
  }

  revalidateTag(CITIES_CACHE_TAG);
  revalidatePath("/");
  revalidatePath(municipalityHref(municipality.slug));
  redirect(municipalityHref(municipality.slug));
}
