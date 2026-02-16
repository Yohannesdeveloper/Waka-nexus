"use server";

import { cookies } from "next/headers";
import { type Locale, locales, defaultLocale } from "./config";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();

  // Validate locale
  const validLocale = locales.includes(locale) ? locale : defaultLocale;

  cookieStore.set("NEXT_LOCALE", validLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;

  return locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
}
