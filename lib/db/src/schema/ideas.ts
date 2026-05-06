import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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
  whyThisMarket: text("why_this_market"),
  problemStatement: text("problem_statement").notNull(),
  proposedSolution: text("proposed_solution").notNull(),
  targetCustomer: text("target_customer").notNull(),
  maturityStage: text("maturity_stage").notNull(),
  revenueModel: text("revenue_model"),
  pmfAssumptions: text("pmf_assumptions"),
  knownCompetitors: text("known_competitors"),
  legalConsiderations: text("legal_considerations"),
  regulatoryConsiderations: text("regulatory_considerations"),
  infrastructureDependencies: text("infrastructure_dependencies"),
  localCompetitors: text("local_competitors"),
  localLaunchChannels: text("local_launch_channels"),
  localConstraints: text("local_constraints"),
  requiredRoles: text("required_roles"),
  contributorSkills: text("contributor_skills"),
  contributorsNeeded: integer("contributors_needed").notNull().default(0),
  tags: text("tags"),
  visibility: text("visibility").notNull().default("public"),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  score: integer("score").notNull().default(0),
  qualityScore: integer("quality_score").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertIdeaSchema = createInsertSchema(ideasTable).omit({
  id: true, createdAt: true, updatedAt: true,
  upvotes: true, downvotes: true, score: true, commentsCount: true, qualityScore: true,
  featured: true,
});
export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type Idea = typeof ideasTable.$inferSelect;
