import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as controller from "./decisions.controller.js";

export const decisionsRouter = Router();

decisionsRouter.use(requireAuth);
decisionsRouter.post("/", controller.create);
decisionsRouter.get("/", controller.list);
decisionsRouter.get("/:id", controller.detail);
decisionsRouter.patch("/:id", controller.update);
decisionsRouter.delete("/:id", controller.remove);