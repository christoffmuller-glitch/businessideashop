import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contributionsTable, ideasTable, usersTable } from "@workspace/db";
import { OfferContributionBody, UpdateContributionStatusBody } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any): number | null {
  return (req.session as Record<string, unknown>).userId as number | null;
}

async function enrichContribution(c: typeof contributionsTable.$inferSelect) {
  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, c.userId));
  return { ...c, userName: user?.name ?? "Unknown" };
}

router.get("/ideas/:id/contributions", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ideaId = parseInt(raw, 10);

  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, ideaId));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (idea.ownerId !== userId && user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const contributions = await db.select().from(contributionsTable).where(eq(contributionsTable.ideaId, ideaId));
  const enriched = await Promise.all(contributions.map(enrichContribution));
  res.json(enriched);
});

router.post("/ideas/:id/contributions", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ideaId = parseInt(raw, 10);

  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, ideaId));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }

  const parsed = OfferContributionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [contribution] = await db.insert(contributionsTable).values({
    ideaId,
    userId,
    ...parsed.data,
    status: "pending",
  }).returning();

  const enriched = await enrichContribution(contribution);
  res.status(201).json(enriched);
});

router.put("/contributions/:contributionId/status", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.contributionId) ? req.params.contributionId[0] : req.params.contributionId;
  const contributionId = parseInt(raw, 10);

  const [contribution] = await db.select().from(contributionsTable).where(eq(contributionsTable.id, contributionId));
  if (!contribution) { res.status(404).json({ error: "Contribution not found" }); return; }

  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, contribution.ideaId));
  if (!idea || idea.ownerId !== userId) { res.status(403).json({ error: "Forbidden" }); return; }

  const parsed = UpdateContributionStatusBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db.update(contributionsTable).set({ status: parsed.data.status }).where(eq(contributionsTable.id, contributionId)).returning();
  const enriched = await enrichContribution(updated);
  res.json(enriched);
});

export default router;
