import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as controller from "./reviews.controller.js";

export const reviewsRouter = Router();

reviewsRouter.use(requireAuth);
reviewsRouter.get("/:id/review/context", controller.context);
reviewsRouter.post("/:id/review/replay", controller.replay);
reviewsRouter.get("/:id/review/reveal", controller.reveal);
reviewsRouter.post("/:id/review", controller.create);