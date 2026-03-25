import { Router } from "express";
import { reverse } from "../controllers/reverse.controller";

export const reverseRouter = Router();

reverseRouter.post("/", reverse);

