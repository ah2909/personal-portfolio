import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { mutationSchema } from "../../../../lib/project-model";
import {
  deleteProject,
  listProjects,
  saveProject,
} from "../../../../lib/projects";
import { z } from "zod";
import { isPortfolioAdmin } from "../../../../lib/admin-auth";

export const dynamic = "force-dynamic";

async function authorize(request: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return NextResponse.json(
      { error: "Sign in to manage projects." },
      { status: 401 },
    );
  if (!isPortfolioAdmin(user))
    return NextResponse.json(
      { error: "Only the portfolio owner can manage projects." },
      { status: 403 },
    );
  if (
    request.method !== "GET" &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return NextResponse.json(
      { error: "This request must come from the portfolio." },
      { status: 403 },
    );
  return null;
}

export async function GET(request: Request) {
  const denied = await authorize(request);
  if (denied) return denied;
  try {
    return NextResponse.json(
      { projects: await listProjects(true) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "The project collection could not be loaded." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const denied = await authorize(request);
  if (denied) return denied;
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json(
      { error: "Send project data as JSON." },
      { status: 415 },
    );
  const body = await request.text();
  if (body.length > 64000)
    return NextResponse.json(
      { error: "The project is too large." },
      { status: 413 },
    );
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "The submitted JSON is invalid." },
      { status: 400 },
    );
  }
  const result = mutationSchema.safeParse(parsed);
  if (!result.success)
    return NextResponse.json(
      {
        error: result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; "),
      },
      { status: 400 },
    );
  try {
    const { project, expectedVersion } = result.data;
    if (
      result.data.create &&
      (await listProjects(true)).some((item) => item.slug === project.slug)
    )
      return NextResponse.json(
        { error: "This project URL is already in use." },
        { status: 409 },
      );
    if (!(await saveProject(project, expectedVersion)))
      return NextResponse.json(
        {
          error:
            "This project changed in another tab or its URL is already in use. Reload the collection before trying again.",
        },
        { status: 409 },
      );
    return NextResponse.json({
      project: { ...project, version: expectedVersion + 1 },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Saving failed. Your draft is still in the editor. Reload the collection to check whether the save reached the server before retrying.",
      },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  const denied = await authorize(request);
  if (denied) return denied;
  const result = z
    .object({
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .max(80),
      expectedVersion: z.number().int().min(0),
    })
    .safeParse(await request.json().catch(() => null));
  if (!result.success)
    return NextResponse.json(
      { error: "Invalid project or revision." },
      { status: 400 },
    );
  try {
    const exists = (await listProjects(true)).some(
      (project) => project.slug === result.data.slug,
    );
    if (!exists)
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 },
      );
    if (!(await deleteProject(result.data.slug, result.data.expectedVersion)))
      return NextResponse.json(
        {
          error:
            "This project has changed. Reload the collection before deleting it.",
        },
        { status: 409 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not remove this project. Reload the collection to check its current state.",
      },
      { status: 503 },
    );
  }
}
