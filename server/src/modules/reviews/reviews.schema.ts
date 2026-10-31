import { z } from "zod";

const outcomeMetEnum = z.enum(["FULLY", "PARTIALLY", "NOT_AT_ALL"]);
const processSoundEnum = z.enum(["YES", "PARTIALLY", "NO"]);
const wouldDecideAgainEnum = z.enum(["YES", "MAYBE", "NO"]);
const reviewKindEnum = z.enum(["INTERIM", "FINAL"]);

export const submitReplayChoiceSchema = z.object({
  replayChoice: z.string().min(1).max(200) // We will validate this against options in the service
});

export const createReviewSchema = z.object({
  kind: reviewKindEnum,
  whatHappened: z.string().min(1).max(5000),
  outcomeMet: outcomeMetEnum,
  processSound: processSoundEnum,
  wouldDecideAgain: wouldDecideAgainEnum,
  lesson: z.string().max(2000).optional(),
  assumptionResults: z
    .array(
      z.object({
        assumptionId: z.string().min(1),
        result: z.enum(["TRUE", "FALSE", "PARTIAL"]),
        resultNote: z.string().max(1000).optional()
      })
    )
    .optional()
});

export type SubmitReplayChoiceInput = z.infer<typeof submitReplayChoiceSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;