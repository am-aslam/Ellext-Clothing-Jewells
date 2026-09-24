import 'dotenv/config';
import { query, closeDatabase } from '../src/db/supabase';

async function main() {
  for (const category of [
    { name: 'Clothing', slug: 'clothing', description: 'Ellext atelier clothing.' },
    { name: 'Jewells', slug: 'jewells', description: 'Ellext fine jewells.' }
  ]) {
    await query(
      'insert into categories(name,slug,description) values($1,$2,$3) on conflict(slug) do update set name=excluded.name',
      [category.name, category.slug, category.description]
    );
  }

  console.log('Base categories are ready. Products and collections are added by admins through the admin portal.');
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => closeDatabase());
