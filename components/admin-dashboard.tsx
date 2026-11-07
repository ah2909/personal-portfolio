"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  FileText,
  LayoutGrid,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  projectSchema,
  type Project,
  type ProjectRecord,
  type Feature,
} from "../lib/project-model";
import { ProductVisual } from "./product-visual";
import { FeatureExplorer } from "./feature-explorer";

const blankProject = (): ProjectRecord => ({
  slug: "",
  title: "",
  category: "FULL STACK",
  tagline: "",
  description: "",
  problem: "",
  approach: "",
  architecture: "",
  stack: [],
  features: [{ title: "", description: "", visual: "generic" }],
  highlights: [],
  caveat: "",
  accent: "lavender",
  year: String(new Date().getFullYear()),
  order: 3,
  published: false,
  featured: false,
  liveUrl: "",
  sourceUrl: "",
  coverUrl: "",
  version: 0,
});

export function AdminDashboard({
  initialProjects,
}: {
  initialProjects: ProjectRecord[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<ProjectRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [remove, setRemove] = useState<ProjectRecord | null>(null);
  const [discard, setDiscard] = useState(false);
  const [stackText, setStackText] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function edit(project?: ProjectRecord) {
    const draft = project
      ? structuredClone(project)
      : {
          ...blankProject(),
          order: Math.min(
            999,
            Math.max(0, ...projects.map((item) => item.order)) + 1,
          ),
        };
    setEditing(draft);
    setIsNew(!project);
    setDirty(false);
    setPreview(false);
    setError("");
    setMessage("");
    setDiscard(false);
    setStackText(draft.stack.join(", "));
    setHighlightText(draft.highlights.join("\n"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setEditing((current) => (current ? { ...current, [key]: value } : null));
    setDirty(true);
    setMessage("");
  }

  function updateFeature(index: number, patch: Partial<Feature>) {
    if (editing)
      update(
        "features",
        editing.features.map((feature, current) =>
          current === index ? { ...feature, ...patch } : feature,
        ),
      );
  }

  function closeEditor() {
    if (dirty) {
      setDiscard(true);
      return;
    }
    setEditing(null);
    setError("");
    setPreview(false);
  }

  async function reload() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/projects", {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        projects: ProjectRecord[];
        error?: string;
      };
      if (!response.ok) throw new Error(data.error);
      setProjects(data.projects);
      setMessage("Collection refreshed.");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "The collection could not be loaded.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing || saving) return;
    setError("");
    setMessage("");
    const result = projectSchema.safeParse({
      ...editing,
      stack: stackText
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
      highlights: highlightText
        .split("\n")
        .map((part) => part.trim())
        .filter(Boolean),
    });
    if (!result.success) {
      setError(
        result.error.issues
          .map((issue) => `${issue.path.join(" → ")}: ${issue.message}`)
          .join(". "),
      );
      return;
    }
    if (
      isNew &&
      projects.some((project) => project.slug === result.data.slug)
    ) {
      setError(
        "This URL is already used by another project. Choose a different URL slug.",
      );
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: result.data,
          expectedVersion: editing.version,
          create: isNew,
        }),
      });
      const data = (await response.json()) as {
        project: ProjectRecord;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error || "The project could not be saved.");
      setProjects((current) =>
        [
          ...current.filter((project) => project.slug !== data.project.slug),
          data.project,
        ].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
      );
      setEditing(data.project);
      setIsNew(false);
      setDirty(false);
      setMessage(
        data.project.published
          ? "Project saved and published to your portfolio."
          : "Draft saved. It is hidden from the portfolio.",
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Saving failed. Your draft remains in the editor.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelected() {
    if (!remove || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: remove.slug,
          expectedVersion: remove.version,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error);
      setProjects((current) =>
        current.filter((project) => project.slug !== remove.slug),
      );
      setMessage(`${remove.title} removed from your portfolio.`);
      setRemove(null);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "The project could not be removed.",
      );
    } finally {
      setSaving(false);
    }
  }

  const visible = projects.filter(
    (project) =>
      (filter === "all" ||
        (filter === "published" ? project.published : !project.published)) &&
      `${project.title} ${project.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> YOUR CREATIVE WORKSPACE
          </span>
          <h1>
            {editing
              ? isNew
                ? "Something new."
                : "Make it yours."
              : "The project desk."}
          </h1>
          <p>
            {editing
              ? "Tell the story, add the details, and make it part of your portfolio."
              : "A growing collection. A place for whatever you build next."}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            className="button button-dark"
            onClick={() => edit()}
          >
            <Plus size={18} aria-hidden /> Add project
          </button>
        )}
      </div>
      {error && (
        <div
          className="admin-alert is-error"
          role="alert"
          tabIndex={-1}
          ref={errorRef}
        >
          <strong>Something needs attention.</strong>
          <p>{error}</p>
        </div>
      )}
      {message && (
        <div className="admin-alert is-success" role="status">
          <Check size={18} aria-hidden />
          {message}
        </div>
      )}
      {editing ? (
        <>
          <div className="editor-toolbar">
            <button type="button" className="text-link" onClick={closeEditor}>
              <ArrowLeft size={16} aria-hidden /> All projects
            </button>
            <div className="editor-tabs">
              <button
                type="button"
                aria-pressed={!preview}
                className={!preview ? "active" : ""}
                onClick={() => setPreview(false)}
              >
                <Pencil size={15} aria-hidden /> Edit story
              </button>
              <button
                type="button"
                aria-pressed={preview}
                className={preview ? "active" : ""}
                onClick={() => setPreview(true)}
              >
                <Eye size={15} aria-hidden /> Preview
              </button>
            </div>
            <span className="save-state">
              {dirty
                ? "Unsaved changes"
                : isNew
                  ? "New project"
                  : "All changes saved"}
            </span>
          </div>
          {discard && (
            <div className="admin-alert discard-alert" role="alert">
              <div>
                <strong>Leave without saving?</strong>
                <p>Your changes will be discarded.</p>
              </div>
              <button
                type="button"
                className="button button-outline"
                onClick={() => setDiscard(false)}
              >
                Keep editing
              </button>
              <button
                type="button"
                className="button button-danger"
                onClick={() => {
                  setEditing(null);
                  setDirty(false);
                  setDiscard(false);
                  setError("");
                }}
              >
                Discard changes
              </button>
            </div>
          )}
          {preview ? (
            <div className="admin-preview">
              <span className="eyebrow">PRIVATE DRAFT PREVIEW</span>
              <h2>{editing.title || "Your next project"}</h2>
              <p>
                {editing.tagline || "Your project's one-line introduction."}
              </p>
              <ProductVisual project={editing} />
              <p className="preview-description">{editing.description}</p>
              <FeatureExplorer project={editing} />
              <button
                type="button"
                className="button button-dark"
                onClick={() => setPreview(false)}
              >
                <Pencil size={16} aria-hidden /> Back to editing
              </button>
            </div>
          ) : (
            <form onSubmit={save} noValidate className="project-editor">
              <div className="editor-main">
                <section className="editor-section">
                  <div className="editor-section-heading">
                    <span>01</span>
                    <div>
                      <h2>The introduction</h2>
                      <p>What is it, and why should someone explore it?</p>
                    </div>
                  </div>
                  <div className="form-two">
                    <Field label="Project name" required>
                      <input
                        value={editing.title}
                        maxLength={100}
                        onChange={(event) => {
                          update("title", event.target.value);
                          if (isNew)
                            update(
                              "slug",
                              event.target.value
                                .toLowerCase()
                                .normalize("NFKD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, ""),
                            );
                        }}
                      />
                    </Field>
                    <Field
                      label="URL slug"
                      hint={
                        isNew
                          ? "Lowercase words separated by hyphens."
                          : "The URL stays fixed so existing links keep working."
                      }
                      required
                    >
                      <input
                        value={editing.slug}
                        readOnly={!isNew}
                        maxLength={80}
                        onChange={(event) => update("slug", event.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="One-line introduction" required>
                    <input
                      value={editing.tagline}
                      maxLength={200}
                      placeholder="The idea, in one sentence."
                      onChange={(event) =>
                        update("tagline", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Project overview" required>
                    <textarea
                      rows={3}
                      value={editing.description}
                      maxLength={2000}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                    />
                  </Field>
                  <div className="form-two">
                    <Field label="Category" required>
                      <input
                        value={editing.category}
                        maxLength={80}
                        placeholder="FINTECH / FULL STACK"
                        onChange={(event) =>
                          update("category", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Year" required>
                      <input
                        value={editing.year}
                        inputMode="numeric"
                        maxLength={4}
                        onChange={(event) => update("year", event.target.value)}
                      />
                    </Field>
                  </div>
                </section>
                <section className="editor-section">
                  <div className="editor-section-heading">
                    <span>02</span>
                    <div>
                      <h2>The story behind it</h2>
                      <p>
                        The problem, your approach, and the technical thinking.
                      </p>
                    </div>
                  </div>
                  <Field label="The challenge" required>
                    <textarea
                      rows={3}
                      maxLength={2000}
                      value={editing.problem}
                      onChange={(event) =>
                        update("problem", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Your approach" required>
                    <textarea
                      rows={3}
                      maxLength={2000}
                      value={editing.approach}
                      onChange={(event) =>
                        update("approach", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Architecture & implementation" required>
                    <textarea
                      rows={4}
                      maxLength={2000}
                      value={editing.architecture}
                      onChange={(event) =>
                        update("architecture", event.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Technology stack"
                    hint="Separate technologies with commas."
                    required
                  >
                    <input
                      value={stackText}
                      placeholder="React, TypeScript, Go, PostgreSQL"
                      onChange={(event) => {
                        setStackText(event.target.value);
                        update(
                          "stack",
                          event.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        );
                      }}
                    />
                  </Field>
                  <Field
                    label="Build highlights"
                    hint="One highlight per line. Up to 8."
                  >
                    <textarea
                      rows={4}
                      value={highlightText}
                      onChange={(event) => {
                        setHighlightText(event.target.value);
                        update(
                          "highlights",
                          event.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        );
                      }}
                    />
                  </Field>
                </section>
                <section className="editor-section">
                  <div className="editor-section-heading">
                    <span>03</span>
                    <div>
                      <h2>What makes it work</h2>
                      <p>Add up to 12 features for the interactive explorer.</p>
                    </div>
                  </div>
                  {editing.features.map((feature, index) => (
                    <div className="feature-editor" key={index}>
                      <div className="feature-editor-top">
                        <span className="eyebrow">
                          FEATURE {String(index + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          className="icon-button"
                          disabled={editing.features.length === 1}
                          aria-label={`Remove feature ${index + 1}`}
                          onClick={() =>
                            update(
                              "features",
                              editing.features.filter(
                                (_, current) => current !== index,
                              ),
                            )
                          }
                        >
                          <X size={17} />
                        </button>
                      </div>
                      <Field label="Feature title" required>
                        <input
                          value={feature.title}
                          maxLength={80}
                          onChange={(event) =>
                            updateFeature(index, { title: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="Feature description" required>
                        <textarea
                          rows={3}
                          maxLength={1200}
                          value={feature.description}
                          onChange={(event) =>
                            updateFeature(index, {
                              description: event.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Preview style">
                        <select
                          value={feature.visual}
                          onChange={(event) =>
                            updateFeature(index, {
                              visual: event.target.value as Feature["visual"],
                            })
                          }
                        >
                          <option value="generic">Project identity</option>
                          <option value="overview">Portfolio dashboard</option>
                          <option value="analysis">Portfolio analysis</option>
                          <option value="alerts">Market alerts</option>
                          <option value="storefront">Shop storefront</option>
                          <option value="checkout">Shop checkout</option>
                          <option value="operations">
                            Store administration
                          </option>
                        </select>
                      </Field>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="button button-outline"
                    disabled={editing.features.length >= 12}
                    onClick={() =>
                      update("features", [
                        ...editing.features,
                        { title: "", description: "", visual: "generic" },
                      ])
                    }
                  >
                    <Plus size={16} aria-hidden /> Add feature
                  </button>
                </section>
                <section className="editor-section">
                  <div className="editor-section-heading">
                    <span>04</span>
                    <div>
                      <h2>A little more context</h2>
                      <p>Optional links, imagery, and honest limitations.</p>
                    </div>
                  </div>
                  <Field label="Live project URL">
                    <input
                      type="url"
                      value={editing.liveUrl}
                      placeholder="https://…"
                      onChange={(event) =>
                        update("liveUrl", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Source code URL">
                    <input
                      type="url"
                      value={editing.sourceUrl}
                      placeholder="https://github.com/…"
                      onChange={(event) =>
                        update("sourceUrl", event.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Cover image URL"
                    hint="Use a public HTTPS image. Leave empty for the built-in preview."
                  >
                    <input
                      type="url"
                      value={editing.coverUrl}
                      placeholder="https://…"
                      onChange={(event) =>
                        update("coverUrl", event.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Presentation note"
                    hint="Mention limitations, sample data, or features awaiting verification."
                  >
                    <textarea
                      rows={3}
                      value={editing.caveat}
                      maxLength={1000}
                      onChange={(event) => update("caveat", event.target.value)}
                    />
                  </Field>
                </section>
              </div>
              <aside className="editor-sidebar">
                <div className="publish-panel">
                  <span className="eyebrow">MAKE IT PART OF YOUR STORY</span>
                  <h2>Ready when you are.</h2>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={editing.published}
                      onChange={(event) =>
                        update("published", event.target.checked)
                      }
                    />
                    <span>
                      <strong>Publish project</strong>
                      <small>
                        Show it on the portfolio and enable its introduction
                        page.
                      </small>
                    </span>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(event) =>
                        update("featured", event.target.checked)
                      }
                    />
                    <span>
                      <strong>Mark as selected</strong>
                      <small>Add a selected-project badge.</small>
                    </span>
                  </label>
                  <Field
                    label="Display order"
                    hint="Lower numbers appear first."
                  >
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={editing.order}
                      onChange={(event) =>
                        update("order", Number(event.target.value))
                      }
                    />
                  </Field>
                  <Field label="Project palette">
                    <select
                      value={editing.accent}
                      onChange={(event) =>
                        update(
                          "accent",
                          event.target.value as Project["accent"],
                        )
                      }
                    >
                      <option value="mint">Sage & mint</option>
                      <option value="orange">Clay & orange</option>
                      <option value="lavender">Soft lavender</option>
                      <option value="blue">Powder blue</option>
                    </select>
                  </Field>
                  <div className={`palette-preview accent-${editing.accent}`}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <button
                    className="button button-dark save-button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      <LoaderCircle className="spin" size={17} aria-hidden />
                    ) : (
                      <Save size={17} aria-hidden />
                    )}
                    {saving
                      ? "Saving…"
                      : editing.published
                        ? "Save & publish"
                        : "Save draft"}
                  </button>
                  <p className="publish-note">
                    Saved to your portfolio database. No code changes or rebuild
                    needed.
                  </p>
                  {!isNew && editing.published && (
                    <Link
                      className="text-link"
                      href={`/projects/${editing.slug}`}
                      target="_blank"
                    >
                      Open project page <ArrowUpRight size={15} aria-hidden />
                    </Link>
                  )}
                </div>
              </aside>
            </form>
          )}
        </>
      ) : (
        <>
          <div className="admin-stats">
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              <LayoutGrid size={19} aria-hidden />
              <span>All projects</span>
              <strong>{String(projects.length).padStart(2, "0")}</strong>
            </button>
            <button
              type="button"
              onClick={() => setFilter("published")}
              aria-pressed={filter === "published"}
            >
              <Eye size={19} aria-hidden />
              <span>Published</span>
              <strong>
                {String(
                  projects.filter((project) => project.published).length,
                ).padStart(2, "0")}
              </strong>
            </button>
            <button
              type="button"
              onClick={() => setFilter("draft")}
              aria-pressed={filter === "draft"}
            >
              <FileText size={19} aria-hidden />
              <span>In the works</span>
              <strong>
                {String(
                  projects.filter((project) => !project.published).length,
                ).padStart(2, "0")}
              </strong>
            </button>
          </div>
          <div className="admin-collection-heading">
            <h2>
              Your collection <span>{visible.length}</span>
            </h2>
            <div>
              <label className="project-search">
                <Search size={16} aria-hidden />
                <input
                  type="search"
                  value={search}
                  placeholder="Find a project"
                  aria-label="Find a project"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <button
                type="button"
                className="text-link"
                disabled={saving}
                onClick={reload}
              >
                Refresh
              </button>
            </div>
          </div>
          {remove && (
            <div className="admin-alert discard-alert" role="alert">
              <div>
                <strong>Remove {remove.title}?</strong>
                <p>
                  Its introduction page will become unavailable. Unpublish it
                  instead if you want to keep a draft.
                </p>
              </div>
              <button
                type="button"
                className="button button-outline"
                onClick={() => setRemove(null)}
                disabled={saving}
              >
                Keep project
              </button>
              <button
                type="button"
                className="button button-danger"
                onClick={deleteSelected}
                disabled={saving}
              >
                {saving ? "Removing…" : "Remove project"}
              </button>
            </div>
          )}
          <div className="admin-project-list">
            {visible.map((project) => (
              <article className="admin-project-row" key={project.slug}>
                <div
                  className={`admin-project-avatar accent-${project.accent}`}
                >
                  {project.title.charAt(0)}
                </div>
                <div className="admin-project-title">
                  <h3>{project.title}</h3>
                  <span>
                    /{project.slug} · {project.category}
                  </span>
                </div>
                <span
                  className={`publication-status ${project.published ? "published" : "draft"}`}
                >
                  <i />
                  {project.published ? "Published" : "Draft"}
                </span>
                <span className="admin-order">
                  #{String(project.order).padStart(2, "0")}
                </span>
                <div className="row-actions">
                  {project.published && (
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="icon-button"
                      aria-label={`View ${project.title}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  )}
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Edit ${project.title}`}
                    onClick={() => edit(project)}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    className="icon-button danger-icon"
                    aria-label={`Remove ${project.title}`}
                    onClick={() => {
                      setRemove(project);
                      setMessage("");
                    }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="empty-state">
              <h3>
                {projects.length
                  ? "Nothing in this view."
                  : "Your next idea starts here."}
              </h3>
              <p>
                {projects.length
                  ? "Try another search or project status."
                  : "Add a project and tell the story behind it."}
              </p>
              <button
                type="button"
                className="button button-outline"
                onClick={() =>
                  projects.length ? (setFilter("all"), setSearch("")) : edit()
                }
              >
                {projects.length
                  ? "Show all projects"
                  : "Add your first project"}
              </button>
            </div>
          )}
          <div className="admin-tip">
            <Plus size={20} aria-hidden />
            <div>
              <strong>Built something new?</strong>
              <p>
                Add a story, choose a palette, and give it a place in the
                collection.
              </p>
            </div>
            <button type="button" className="text-link" onClick={() => edit()}>
              Add a project <ArrowUpRight size={16} aria-hidden />
            </button>
          </div>
        </>
      )}
      <div className="admin-footnote">
        <span>PERSONAL PROJECT LAB / ADMIN</span>
        <Link href="/">
          Back to the portfolio <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="form-field">
      <span>
        {label}
        {required && <span className="required-mark"> *</span>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
