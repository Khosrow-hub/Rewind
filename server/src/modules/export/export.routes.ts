import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as controller from "./export.controller.js";

export const exportRouter = Router();

exportRouter.use(requireAuth);
exportRouter.get("/json", controller.json);
exportRouter.get("/csv", controller.csv);