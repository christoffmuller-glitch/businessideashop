import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, ideasTable, usersTable, commentsTable } from "@workspace/db";

const router: IRouter = Router();

async function requireAdmin(req: any, res: any): Promise<boolean> {
  const userId = (req.session as Record<string, unknown>).userId as number | null;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return false; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Admin access required" }); return false; }
  return true;
}

router.get("/admin/ideas", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const page = parseInt((req.query.page as string) ?? "1", 10);
  const limit = parseInt((req.query.limit as string) ?? "20", 10);
  const offset = (page - 1) * limit;

  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(ideasTable);
  const ideas = await db.select().from(ideasTable).orderBy(desc(ideasTable.createdAt)).limit(limit).offset(offset);

  const enriched = await Promise.all(ideas.map(async (idea) => {
    const [owner] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, idea.ownerId));
    return { ...idea, ownerName: owner?.name ?? "Unknown", userVote: null, isFollowing: null };
  }));

  res.json({ ideas: enriched, total, page, limit, totalPages: Math.ceil(total / limit) });
});

router.put("/admin/ideas/:id/status", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status } = req.body;
  if (!["active", "removed"].includes(status)) {
    res.status(400).json({ error: "Invalid status" }); return;
  }

  const [updated] = await db.update(ideasTable).set({ status }).where(eq(ideasTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Idea not found" }); return; }

  const [owner] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, updated.ownerId));
  res.json({ ...updated, ownerName: owner?.name ?? "Unknown", userVote: null, isFollowing: null });
});

router.get("/admin/users", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const page = parseInt((req.query.page as string) ?? "1", 10);
  const limit = parseInt((req.query.limit as string) ?? "20", 10);
  const offset = (page - 1) * limit;

  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(usersTable);
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset);

  const safeUsers = users.map(({ passwordHash: _pw, ...u }) => u);
  res.json({ users: safeUsers, total, page, limit, totalPages: Math.ceil(total / limit) });
});

router.put("/admin/users/:id/role", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    res.status(400).json({ error: "Invalid role" }); return;
  }

  const [updated] = await db.update(usersTable).set({ role }).where(eq(usersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }

  const { passwordHash: _pw, ...safe } = updated;
  res.json(safe);
});

router.get("/admin/comments", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const page = parseInt((req.query.page as string) ?? "1", 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(commentsTable);
  const comments = await db
    .select({
      id: commentsTable.id,
      ideaId: commentsTable.ideaId,
      authorId: commentsTable.authorId,
      content: commentsTable.content,
      createdAt: commentsTable.createdAt,
      authorName: usersTable.name,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .orderBy(desc(commentsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json({ comments, total, page, totalPages: Math.ceil(total / limit) });
});

export default router;
