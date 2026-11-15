"use client";

import { useTranslation } from "./language-provider";

import { useState } from "react";
import { ArrowUpRight, ArrowRight, Search } from "lucide-react";
import type { ProjectRecord } from "../lib/project-model";
import { ProductVisual } from "./product-visual";
import { searchText } from "../lib/i18n";
import { commerceCaptures, cryptofolioCaptures } from "../lib/project-media";

function ProjectThumbnail({ project }: { project: ProjectRecord }) {
  const t = useTranslation();
  const capture = project.slug === "cryptofolio"
    ? cryptofolioCaptures.dashboard
    : project.slug === "e-commerce"
      ? commerceCaptures.storefront
      : undefined;
  const src = project.coverUrl || capture?.src;

  if (!src) return <ProductVisual project={project} compact />;

  return (
    <div className={`project-thumbnail accent-${project.accent}`}>
      <img
        src={src}
        alt={project.coverUrl ? `${project.title} — ${t("project preview")}` : t(capture!.alt)}
        width={project.coverUrl ? undefined : capture?.width}
        height={project.coverUrl ? undefined : capture?.height}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function ProjectGallery({ projects }: { projects: ProjectRecord[]; }) {
  const t = useTranslation();
  const [filter, setFilter] = useState("All projects");
  const [query, setQuery] = useState("");
  const categories = [
    "All projects",
    ...new Set(projects.map((project) => project.category.split(" / ")[0])),
  ];
  const filtered = projects.filter(
    (project) =>
      (filter === "All projects" ||
        project.category.split(" / ")[0] === filter) &&
      searchText(`${project.title} ${project.description} ${t(project.description)} ${t(project.tagline)} ${t(project.category)} ${project.stack.join(" ")}`)
        .includes(searchText(query)),
  );
  return (
    <section className="work-section wrap" id="work">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <i className="orange-square" /> {t("THE WORK")}
          </span>
          <h2>
            {t("Built from curiosity.")}
            <br />
            <span>
              {t("Made to be used.")}
            </span>
          </h2>
        </div>
        <p>
          {t("A closer look at the products I’m building,")}
          <br className="desktop-only" /> {t("from the first idea to the details underneath.")}
        </p>
      </div>
      <div className="gallery-tools">
        <div className="filter-tabs" aria-label={t("Filter projects")}>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={filter === category}
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category === "All projects" ? (
                <>
                  {t("All projects")}{" "}
                  <span>{projects.length.toString().padStart(2, "0")}
                  </span>
                </>
              ) : (
                t(category.charAt(0) + category.slice(1).toLowerCase())
              )}
            </button>
          ))}
        </div>
        <label className="project-search">
          <Search size={16} aria-hidden />
          <input
            type="search"
            aria-label={t("Search projects")}
            placeholder={t("Find a project")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="project-grid">
        {filtered.map((project) => (
          <article className="project-card" key={project.slug}>
            <a
              className="project-card-visual"
              href={`/projects/${project.slug}`}
              aria-label={`${t("Explore")} ${project.title}`}
            >
              <ProjectThumbnail project={project} />
              <span className="project-open">
                <ArrowUpRight size={22} />
              </span>
              {project.featured && (
                <span className="featured-label">
                  {t("SELECTED PROJECT")}
                </span>
              )}
            </a>
            <div className="project-card-info">
              <div>
                <span className="eyebrow">
                  {t(project.category)}
                </span>
                <a href={`/projects/${project.slug}`}>
                  <h3>
                    {t(project.title)}
                    <ArrowUpRight size={23} aria-hidden />
                  </h3>
                </a>
                <p>
                  {t(project.tagline)}
                </p>
              </div>
              <span className="project-year">{project.year}
              </span>
            </div>
            <div className="tech-tags">
              {project.stack.slice(0, 4).map((item) => (
                <span key={item}>{item}
                </span>
              ))}
              {project.stack.length > 4 && (
                <span>+{project.stack.length - 4}
                </span>
              )}
            </div>
            <a className="text-link" href={`/projects/${project.slug}`}>
              {t("Explore the project")} <ArrowRight size={16} aria-hidden />
            </a>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>
            {t("No projects found.")}
          </h3>
          <p>
            {t("Try another keyword or category.")}
          </p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setFilter("All projects");
            }}
          >
            {t("Reset filters")}
          </button>
        </div>
      )}
    </section>
  );
}
