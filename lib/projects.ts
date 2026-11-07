import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { projects } from "../db/schema";
import { seedProjects } from "./project-seeds";
import type { Project, ProjectRecord } from "./project-model";

export async function listProjects(
  includeDrafts = false,
): Promise<ProjectRecord[]> {
  const rows = await getDb().select().from(projects);
  const merged = new Map(
    seedProjects.map((project) => [project.slug, { ...project, version: 0 }]),
  );
  for (const row of rows) {
    if (row.deleted) merged.delete(row.slug);
    else
      merged.set(row.slug, {
        ...(JSON.parse(row.document) as Project),
        version: row.version,
      });
  }
  return [...merged.values()]
    .filter((project) => includeDrafts || project.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export async function saveProject(project: Project, expectedVersion: number) {
  const db = getDb();
  const record = {
    slug: project.slug,
    document: JSON.stringify(project),
    version: expectedVersion + 1,
    deleted: false,
    updatedAt: new Date().toISOString(),
  };
  if (expectedVersion === 0) {
    const rows = await db
      .insert(projects)
      .values(record)
      .onConflictDoNothing()
      .returning();
    return rows.length > 0;
  }
  const rows = await db
    .update(projects)
    .set(record)
    .where(
      and(
        eq(projects.slug, project.slug),
        eq(projects.version, expectedVersion),
        eq(projects.deleted, false),
      ),
    )
    .returning();
  return rows.length > 0;
}

export async function deleteProject(slug: string, expectedVersion: number) {
  const db = getDb();
  if (expectedVersion === 0) {
    const rows = await db
      .insert(projects)
      .values({
        slug,
        document: "{}",
        version: 1,
        deleted: true,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoNothing()
      .returning();
    return rows.length > 0;
  }
  const rows = await db
    .update(projects)
    .set({
      deleted: true,
      version: expectedVersion + 1,
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.version, expectedVersion),
        eq(projects.deleted, false),
      ),
    )
    .returning();
  return rows.length > 0;
}
