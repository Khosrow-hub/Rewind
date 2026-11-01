import { Router } from "express";
import * as controller from "./reminders.controller.js";

export const remindersRouter = Router();

remindersRouter.post("/trigger", controller.triggerReminders);