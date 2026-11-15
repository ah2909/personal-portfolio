import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "./globals.css";
import "./project-case-study.css";
import "./commerce-case-study.css";
import { profile } from "../lib/profile";
import { getLocale } from "../lib/i18n-server";
import { translator } from "../lib/i18n";
import { LanguageProvider } from "../components/language-provider";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: {
      default: `${profile.name} — ${locale === "vi" ? "Ý tưởng thành hiện thực." : "Ideas, made real."}`,
      template: `%s — ${profile.name}`,
    },
    description:
      locale === "vi"
        ? "Không gian dự án cá nhân. Khám phá Cryptofolio, nền tảng E-Commerce đa cửa hàng và tư duy phía sau sản phẩm."
        : "A personal project lab. Explore Cryptofolio, a multi-store E-Commerce platform, and the thinking behind the build.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = translator(locale);
  return (
    <html lang={locale}>
      <body>
        <LanguageProvider locale={locale}>
          <a className="skip-link" href="#main">
            {t("Skip to content")}
          </a>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
