import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, realpath, rename, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { z } from 'zod';

const text = max => z.string().trim().min(1, 'Enter some text').max(max);
const optionalText = max => z.string().trim().max(max).nullish().transform(v => v || '');
// Pages CMS can submit numeric form inputs as decimal strings and cleared fields as empty strings.
const integerInput = schema => z.preprocess(value =>
  typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value, schema);
const galleryPath = /^\/projects\/(2026|uploads)\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.(jpe?g|png|webp)$/i;
const photo = z.strictObject({
  src: z.string().regex(galleryPath, 'Choose a file in Project Photos / uploads or 2026'),
  alt: text(300).min(8).refine(v => !/^(photo|image|picture)(\s*\d+)?$|\.(png|jpe?g|webp)$/i.test(v), 'Describe what is visible'),
  description: optionalText(1000),
});
const project = z.strictObject({
  id: text(80).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: text(180),
  customer: optionalText(240).transform(v => v || null),
  customers: z.array(text(240)).max(30).nullish().transform(v => v ?? []),
  sourceJobNumber: z.preprocess(v => v === '' ? null : v, integerInput(z.number().int().positive().max(999999999).nullish())),
  scope: optionalText(4000).transform(v => v || null),
  photos: z.array(photo).max(100).nullish().transform(v => v ?? []),
  displayOrder: integerInput(z.number().int().min(0).max(100000)),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});
const companySchema = z.strictObject({
  description: text(1000),
  publicPhone: optionalText(40).refine(v => !v || (/^\+?[\d(). -]+$/.test(v) && /^\d{7,15}$/.test(v.replace(/\D/g,''))), 'Enter a public phone number with 7 to 15 digits'),
  officeAddress: optionalText(300),
  engineeringDescription: text(1000), heatingCoolingDescription: text(1000), installationDescription: text(1000),
  projectsHeading: text(120), projectsIntroduction: text(1000),
  contactHeading: text(120), contactIntroduction: text(1000),
  projectContactText: text(1000), generalContactText: text(1000), hrContactText: text(1000),
});

async function regularFile(root, relative) {
  const location = join(root, relative);
  if (await realpath(location) !== location || !(await lstat(location)).isFile())
    throw new Error('Expected an ordinary file inside the repository');
  return location;
}

async function readRecord(root, path, schema) {
  const location = await regularFile(root, path);
  if ((await lstat(location)).size > 256 * 1024) throw new Error('JSON file is too large');
  const data = schema.safeParse(JSON.parse(await readFile(location, 'utf8')));
  if (!data.success) throw new Error(data.error.issues.map(i => i.path.join('.') + ': ' + i.message).join('; '));
  return data.data;
}

async function checkPhoto(root, src, writeDerivative) {
  if (!galleryPath.test(src)) throw new Error('Use a JPG, PNG or WebP in 2026/ or uploads/');
  const file = await regularFile(root, 'public' + src);
  if ((await lstat(file)).size > 10_000_000) throw new Error('Resize this image to 10 MB or less');
  const image = sharp(file, { limitInputPixels: 40_000_000, failOn: 'warning' });
  const meta = await image.metadata();
  const format = extname(file).slice(1).toLowerCase().replace(/^jpg$/, 'jpeg');
  if (meta.format !== format || (meta.pages || 1) > 1) throw new Error('The file must be a still image matching its extension');
  if (Math.min(meta.width, meta.height) < 160 || Math.max(meta.width, meta.height) > 10000)
    throw new Error('Use an image between 160 and 10,000 pixels on each side');
  // Decode the entire image, catching damaged pixel data as well as invalid headers.
  const thumbnail = await image.rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  if (!src.startsWith('/projects/uploads/')) return src;
  const output = '/_cms/' + createHash('sha256').update(thumbnail).digest('hex') + '.webp';
  if (writeDerivative) {
    await mkdir(join(root, 'public/_cms'), { recursive: true });
    await writeFile(join(root, 'public', output), thumbnail);
  }
  return output;
}

export async function buildContent(directory, write = true) {
  const root = await realpath(directory);
  const errors = [], records = [], seenJobs = new Set(), photoOwners = new Map(), media = new Map();
  let company;
  try { company = await readRecord(root, 'content/company.json', companySchema); }
  catch (e) { errors.push('content/company.json: ' + e.message); }
  // Check every item in the editable media library, including unattached uploads.
  for (const folder of await readdir(join(root, 'public/projects'), { withFileTypes: true })) {
    if (!folder.isDirectory() || !['uploads','2026'].includes(folder.name)) {
      errors.push('public/projects/' + folder.name + ': place new photos in uploads/'); continue;
    }
    for (const entry of await readdir(join(root, 'public/projects', folder.name))) {
      if (entry === '.gitkeep' && folder.name === 'uploads' && (await lstat(await regularFile(root, 'public/projects/uploads/.gitkeep'))).size === 0) continue;
      const src = '/projects/' + folder.name + '/' + entry;
      try { media.set(src, await checkPhoto(root, src, write)); }
      catch (e) { errors.push(src + ': ' + e.message); }
    }
  }
  for (const name of (await readdir(join(root, 'content/projects'))).sort()) {
    const path = 'content/projects/' + name;
    try {
      const record = await readRecord(root, path, project);
      if (name !== record.id + '.json') throw new Error('The stable ID must match the original filename');
      if (record.sourceJobNumber != null) {
        if (seenJobs.has(record.sourceJobNumber)) throw new Error('Duplicate job number ' + record.sourceJobNumber);
        seenJobs.add(record.sourceJobNumber);
      }
      for (const item of record.photos) {
        if (!media.has(item.src)) throw new Error('Missing or invalid photo: ' + item.src);
        if (photoOwners.has(item.src)) throw new Error('Photo already attached to ' + photoOwners.get(item.src) + ': ' + item.src);
        photoOwners.set(item.src, record.id);
        item.src = media.get(item.src);
      }
      records.push(record);
    } catch (e) { errors.push(path + ': ' + e.message); }
  }
  if (errors.length) throw new Error('Content check failed:\n' + errors.map(e => '  ' + e).join('\n'));
  const projects = records.filter(p => p.published).sort((a,b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id, 'en'));
  const content = { company, projects };
  if (write) {
    const destination = join(root, 'src/lib/generated/content.json');
    await mkdir(dirname(destination), { recursive: true });
    const temporary = destination + '.' + randomUUID();
    await writeFile(temporary, JSON.stringify(content) + '\n');
    await rename(temporary, destination);
  }
  return content;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const content = await buildContent(process.cwd(), !process.argv.includes('--validate-only'));
    console.log('Content OK. ' + content.projects.length + ' published projects.');
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
