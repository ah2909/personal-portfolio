import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  slug: text("slug").primaryKey(),
  document: text("document").notNull(),
  version: integer("version").notNull().default(1),
  deleted: integer("deleted", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
});
