import { Router } from "express";
import { blindboxRecommend } from "../controllers/blindbox.controller";

export const blindboxRouter = Router();

blindboxRouter.post("/recommend", blindboxRecommend);

