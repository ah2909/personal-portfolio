import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "./globals.css";
import { profile } from "../lib/profile";

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — Ideas, made real.`,
    template: `%s — ${profile.name}`,
  },
  description:
    "A personal project lab. Explore Cryptofolio, a multi-store E-Commerce platform, and the thinking behind the build.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
