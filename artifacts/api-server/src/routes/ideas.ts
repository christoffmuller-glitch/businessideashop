import { Router, type IRouter } from "express";
import { eq, desc, asc, and, sql, ilike, or } from "drizzle-orm";
import { db, ideasTable, usersTable, votesTable, followsTable, ventureElementsTable, marketFitRegionsTable } from "@workspace/db";
import {
  CreateIdeaBody,
  UpdateIdeaBody,
  GetIdeaParams,
  UpdateIdeaParams,
  DeleteIdeaParams,
  ListIdeasQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const VENTURE_ELEMENTS_DEFAULT = [
  "Business plan", "Market research", "Product-market fit validation", "MVP",
  "Technical architecture", "Financial model", "Legal structure", "Founder agreement",
  "Contracts", "Brand identity", "Website or landing page", "Sales strategy",
  "Marketing strategy", "Operations plan", "Funding plan", "Location or operating jurisdiction",
  "Regulatory review", "Intellectual property review",
];

function requireAuth(req: any): number | null {
  return (req.session as Record<string, unknown>).userId as number | null;
}

// Rule-based quality score out of 100
function computeQualityScore(idea: Record<string, any>): number {
  let score = 0;

  // Problem clarity (15 pts)
  const prob = idea.problemStatement ?? "";
  if (prob.length > 150) score += 15;
  else if (prob.length > 60) score += 8;

  // Customer specificity (15 pts)
  const cust = idea.targetCustomer ?? "";
  if (cust.length > 100) score += 15;
  else if (cust.length > 40) score += 8;

  // Market relevance (10 pts)
  const why = idea.whyThisMarket ?? "";
  if (why.length > 40) score += 10;
  else if (idea.targetRegion) score += 5;

  // Feasibility / stage maturity (10 pts)
  const advancedStages = ["Prototype", "Pilot", "Launch-ready", "MVP in development", "MVP launched", "Early traction", "Revenue generating", "Scaling"];
  const midStages = ["Researching", "Validating", "Problem validated", "Solution defined", "Market research completed", "Business model drafted"];
  if (advancedStages.includes(idea.maturityStage)) score += 10;
  else if (midStages.includes(idea.maturityStage)) score += 5;

  // Differentiation - competitors known (10 pts)
  const comp = idea.knownCompetitors ?? "";
  if (comp.length > 30) score += 10;

  // Revenue potential (10 pts)
  const rev = idea.revenueModel ?? "";
  if (rev.length > 20) score += 10;

  // Localisation strength (10 pts)
  const local = (idea.localConstraints ?? "") + (idea.localCompetitors ?? "") + (idea.localLaunchChannels ?? "");
  if (local.length > 30) score += 10;
  else if (why.length > 10) score += 5;

  // Contributor readiness (10 pts)
  const skills = idea.contributorSkills ?? "";
  if (skills.length > 0) score += 10;

  // Evidence / assumptions (10 pts)
  const pmf = idea.pmfAssumptions ?? "";
  if (pmf.length > 30) score += 10;

  return Math.min(100, score);
}

async function enrichIdea(idea: typeof ideasTable.$inferSelect, userId?: number) {
  const [owner] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, idea.ownerId));
  let userVote = null;
  let isFollowing = null;
  if (userId) {
    const [vote] = await db.select().from(votesTable).where(and(eq(votesTable.userId, userId), eq(votesTable.ideaId, idea.id)));
    userVote = vote?.vote ?? null;
    const [follow] = await db.select().from(followsTable).where(and(eq(followsTable.userId, userId), eq(followsTable.ideaId, idea.id)));
    isFollowing = !!follow;
  }
  return { ...idea, ownerName: owner?.name ?? "Unknown", userVote, isFollowing };
}

router.get("/ideas/featured", async (req, res): Promise<void> => {
  const userId = requireAuth(req) ?? undefined;

  const featured = await db.select().from(ideasTable)
    .where(and(eq(ideasTable.status, "active"), eq(ideasTable.featured, true)))
    .orderBy(desc(ideasTable.qualityScore))
    .limit(6);

  const trending = await db.select().from(ideasTable)
    .where(eq(ideasTable.status, "active"))
    .orderBy(desc(sql`${ideasTable.upvotes} + ${ideasTable.commentsCount}`))
    .limit(6);

  const recent = await db.select().from(ideasTable)
    .where(eq(ideasTable.status, "active"))
    .orderBy(desc(ideasTable.createdAt))
    .limit(6);

  const enrichAll = async (arr: typeof ideasTable.$inferSelect[]) =>
    Promise.all(arr.map((i) => enrichIdea(i, userId)));

  res.json({
    featured: await enrichAll(featured),
    trending: await enrichAll(trending),
    recent: await enrichAll(recent),
  });
});

router.get("/ideas", async (req, res): Promise<void> => {
  const userId = requireAuth(req) ?? undefined;
  const parsed = ListIdeasQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { page = 1, limit = 12, industry, maturityStage, region, sort, search, contributorSkill } = parsed.data as any;
  const offset = (page - 1) * limit;

  const conditions = [eq(ideasTable.status, "active")];
  if (industry) conditions.push(eq(ideasTable.industry, industry));
  if (maturityStage) conditions.push(eq(ideasTable.maturityStage, maturityStage));
  if (region) conditions.push(eq(ideasTable.targetRegion, region));
  if (contributorSkill) conditions.push(ilike(ideasTable.contributorSkills, `%${contributorSkill}%`));
  if (search) {
    conditions.push(
      or(
        ilike(ideasTable.title, `%${search}%`),
        ilike(ideasTable.summary, `%${search}%`),
        ilike(ideasTable.industry, `%${search}%`),
      )!
    );
  }

  const where = and(...conditions);

  let orderBy;
  switch (sort) {
    case "most_voted": orderBy = desc(ideasTable.score); break;
    case "highest_score": orderBy = desc(ideasTable.qualityScore); break;
    case "most_active": orderBy = desc(sql`${ideasTable.upvotes} + ${ideasTable.commentsCount}`); break;
    case "most_commented": orderBy = desc(ideasTable.commentsCount); break;
    default: orderBy = desc(ideasTable.createdAt);
  }

  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(ideasTable).where(where);
  const ideas = await db.select().from(ideasTable).where(where).orderBy(orderBy).limit(limit).offset(offset);

  const enriched = await Promise.all(ideas.map((i) => enrichIdea(i, userId)));

  res.json({ ideas: enriched, total, page, limit, totalPages: Math.ceil(total / limit) });
});

router.post("/ideas", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const parsed = CreateIdeaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const qualityScore = computeQualityScore(parsed.data);

  const [idea] = await db.insert(ideasTable).values({
    ...parsed.data,
    ownerId: userId,
    qualityScore,
  }).returning();

  // Create default venture elements
  await db.insert(ventureElementsTable).values(
    VENTURE_ELEMENTS_DEFAULT.map((element) => ({ ideaId: idea.id, element, status: "not_started" }))
  );

  req.log.info({ ideaId: idea.id }, "Idea created");
  const enriched = await enrichIdea(idea, userId);
  res.status(201).json(enriched);
});

router.get("/ideas/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req) ?? undefined;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetIdeaParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }

  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, params.data.id));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }

  const enriched = await enrichIdea(idea, userId);
  const ventureElements = await db.select().from(ventureElementsTable).where(eq(ventureElementsTable.ideaId, idea.id));
  const marketFitRegions = await db.select().from(marketFitRegionsTable).where(eq(marketFitRegionsTable.ideaId, idea.id));

  res.json({ ...enriched, ventureElements, marketFitRegions });
});

router.put("/ideas/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateIdeaParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateIdeaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [existing] = await db.select().from(ideasTable).where(eq(ideasTable.id, params.data.id));
  if (!existing) { res.status(404).json({ error: "Idea not found" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (existing.ownerId !== userId && user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  // Recompute quality score on update
  const merged = { ...existing, ...parsed.data };
  const qualityScore = computeQualityScore(merged);

  const [updated] = await db.update(ideasTable)
    .set({ ...parsed.data, qualityScore })
    .where(eq(ideasTable.id, params.data.id))
    .returning();
  const enriched = await enrichIdea(updated, userId);
  res.json(enriched);
});

router.delete("/ideas/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [existing] = await db.select().from(ideasTable).where(eq(ideasTable.id, id));
  if (!existing) { res.status(404).json({ error: "Idea not found" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (existing.ownerId !== userId && user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  await db.delete(ideasTable).where(eq(ideasTable.id, id));
  res.json({ message: "Idea deleted" });
});

// Venture elements
router.get("/ideas/:id/venture-elements", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const elements = await db.select().from(ventureElementsTable).where(eq(ventureElementsTable.ideaId, id));
  res.json(elements);
});

router.put("/ideas/:id/venture-elements", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, id));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (idea.ownerId !== userId) { res.status(403).json({ error: "Forbidden" }); return; }

  const { elements } = req.body;
  if (!Array.isArray(elements)) { res.status(400).json({ error: "elements must be an array" }); return; }

  await db.delete(ventureElementsTable).where(eq(ventureElementsTable.ideaId, id));
  if (elements.length > 0) {
    await db.insert(ventureElementsTable).values(elements.map((e: { element: string; status: string }) => ({
      ideaId: id, element: e.element, status: e.status,
    })));
  }

  const updated = await db.select().from(ventureElementsTable).where(eq(ventureElementsTable.ideaId, id));
  res.json(updated);
});

// Market fit
router.get("/ideas/:id/market-fit", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const regions = await db.select().from(marketFitRegionsTable).where(eq(marketFitRegionsTable.ideaId, id));
  res.json(regions);
});

router.post("/ideas/:id/market-fit", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, id));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }
  if (idea.ownerId !== userId) { res.status(403).json({ error: "Forbidden" }); return; }

  const [region] = await db.insert(marketFitRegionsTable).values({ ...req.body, ideaId: id }).returning();
  res.status(201).json(region);
});

// Follow
router.post("/ideas/:id/follow", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [existing] = await db.select().from(followsTable).where(and(eq(followsTable.userId, userId), eq(followsTable.ideaId, id)));
  if (existing) {
    await db.delete(followsTable).where(and(eq(followsTable.userId, userId), eq(followsTable.ideaId, id)));
    res.json({ isFollowing: false });
  } else {
    await db.insert(followsTable).values({ userId, ideaId: id });
    res.json({ isFollowing: true });
  }
});

export default router;
