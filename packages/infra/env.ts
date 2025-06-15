import { z } from 'zod';
import * as dotenv from 'dotenv';
import { join } from 'path';

const envSchema = z.object({
  POSTGRES_URL: z.string().url(),
});

export function loadEnvConfig() {
  dotenv.config({ path: join(__dirname, '.env') });
  
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.errors)}`);
  }
  
  return parsed.data;
}