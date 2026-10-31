import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().min(1).default("rewind_session"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173")
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

// The non-null assertion (!) tells TypeScript the data is definitely here.
export const env = parsed.data!;