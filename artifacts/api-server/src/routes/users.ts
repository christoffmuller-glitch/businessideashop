import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, ideasTable, followsTable, contributionsTable } from "@workspace/db";
import { UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any): number | null {
  return (req.session as Record<string, unknown>).userId as number | null;
}

router.get("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const [{ ideasCount }] = await db
    .select({ ideasCount: db.$count(ideasTable, eq(ideasTable.ownerId, id)) })
    .from(ideasTable)
    .where(eq(ideasTable.ownerId, id))
    .limit(1);

  const followedIdeas = await db.select().from(followsTable).where(eq(followsTable.userId, id));
  const contributions = await db.select().from(contributionsTable).where(eq(contributionsTable.userId, id));

  const { passwordHash: _pw, email: _em, ...safeUser } = user;
  res.json({
    ...safeUser,
    ideasCount: Number(ideasCount ?? 0),
    followedIdeasCount: followedIdeas.length,
    contributionsCount: contributions.length,
  });
});

router.get("/users/:id/ideas", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const ideas = await db.select().from(ideasTable).where(eq(ideasTable.ownerId, id));

  const enriched = await Promise.all(ideas.map(async (idea) => {
    const [owner] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, idea.ownerId));
    return { ...idea, ownerName: owner?.name ?? "Unknown", userVote: null, isFollowing: null };
  }));

  res.json(enriched);
});

router.put("/profile", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, userId)).returning();
  const { passwordHash: _pw, ...safe } = updated;
  res.json(safe);
});

export default router;
