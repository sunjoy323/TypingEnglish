import fs from 'node:fs/promises';
import path from 'node:path';

const TEMPLATE_PATH = path.resolve('wrangler.with-db.toml');
// Keep the resolved config next to the repo root so relative paths (e.g. `main = "worker/index.js"`)
// keep working. The file is gitignored.
const OUTPUT_PATH = path.resolve('wrangler.resolved.toml');

const databaseId = (process.env.D1_DATABASE_ID || '').trim();
if (!databaseId) {
  console.error(
    '[resolve-wrangler-config] Missing env var D1_DATABASE_ID (set it in Cloudflare Git integration build environment variables).'
  );
  process.exit(1);
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidPattern.test(databaseId)) {
  console.error(`[resolve-wrangler-config] Invalid D1_DATABASE_ID: "${databaseId}". Expected a UUID like xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.`);
  process.exit(1);
}

const template = await fs.readFile(TEMPLATE_PATH, 'utf8');
if (!template.includes('${D1_DATABASE_ID}')) {
  console.error('[resolve-wrangler-config] Template missing ${D1_DATABASE_ID} placeholder: wrangler.with-db.toml');
  process.exit(1);
}

const rendered = template.replaceAll('${D1_DATABASE_ID}', databaseId);

await fs.writeFile(OUTPUT_PATH, rendered, 'utf8');

console.log(`[resolve-wrangler-config] Wrote ${OUTPUT_PATH}`);
