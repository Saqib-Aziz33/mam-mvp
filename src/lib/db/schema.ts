import { pgTable, text, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

export const runs = pgTable("runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: text("run_id").notNull().unique(), // The external ID like run_123456
  brief: jsonb("brief").notNull(),
  research: jsonb("research"),
  blog: jsonb("blog"),
  seo: jsonb("seo"),
  social: jsonb("social"),
  email: jsonb("email"),
  finalPackage: jsonb("final_package"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: text("run_id").notNull().references(() => runs.runId),
  level: text("level").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const artifacts = pgTable("artifacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: text("run_id").notNull().references(() => runs.runId),
  filename: text("filename").notNull(),
  content: text("content").notNull(), // Markdown or other text content
  type: text("type").notNull(), // 'json', 'markdown', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
