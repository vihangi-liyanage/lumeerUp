import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('4000'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
