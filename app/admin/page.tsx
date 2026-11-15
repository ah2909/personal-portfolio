import type { Metadata } from "next";
import { Header } from "../../components/site-shell";
import { AdminDashboard } from "../../components/admin-dashboard";
import { listProjects } from "../../lib/projects";
import { getAdminUser, isPortfolioAdmin } from "../../lib/admin-auth";
import { notFound } from "next/navigation";
import { getTranslation } from "../../lib/i18n-server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslation();
  return {
    title: t("Project admin"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage() {
  if (!isPortfolioAdmin(await getAdminUser())) notFound();
  return (
    <>
      <Header admin />
      <main id="main" className="wrap admin-page">
        <AdminDashboard initialProjects={await listProjects(true)} />
      </main>
    </>
  );
}
