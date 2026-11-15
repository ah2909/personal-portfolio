"use client";

import { LanguageSwitcher, useTranslation } from "./language-provider";
import { ArrowUpRight, Asterisk, ArrowUp } from "lucide-react";
import { profile } from "../lib/profile";

export function Header({
  admin = false,
  projectCount,
}: {
  admin?: boolean;
  projectCount?: number;
}) {
  const t = useTranslation();
  return (
    <header className="site-header wrap">
      <a href="/" className="wordmark" aria-label={`${profile.name} — ${t("Home page")}`}>
        h<span className="brand-dot">.</span>
        <span className="wordmark-label">
          {profile.name.toUpperCase()}
          <br />
          {t("PERSONAL PROJECT LAB")}
        </span>
      </a>
      <nav aria-label={t("Main navigation")}>
        <a href="/#work">
          {t("Selected work")}{" "}
          {projectCount !== undefined && (
            <span className="nav-index">
              {String(projectCount).padStart(2, "0")}
            </span>
          )}
        </a>
        <a href="/#about">
          {t("About")}
        </a>
        <a
          className="nav-contact"
          href={admin ? "/" : `mailto:${profile.email}`}
        >
          {admin ? t("View portfolio") : t("Let’s connect")}
          <ArrowUpRight size={16} aria-hidden />
        </a>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}

export function Footer() {
  const t = useTranslation();
  return (
    <footer className="site-footer wrap" id="connect">
      <div className="footer-top">
        <div>
          <span className="eyebrow">
            {t("ALWAYS BUILDING SOMETHING")}
          </span>
          <h2>
            {t("Good ideas deserve")}
            <br />
            {t("to become")} <em>
              {t("real things.")}
            </em>
          </h2>
          <div className="footer-contact">
            <a className="text-link" href={`mailto:${profile.email}`}>
              {t("Let’s talk")} <ArrowUpRight size={16} aria-hidden />
            </a>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>
        <Asterisk className="footer-star" strokeWidth={1} aria-hidden />
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name} {t("· Built with curiosity.")}
        </span>
        <div>
          <a href="/admin">
            {t("Project admin")} <ArrowUpRight size={14} aria-hidden />
          </a>
          <a href="#top">
            {t("Back to top")} <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
