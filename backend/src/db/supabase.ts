import { createClient } from '@supabase/supabase-js';
import { Pool, PoolClient, QueryResultRow } from 'pg';
import WebSocket from 'ws';
import { env } from '../config/env';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket as any }
});

export const pool = new Pool({
  connectionString: env.SUPABASE_DB_URL,
  max: 10,
  ssl: { rejectUnauthorized: false }
});

export type DbClient = Pool | PoolClient;
export async function query<T extends QueryResultRow = any>(text: string, values: unknown[] = [], client: DbClient = pool) {
  return client.query<T>(text, values);
}
export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();
  try { await client.query('begin'); const result = await work(client); await client.query('commit'); return result; }
  catch (error) { await client.query('rollback'); throw error; }
  finally { client.release(); }
}
export async function closeDatabase() { await pool.end(); }
