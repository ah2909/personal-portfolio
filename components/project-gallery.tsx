"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Search } from "lucide-react";
import type { ProjectRecord } from "../lib/project-model";
import { ProductVisual } from "./product-visual";

export function ProjectGallery({ projects }: { projects: ProjectRecord[] }) {
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
      `${project.title} ${project.description} ${project.stack.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="work-section wrap" id="work">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <i className="orange-square" /> THE WORK
          </span>
          <h2>
            Built from curiosity.
            <br />
            <span>Made to be used.</span>
          </h2>
        </div>
        <p>
          A closer look at the products I’m building,
          <br className="desktop-only" /> from the first idea to the details
          underneath.
        </p>
      </div>
      <div className="gallery-tools">
        <div className="filter-tabs" aria-label="Filter projects">
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
                  All projects{" "}
                  <span>{projects.length.toString().padStart(2, "0")}</span>
                </>
              ) : (
                category.charAt(0) + category.slice(1).toLowerCase()
              )}
            </button>
          ))}
        </div>
        <label className="project-search">
          <Search size={16} aria-hidden />
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Find a project"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="project-grid">
        {filtered.map((project) => (
          <article className="project-card" key={project.slug}>
            <Link
              className="project-card-visual"
              href={`/projects/${project.slug}`}
              aria-label={`Explore ${project.title}`}
            >
              <ProductVisual project={project} compact />
              <span className="project-open">
                <ArrowUpRight size={22} />
              </span>
              {project.featured && (
                <span className="featured-label">SELECTED PROJECT</span>
              )}
            </Link>
            <div className="project-card-info">
              <div>
                <span className="eyebrow">{project.category}</span>
                <Link href={`/projects/${project.slug}`}>
                  <h3>
                    {project.title}
                    <ArrowUpRight size={23} aria-hidden />
                  </h3>
                </Link>
                <p>{project.tagline}</p>
              </div>
              <span className="project-year">{project.year}</span>
            </div>
            <div className="tech-tags">
              {project.stack.slice(0, 4).map((item) => (
                <span key={item}>{item}</span>
              ))}
              {project.stack.length > 4 && (
                <span>+{project.stack.length - 4}</span>
              )}
            </div>
            <Link className="text-link" href={`/projects/${project.slug}`}>
              Explore the project <ArrowRight size={16} aria-hidden />
            </Link>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>No projects found.</h3>
          <p>Try another keyword or category.</p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setFilter("All projects");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
