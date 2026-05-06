import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import ideasRouter from "./ideas";
import votesRouter from "./votes";
import commentsRouter from "./comments";
import contributionsRouter from "./contributions";
import usersRouter from "./users";
import statsRouter from "./stats";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(ideasRouter);
router.use(votesRouter);
router.use(commentsRouter);
router.use(contributionsRouter);
router.use(usersRouter);
router.use(statsRouter);
router.use(adminRouter);

export default router;
