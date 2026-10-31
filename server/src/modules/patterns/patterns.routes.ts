import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as controller from "./patterns.controller.js";

export const patternsRouter = Router();

patternsRouter.use(requireAuth);
patternsRouter.get("/", controller.summary);