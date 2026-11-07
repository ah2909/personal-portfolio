import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Header, Footer } from "../../../components/site-shell";
import { FeatureExplorer } from "../../../components/feature-explorer";
import { ProductVisual } from "../../../components/product-visual";
import { listProjects } from "../../../lib/projects";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await listProjects()).find((item) => item.slug === slug);
  return {
    title: project?.title || "Project not found",
    description: project?.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await listProjects();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next =
    projects[
      (projects.findIndex((item) => item.slug === slug) + 1) % projects.length
    ];
  return (
    <div id="top">
      <Header />
      <main className="project-page wrap" id="main">
        <Link className="back-link" href="/#work">
          <ArrowLeft size={16} aria-hidden /> All projects
        </Link>
        <div className="project-intro">
          <div>
            <span className="eyebrow">
              {project.category} <span className="inline-divider">/</span>{" "}
              {project.year}
            </span>
            <h1>
              {project.title}
              <span className="hero-period">.</span>
            </h1>
            <h2>{project.tagline}</h2>
          </div>
          <div className="project-intro-aside">
            <p>{project.description}</p>
            <div className="project-links">
              <a className="button button-dark" href="#features">
                Explore the features <ArrowDownIcon />
              </a>
              {project.liveUrl && (
                <a
                  className="text-link"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live project <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
              {project.sourceUrl && (
                <a
                  className="text-link"
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source code <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="project-hero-visual">
          <ProductVisual project={project} />
        </div>
        <div className="project-meta">
          <div>
            <span className="eyebrow">PROJECT TYPE</span>
            <strong>Personal project</strong>
          </div>
          <div>
            <span className="eyebrow">FOCUS</span>
            <strong>{project.category.split(" / ")[0].toLowerCase()}</strong>
          </div>
          <div>
            <span className="eyebrow">BUILT WITH</span>
            <div className="tech-tags">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <section className="project-story">
          <div>
            <span className="eyebrow">01 / THE CHALLENGE</span>
            <h2>A reason to build.</h2>
            <p>{project.problem}</p>
          </div>
          <div>
            <span className="eyebrow">02 / THE APPROACH</span>
            <h2>Connect the pieces.</h2>
            <p>{project.approach}</p>
          </div>
        </section>
        <FeatureExplorer project={project} />
        <section className="architecture-section">
          <div>
            <span className="eyebrow">UNDER THE SURFACE</span>
            <h2>
              Built with
              <br />
              <span>intention.</span>
            </h2>
          </div>
          <div>
            <p>{project.architecture}</p>
            <div className="architecture-stack">
              {project.stack.map((tech, index) => (
                <span key={tech}>
                  {index > 0 && <i aria-hidden>+</i>}
                  {tech}
                </span>
              ))}
            </div>
            <ul className="build-highlights">
              {project.highlights.map((highlight) => (
                <li key={highlight}>
                  <Check size={17} aria-hidden />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </section>
        {project.caveat && (
          <aside className="source-note">
            <span className="eyebrow">ABOUT THIS PRESENTATION</span>
            <p>{project.caveat}</p>
          </aside>
        )}
        {next && next.slug !== project.slug && (
          <Link className="next-project" href={`/projects/${next.slug}`}>
            <div>
              <span className="eyebrow">KEEP EXPLORING</span>
              <h2>{next.title}</h2>
            </div>
            <ArrowRight size={42} aria-hidden />
          </Link>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M12 4v16m-6-6 6 6 6-6" />
    </svg>
  );
}
