import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, votesTable, ideasTable } from "@workspace/db";
import { VoteOnIdeaBody } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any): number | null {
  return (req.session as Record<string, unknown>).userId as number | null;
}

router.post("/ideas/:id/vote", async (req, res): Promise<void> => {
  const userId = requireAuth(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ideaId = parseInt(raw, 10);

  const parsed = VoteOnIdeaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [idea] = await db.select().from(ideasTable).where(eq(ideasTable.id, ideaId));
  if (!idea) { res.status(404).json({ error: "Idea not found" }); return; }

  const [existing] = await db.select().from(votesTable).where(and(eq(votesTable.userId, userId), eq(votesTable.ideaId, ideaId)));

  let userVote: string | null = parsed.data.vote;

  if (existing) {
    if (existing.vote === parsed.data.vote) {
      // Remove vote (toggle off)
      await db.delete(votesTable).where(and(eq(votesTable.userId, userId), eq(votesTable.ideaId, ideaId)));
      userVote = null;
    } else {
      // Change vote
      await db.update(votesTable).set({ vote: parsed.data.vote }).where(and(eq(votesTable.userId, userId), eq(votesTable.ideaId, ideaId)));
    }
  } else {
    await db.insert(votesTable).values({ userId, ideaId, vote: parsed.data.vote });
  }

  // Recalculate vote counts
  const allVotes = await db.select().from(votesTable).where(eq(votesTable.ideaId, ideaId));
  const upvotes = allVotes.filter((v) => v.vote === "up").length;
  const downvotes = allVotes.filter((v) => v.vote === "down").length;
  const score = upvotes - downvotes;

  await db.update(ideasTable).set({ upvotes, downvotes, score }).where(eq(ideasTable.id, ideaId));

  res.json({ upvotes, downvotes, score, userVote });
});

export default router;
