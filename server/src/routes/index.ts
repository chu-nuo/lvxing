import { Router } from "express";
import { healthRouter } from "./health.routes";
import { recommendRouter } from "./recommend.routes";
import { plannerRouter } from "./planner.routes";
import { reverseRouter } from "./reverse.routes";
import { diceRouter } from "./dice.routes";
import { blindboxRouter } from "./blindbox.routes";
import { photochallengeRouter } from "./photochallenge.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/recommend", recommendRouter);
apiRouter.use("/planner", plannerRouter);
apiRouter.use("/reverse", reverseRouter);
apiRouter.use("/dice", diceRouter);
apiRouter.use("/blindbox", blindboxRouter);
apiRouter.use("/photochallenge", photochallengeRouter);

