import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be set and reasonably long"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  CREDENTIALS_ENC_KEY: z
    .string()
    .refine((val) => Buffer.from(val, "base64").length === 32, {
      message: "CREDENTIALS_ENC_KEY must be a base64-encoded 32-byte key",
    }),
  UPLOAD_DIR: z.string().default("uploads"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration. Check apps/api/.env against .env.example.");
}

export const env = parsed.data;
