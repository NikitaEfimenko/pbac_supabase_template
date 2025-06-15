import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DrizzleConfig } from 'drizzle-orm/utils';
import { loadEnvConfig } from './env';

const env = loadEnvConfig();

const config = {
  casing: 'snake_case',
  schema,
} satisfies DrizzleConfig<typeof schema>;

// Админское подключение без RLS
const adminPostgresClient = postgres(env.POSTGRES_URL, { 
  prepare: false,
});

// RLS подключение с контекстом пользователя
const createRlsPostgresClient = (userId?: string) => postgres(env.POSTGRES_URL, {
  prepare: false,
  connection: {
    // Set user context for RLS
    options: userId ? `app.user_id=${userId}` : undefined
  }
});

export { adminClient, createRlsClient } from './server/database';