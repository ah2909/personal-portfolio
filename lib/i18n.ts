import { vietnamese } from "./vietnamese";

export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const localeCookie = "portfolio-language";

export function resolveLocale(value?: string): Locale {
  return value === "vi" ? "vi" : "en";
}

export function translator(locale: Locale) {
  return (text: string): string =>
    locale === "vi" && Object.hasOwn(vietnamese, text) ? vietnamese[text] : text;
}

export function searchText(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}
