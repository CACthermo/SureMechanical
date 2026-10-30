import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import sharp from 'sharp';

// Originals remain with the client. Usage: node scripts/prepare-project-photos.mjs /path/to/originals
if (!process.argv[2]) throw new Error('Pass the directory containing the original client photos.');
const originals = resolve(process.argv[2]);
const entries = JSON.parse(await readFile('docs/project-photo-source-map.json', 'utf8'));
for (const entry of entries) {
  const bytes = await readFile(resolve(originals, entry.originalFilename));
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw new Error(`Source changed: ${entry.originalFilename}`);
  const destination = resolve('public', '.' + entry.output);
  await mkdir(dirname(destination), { recursive: true });
  // Faithful resize/encoding only: no retouching, recoloring, or synthesized content.
  await sharp(bytes).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 84 }).toFile(destination);
}
console.log(`Prepared ${entries.length} project photographs.`);
