import { z } from "zod";

const importanceEnum = z.enum(["LOW", "MEDIUM", "HIGH", "LIFE_CHANGING"]);

export const createDecisionSchema = z.object({
  title: z.string().min(1).max(200),
  reasoning: z.string().min(1).max(5000),
  expectedOutcome: z.string().min(1).max(2000),
  probability: z.number().int().min(1).max(100), // CHANGED
  importance: importanceEnum,
  options: z
    .array(z.object({ label: z.string().min(1).max(200) }))
    .min(2)
    .max(8),
  chosenOptionIndex: z.number().int().min(0),
  reviewAt: z.string().datetime(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  assumptions: z.array(
    z.object({ description: z.string().min(1).max(500) })
  ).optional()
});

export const updateDecisionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  reviewAt: z.string().datetime().optional(),
});

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;
export type UpdateDecisionInput = z.infer<typeof updateDecisionSchema>;