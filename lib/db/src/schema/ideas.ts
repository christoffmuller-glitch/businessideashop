import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const ideasTable = pgTable("ideas", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  targetRegion: text("target_region").notNull(),
  problemStatement: text("problem_statement").notNull(),
  proposedSolution: text("proposed_solution").notNull(),
  targetCustomer: text("target_customer").notNull(),
  maturityStage: text("maturity_stage").notNull(),
  pmfAssumptions: text("pmf_assumptions"),
  knownCompetitors: text("known_competitors"),
  legalConsiderations: text("legal_considerations"),
  requiredRoles: text("required_roles"),
  contributorsNeeded: integer("contributors_needed").notNull().default(1),
  tags: text("tags"),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  score: integer("score").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  status: text("status").notNull().default("active"), // "active" | "removed"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertIdeaSchema = createInsertSchema(ideasTable).omit({ id: true, createdAt: true, updatedAt: true, upvotes: true, downvotes: true, score: true, commentsCount: true });
export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type Idea = typeof ideasTable.$inferSelect;
