import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { transaction } from '../src/db/supabase';
const dir = path.resolve(process.cwd(), 'supabase/migrations');
async function main(){const files=(await fs.readdir(dir)).filter(x=>x.endsWith('.sql')).sort();await transaction(async c=>{await c.query('create table if not exists public._ellext_migrations(name text primary key, applied_at timestamptz not null default now())');for(const file of files){const done=await c.query('select 1 from public._ellext_migrations where name=$1',[file]);if(done.rowCount)continue;await c.query(await fs.readFile(path.join(dir,file),'utf8'));await c.query('insert into public._ellext_migrations(name) values($1)',[file]);console.log(`Applied ${file}`);}});}
main().catch(e=>{console.error(e);process.exitCode=1;});
