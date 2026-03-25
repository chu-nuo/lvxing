import { Router } from "express";
import { photochallengePlan } from "../controllers/photochallenge.controller";

export const photochallengeRouter = Router();

photochallengeRouter.post("/plan", photochallengePlan);

