"use client";

import { useTranslation } from "../components/language-provider";

export default function ErrorPage({ reset }: { reset: () => void; }) {
  const t = useTranslation();
  return (
    <main id="main" className="wrap error-page">
      <span className="eyebrow">
        {t("A SMALL INTERRUPTION")}
      </span>
      <h1>
        {t("Let’s try")}
        <br />
        {t("that again.")}
      </h1>
      <p>
        {t("The project collection could not be loaded. Your saved work is unchanged.")}
      </p>
      <button type="button" className="button button-dark" onClick={reset}>
        {t("Try again")}
      </button>
    </main>
  );
}
