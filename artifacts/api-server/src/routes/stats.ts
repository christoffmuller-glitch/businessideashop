import { Router, type IRouter } from "express";
import { desc, sql, eq } from "drizzle-orm";
import { db, ideasTable, usersTable, votesTable, contributionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/overview", async (_req, res): Promise<void> => {
  const [{ totalIdeas }] = await db.select({ totalIdeas: sql<number>`count(*)::int` }).from(ideasTable).where(eq(ideasTable.status, "active"));
  const [{ totalUsers }] = await db.select({ totalUsers: sql<number>`count(*)::int` }).from(usersTable);
  const [{ totalVotes }] = await db.select({ totalVotes: sql<number>`count(*)::int` }).from(votesTable);
  const [{ totalContributions }] = await db.select({ totalContributions: sql<number>`count(*)::int` }).from(contributionsTable);

  const stageRows = await db
    .select({ stage: ideasTable.maturityStage, count: sql<number>`count(*)::int` })
    .from(ideasTable)
    .where(eq(ideasTable.status, "active"))
    .groupBy(ideasTable.maturityStage)
    .orderBy(desc(sql`count(*)`));

  res.json({
    totalIdeas,
    totalUsers,
    totalVotes,
    totalContributions,
    ideasByStage: stageRows.map((r) => ({ stage: r.stage, count: r.count })),
  });
});

router.get("/stats/trending", async (_req, res): Promise<void> => {
  const ideas = await db.select().from(ideasTable)
    .where(eq(ideasTable.status, "active"))
    .orderBy(desc(sql`${ideasTable.upvotes} + ${ideasTable.commentsCount}`))
    .limit(10);

  const enriched = await Promise.all(ideas.map(async (idea) => {
    const [owner] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, idea.ownerId));
    return { ...idea, ownerName: owner?.name ?? "Unknown", userVote: null, isFollowing: null };
  }));

  res.json(enriched);
});

router.get("/stats/industries", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ industry: ideasTable.industry, count: sql<number>`count(*)::int` })
    .from(ideasTable)
    .where(eq(ideasTable.status, "active"))
    .groupBy(ideasTable.industry)
    .orderBy(desc(sql`count(*)`));

  res.json(rows);
});

export default router;
