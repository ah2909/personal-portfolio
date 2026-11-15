import { getTranslation } from "../../../lib/i18n-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Layers3,
  Radio,
} from "lucide-react";
import { Header, Footer } from "../../../components/site-shell";
import { FeatureExplorer } from "../../../components/feature-explorer";
import { ProductVisual } from "../../../components/product-visual";
import { ProjectCapture } from "../../../components/project-capture";
import { ProjectMobile } from "../../../components/project-mobile";
import {
  CommerceHero,
  CommerceOwner,
  CommerceReliability,
} from "../../../components/commerce-story";
import { cryptofolioCaptures } from "../../../lib/project-media";
import { listProjects } from "../../../lib/projects";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string; }>; };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslation();
  const { slug } = await params;
  const project = (await listProjects()).find((item) => item.slug === slug);
  return {
    title: project?.title || t("Project not found"),
    description: project ? t(project.description) : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const t = await getTranslation();
  const { slug } = await params;
  const projects = await listProjects();
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  const crypto = project.slug === "cryptofolio";
  const commerce = project.slug === "e-commerce";
  const focus = crypto
    ? ["Connected portfolios", "Real-time markets", "Mobile & PWA"]
    : commerce
      ? [
        "Your brand & catalog",
        "Everyday store operations",
        "Thoughtful shopping",
      ]
      : project.features.slice(0, 3).map((feature) => feature.title);
  const nodes = crypto
    ? [
      {
        label: "THE INTERFACE",
        title: "Next.js + TypeScript",
        detail: "Redux Toolkit Query · Socket.IO",
      },
      {
        label: "THE APPLICATION",
        title: "Laravel + services",
        detail: "Node.js · FastAPI / LangGraph · Go",
      },
      {
        label: "THE DATA",
        title: "MariaDB + Redis",
        detail: "Persistence · cache · application events",
      },
    ]
    : commerce
      ? [
        {
          label: "THE INTERFACE",
          title: "Next.js + TypeScript",
          detail: "TanStack Query · OpenAPI contract",
        },
        {
          label: "THE APPLICATION",
          title: "Go modular monolith",
          detail: "Gin · module-owned domain logic",
        },
        {
          label: "THE DATA",
          title: "PostgreSQL + Redis",
          detail: "Transactions · outbox · Kafka events",
        },
      ]
      : [];
  return (
    <div id="top" className={`case-study case-${project.accent}`}>
      <Header projectCount={projects.length} />
      <main className="project-page wrap" id="main">
        <div className="case-topline">
          <a className="back-link" href="/#work">
            <ArrowLeft size={15} aria-hidden /> {t("Back to selected work")}
          </a>
          <span>
            {t("PROJECT")} {String(index + 1).padStart(2, "0")} <span>/</span>{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <section className="case-heading">
          <div>
            <span className="case-kicker">
              <i /> {t(project.category)} <span>/</span> {project.year}
            </span>
            <h1>
              {t(project.title)}
              <span>.</span>
            </h1>
            <h2>
              {t(project.tagline)}
            </h2>
          </div>
          <div className="case-heading-summary">
            <p>
              {t(project.description)}
            </p>
            <div className="case-actions">
              <a className="button button-dark" href="#features">
                {t("Explore the experience")} <ArrowRight size={16} aria-hidden />
              </a>
              {project.liveUrl && (
                <a
                  className="text-link"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Live project")} <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
              {project.sourceUrl && (
                <a
                  className="text-link"
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Source")} <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
            </div>
          </div>
        </section>
        <div className="case-quick-facts">
          <span>
            <Code2 size={15} aria-hidden /> {t("PERSONAL FULL-STACK PROJECT")}
          </span>
          <div>
            {focus.map((item, position) => (
              <span key={item}>
                <b>{String(position + 1).padStart(2, "0")}
                </b>
                {t(item)}
              </span>
            ))}
          </div>
        </div>
        <section
          className={`case-hero-stage ${crypto || commerce ? "has-captures" : "has-illustration"} ${commerce ? "commerce-stage" : ""}`}
          aria-label={`${project.title} — ${t("product preview")}`}
        >
          <div className="case-stage-label">
            <span>
              <i />{" "}
              {crypto
                ? t("A LOOK INSIDE THE PRODUCT")
                : commerce
                  ? t("TWO SIDES. ONE CONNECTED STORE.")
                  : t("THE PRODUCT EXPERIENCE")}
            </span>
            <span>
              {crypto
                ? t("DESKTOP + MOBILE")
                : commerce
                  ? t("ACTUAL APP CAPTURES")
                  : t("ILLUSTRATIVE INTERFACE")}
              <ArrowUpRight size={13} aria-hidden />
            </span>
          </div>
          {crypto ? (
            <div className="case-hero-composition">
              <ProjectCapture
                capture={cryptofolioCaptures.dashboard}
                priority
                className="case-hero-desktop"
              />
              <div className="case-hero-phone">
                <span className="device-speaker" aria-hidden />
                <ProjectCapture
                  capture={cryptofolioCaptures.mobile}
                  priority
                  framed={false}
                />
              </div>
            </div>
          ) : commerce ? (
            <CommerceHero />
          ) : (
            <div className="case-illustration">
              <ProductVisual project={project} />
            </div>
          )}
          <div className="case-stage-bottom">
            <span>
              {crypto
                ? t("REAL SCREENS. ONE CONNECTED WORKSPACE.")
                : t("A STOREFRONT IS ONLY THE BEGINNING.")}
            </span>
            <span>
              {crypto
                ? t("Captured from the local test account")
                : commerce
                  ? t("Retained local football-store screenshots")
                  : t("A visual introduction to the product")}
            </span>
          </div>
        </section>
        <nav className="case-section-nav" aria-label={t("Project sections")}>
          <a href="#overview">
            <span>01</span> {t("Overview")}
          </a>
          {commerce && (
            <a href="#owner">
              <span>02</span> {t("For owners")}
            </a>
          )}
          <a href="#features">
            <span>{commerce ? "03" : "02"}
            </span>{" "}
            {commerce ? t("For shoppers") : t("Features")}
          </a>
          {commerce && (
            <a href="#reliability">
              <span>04</span> {t("The difference")}
            </a>
          )}
          {crypto && (
            <a href="#mobile">
              <span>03</span> {t("Mobile & PWA")}
            </a>
          )}
          <a href="#build">
            <span>{crypto ? "04" : commerce ? "05" : "03"}
            </span> {t("The build")}
          </a>
          <span className="case-nav-project">
            {t(project.title)} <ArrowUpRight size={13} aria-hidden />
          </span>
        </nav>
        <section className="case-overview" id="overview">
          <div className="case-section-title">
            <div>
              <span className="case-kicker">
                {t("01 / THE IDEA")}
              </span>
              <h2>
                {crypto ? (
                  <>
                    {t("A clearer view.")}
                    <br />
                    <span>
                      {t("Of the whole picture.")}
                    </span>
                  </>
                ) : commerce ? (
                  <>
                    {t("More than a storefront.")}
                    <br />
                    <span>
                      {t("A system behind it.")}
                    </span>
                  </>
                ) : (
                  <>
                    {t("An idea worth")}
                    <br />
                    <span>
                      {t("building.")}
                    </span>
                  </>
                )}
              </h2>
            </div>
            <div className="case-overview-aside">
              <span className="case-kicker">
                {t("THE FOCUS")}
              </span>
              <p>
                {crypto
                  ? t("Bring portfolio activity, market context, and analysis into a single, understandable experience.")
                  : commerce
                    ? t("Give owners control of their store and shoppers a clear path from discovery to delivery.")
                    : project.tagline}
              </p>
            </div>
          </div>
          <div className="case-story-grid">
            <article>
              <span className="case-story-index">
                {t("THE CHALLENGE")} <span>↗</span>
              </span>
              <h3>
                {t("A reason to build.")}
              </h3>
              <p>
                {t(project.problem)}
              </p>
            </article>
            <article>
              <span className="case-story-index">
                {t("THE APPROACH")} <span>↗</span>
              </span>
              <h3>
                {t("Connect the pieces.")}
              </h3>
              <p>
                {t(project.approach)}
              </p>
            </article>
          </div>
        </section>
        {commerce && <CommerceOwner />}
        <FeatureExplorer project={project} />
        {commerce && <CommerceReliability />}
        {crypto && (
          <section className="case-market-section">
            <div className="case-market-heading">
              <div>
                <span className="case-kicker">
                  {t("THE BIGGER PICTURE")}
                </span>
                <h2>
                  {t("Keep the market")}
                  <br />
                  <span>
                    {t("in perspective.")}
                  </span>
                </h2>
              </div>
              <p>
                {t("Sentiment, trending assets, global statistics, and comparative performance give portfolio decisions their context.")}
              </p>
            </div>
            <ProjectCapture capture={cryptofolioCaptures.markets} />
            <div className="case-market-details">
              <span>
                <Radio size={16} aria-hidden /> {t("Market sentiment")}
              </span>
              <span>
                <Layers3 size={16} aria-hidden /> {t("Cross-asset comparison")}
              </span>
              <span>
                <ArrowUpRight size={16} aria-hidden /> {t("Trending assets")}
              </span>
            </div>
          </section>
        )}
        {crypto && <ProjectMobile />}
        <section className="case-build" id="build">
          <div className="case-section-title">
            <div>
              <span className="case-kicker">
                {crypto ? "04" : commerce ? "05" : "03"} {t("/ UNDER THE SURFACE")}
              </span>
              <h2>
                {t("The thinking")}
                <br />
                <span>
                  {t("behind the interface.")}
                </span>
              </h2>
            </div>
            <p>
              {t("A product is an interface, a set of decisions,")}
              <br />
              {t("and the systems that hold it together.")}
            </p>
          </div>
          {nodes.length > 0 && (
            <div className="case-system-map">
              {nodes.map((node, position) => (
                <div className="case-system-node" key={node.label}>
                  <span className="case-kicker">
                    {t(node.label)}
                  </span>
                  <h3>
                    {t(node.title)}
                  </h3>
                  <p>
                    {t(node.detail)}
                  </p>
                  {position < nodes.length - 1 && (
                    <ArrowRight
                      className="system-connector"
                      size={19}
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="case-build-body">
            <div>
              <span className="case-kicker">
                {t("IMPLEMENTATION NOTES")}
              </span>
              <p>
                {t(project.architecture)}
              </p>
              <div className="case-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}
                  </span>
                ))}
              </div>
            </div>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>
                  <Check size={16} aria-hidden />
                  {t(highlight)}
                </li>
              ))}
            </ul>
          </div>
        </section>
        {project.caveat && (
          <aside className="source-note">
            <span className="eyebrow">
              {t("ABOUT THIS PRESENTATION")}
            </span>
            <p>
              {t(project.caveat)}
            </p>
            {crypto && (
              <p>
                {t("AI-generated text is shown as part of the product interface, not as financial advice. Mobile views demonstrate responsive layout; native PWA installation and offline operation have not been validated.")}
              </p>
            )}
          </aside>
        )}
        {next && next.slug !== project.slug && (
          <a className="case-next" href={`/projects/${next.slug}`}>
            <div>
              <span className="case-kicker">
                {t("ANOTHER IDEA, MADE REAL")}
              </span>
              <h2>
                {t(next.title)}
                <span>.</span>
              </h2>
              <p>
                {t(next.tagline)}
              </p>
            </div>
            <span className="case-next-arrow">
              <ArrowUpRight size={33} aria-hidden />
            </span>
          </a>
        )}
      </main>
      <Footer />
    </div>
  );
}
