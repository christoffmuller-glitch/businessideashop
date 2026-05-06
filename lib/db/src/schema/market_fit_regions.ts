import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { ideasTable } from "./ideas";

export const marketFitRegionsTable = pgTable("market_fit_regions", {
  id: serial("id").primaryKey(),
  ideaId: integer("idea_id").notNull().references(() => ideasTable.id, { onDelete: "cascade" }),
  region: text("region").notNull(),
  marketOpportunity: text("market_opportunity"),
  keyCustomerSegment: text("key_customer_segment"),
  localCompetitors: text("local_competitors"),
  legalConsiderations: text("legal_considerations"),
  barriersToEntry: text("barriers_to_entry"),
  pricingAssumptions: text("pricing_assumptions"),
  productChanges: text("product_changes"),
  confidenceScore: integer("confidence_score").notNull().default(3),
});

export const insertMarketFitRegionSchema = createInsertSchema(marketFitRegionsTable).omit({ id: true });
export type InsertMarketFitRegion = z.infer<typeof insertMarketFitRegionSchema>;
export type MarketFitRegion = typeof marketFitRegionsTable.$inferSelect;
