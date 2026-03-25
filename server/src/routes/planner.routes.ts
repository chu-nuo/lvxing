import { Router } from "express";
import { planner } from "../controllers/planner.controller";

export const plannerRouter = Router();

plannerRouter.post("/", planner);

