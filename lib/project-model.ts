import { z } from "zod";

const optionalUrl = z
  .string()
  .max(2000)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }, "Use a complete HTTPS URL, or leave this empty.");

export const featureSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(1200),
  visual: z.enum([
    "overview",
    "analysis",
    "alerts",
    "storefront",
    "checkout",
    "operations",
    "generic",
  ]),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80),
  title: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  problem: z.string().trim().min(1).max(2000),
  approach: z.string().trim().min(1).max(2000),
  architecture: z.string().trim().min(1).max(2000),
  stack: z.array(z.string().trim().min(1).max(60)).min(1).max(20),
  features: z.array(featureSchema).min(1).max(12),
  highlights: z.array(z.string().trim().min(1).max(300)).max(8),
  caveat: z.string().max(1000),
  accent: z.enum(["mint", "orange", "lavender", "blue"]),
  year: z.string().regex(/^20\d{2}$/),
  order: z.number().int().min(0).max(999),
  published: z.boolean(),
  featured: z.boolean(),
  liveUrl: optionalUrl,
  sourceUrl: optionalUrl,
  coverUrl: optionalUrl,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectRecord = Project & { version: number };
export type Feature = z.infer<typeof featureSchema>;
export const mutationSchema = z.object({
  project: projectSchema,
  expectedVersion: z.number().int().min(0),
  create: z.boolean().default(false),
});
