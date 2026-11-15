"use client";

import { useTranslation } from "../components/language-provider";
import { Header } from "../components/site-shell";

export default function NotFound() {
  const t = useTranslation();
  return (
    <>
      <Header />
      <main id="main" className="wrap error-page">
        <span className="eyebrow">
          {t("404 / A SMALL DETOUR")}
        </span>
        <h1>
          {t("Nothing built")}
          <br />
          {t("here. Yet.")}
        </h1>
        <p>
          {t("This project may be a draft, removed, or at another address.")}
        </p>
        <a className="button button-dark" href="/#work">
          {t("Back to the projects")}
        </a>
      </main>
    </>
  );
}
