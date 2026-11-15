import { cookies } from "next/headers";
import { localeCookie, resolveLocale, translator } from "./i18n";

export async function getLocale() {
  return resolveLocale((await cookies()).get(localeCookie)?.value);
}

export async function getTranslation() {
  return translator(await getLocale());
}
