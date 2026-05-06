import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { ideasTable } from "./ideas";

export const contributionsTable = pgTable("contributions", {
  id: serial("id").primaryKey(),
  ideaId: integer("idea_id").notNull().references(() => ideasTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  message: text("message"),
  experience: text("experience"),
  contributionType: text("contribution_type").notNull(), // "free" | "equity" | "payment" | "investor"
  status: text("status").notNull().default("pending"), // "pending" | "accepted" | "rejected"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContributionSchema = createInsertSchema(contributionsTable).omit({ id: true, createdAt: true, status: true });
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type Contribution = typeof contributionsTable.$inferSelect;
