import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128)
});

export const loginSchema = signupSchema;

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;