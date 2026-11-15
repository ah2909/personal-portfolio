"use client";

import { createContext, useContext, useEffect, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Globe2, LoaderCircle } from "lucide-react";
import { localeCookie, translator, type Locale } from "../lib/i18n";

const LanguageContext = createContext<Locale>("en");

export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <LanguageContext.Provider value={locale}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return translator(useContext(LanguageContext));
}

export function LanguageSwitcher() {
  const locale = useContext(LanguageContext);
  const t = translator(locale);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="language-switcher" role="group" aria-label={t("Language")} aria-busy={pending}>
      <span className="language-icon" aria-hidden="true">
        {pending ? <LoaderCircle size={15} className="language-spinner" /> : <Globe2 size={15} />}
      </span>
      <div className="language-options">
        {(["en", "vi"] as const).map((next) => (
          <button
            key={next}
            type="button"
            value={next}
            lang={next}
            aria-label={next === "en" ? "English" : "Tiếng Việt"}
            aria-pressed={locale === next}
            disabled={pending}
            onClick={() => {
              if (next === locale) return;
              document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
              startTransition(() => router.refresh());
            }}
          >
            {next.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
