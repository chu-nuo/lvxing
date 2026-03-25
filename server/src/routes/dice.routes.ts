import { Router } from "express";
import { diceVlogScript } from "../controllers/dice.controller";

export const diceRouter = Router();

diceRouter.post("/vlog-script", diceVlogScript);

