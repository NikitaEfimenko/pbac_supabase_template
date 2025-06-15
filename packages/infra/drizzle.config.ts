import type { Config } from './node_modules/drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;