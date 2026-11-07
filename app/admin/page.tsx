import type { Metadata } from "next";
import { requireChatGPTUser } from "../chatgpt-auth";
import { Header } from "../../components/site-shell";
import { AdminDashboard } from "../../components/admin-dashboard";
import { listProjects } from "../../lib/projects";
import { isPortfolioAdmin } from "../../lib/admin-auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Project admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isPortfolioAdmin(await requireChatGPTUser("/admin"))) notFound();
  return (
    <>
      <Header admin />
      <main id="main" className="wrap admin-page">
        <AdminDashboard initialProjects={await listProjects(true)} />
      </main>
    </>
  );
}
