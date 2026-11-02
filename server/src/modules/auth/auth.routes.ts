import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimit.js";
import * as authController from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/signup", authLimiter, authController.signup);
authRouter.post("/login", authLimiter, authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);

authRouter.get("/sessions", requireAuth, authController.getSessions);
authRouter.delete("/sessions", requireAuth, authController.revokeOthers);
authRouter.post("/forgot-password", authLimiter, authController.forgotPassword);
authRouter.post("/reset-password", authLimiter, authController.resetPassword);authRouter.delete("/account", requireAuth, authController.deleteAccount);