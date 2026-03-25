import { Router } from "express";
import { recommend } from "../controllers/recommend.controller";

export const recommendRouter = Router();

recommendRouter.post("/", recommend);

