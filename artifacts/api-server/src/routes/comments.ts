import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, commentsTable, usersTable, ideasTable } from "@workspace/db";
import { CreateCommentBody } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any): number | null {
  return (req.session as Record<string, unknown>).userId as number | null;
}

router.get("/ideas/:id/comments", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ideaId = parseInt(raw, 10);

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
    .where(eq(commentsTable.ideaId, ideaId))
    .orderBy(desc(commentsTable.createdAt));

  res.json(comments);
});

router.post("/ideas/:id/comments", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ideaId = parseInt(raw, 10);

  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, ideaId));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }

  const [comment] = await db.insert(commentsTable).values({ ideaId, authorId: userId, content: parsed.data.content }).returning();

  // Increment comments count
  await db.update(ideasTable).set({ commentsCount: idea.commentsCount + 1 }).where(eq(ideasTable.id, ideaId));

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  res.status(201).json({ ...comment, authorName: user.name });
});

router.delete("/comments/:commentId", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.commentId) ? req.params.commentId[0] : req.params.commentId;
  const commentId = parseInt(raw, 10);

  const [comment] = await db.select().from(commentsTable).where(eq(commentsTable.id, commentId));
  if (!comment) { res.status(404).json({ error: "Comment not found" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (comment.authorId !== userId && user?.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  await db.delete(commentsTable).where(eq(commentsTable.id, commentId));

  // Decrement comment count
  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, comment.ideaId));
  if (idea) {
    await db.update(ideasTable).set({ commentsCount: Math.max(0, idea.commentsCount - 1) }).where(eq(ideasTable.id, comment.ideaId));
  }

  res.json({ message: "Comment deleted" });
});

export default router;
