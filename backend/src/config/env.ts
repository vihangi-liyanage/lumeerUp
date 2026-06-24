import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
