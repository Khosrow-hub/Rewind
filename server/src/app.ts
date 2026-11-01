import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { decisionsRouter } from "./modules/decisions/decisions.routes.js";
import { reviewsRouter } from "./modules/reviews/reviews.routes.js";
import { patternsRouter } from "./modules/patterns/patterns.routes.js";
import { exportRouter } from "./modules/export/export.routes.js";
import { remindersRouter } from "./modules/reminders/reminders.routes.js"; // NEW
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.use("/api/decisions", reviewsRouter);
  app.use("/api/decisions", decisionsRouter);
  app.use("/api/patterns", patternsRouter);
  app.use("/api/export", exportRouter);
  app.use("/api/reminders", remindersRouter); // NEW

  app.use(errorHandler);
  return app;
}