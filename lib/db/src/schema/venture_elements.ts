import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { ideasTable } from "./ideas";

export const ventureElementsTable = pgTable("venture_elements", {
  id: serial("id").primaryKey(),
  ideaId: integer("idea_id").notNull().references(() => ideasTable.id, { onDelete: "cascade" }),
  element: text("element").notNull(),
  status: text("status").notNull().default("not_started"), // not_started | needed | in_progress | completed | needs_expert_review
});

export const insertVentureElementSchema = createInsertSchema(ventureElementsTable).omit({ id: true });
export type InsertVentureElement = z.infer<typeof insertVentureElementSchema>;
export type VentureElement = typeof ventureElementsTable.$inferSelect;
