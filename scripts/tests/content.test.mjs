import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { buildContent } from '../build-content.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'sure-content-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'content/projects'), { recursive: true });
  await mkdir(join(root, 'public/projects/uploads'), { recursive: true });
  await cp('content/company.json', join(root, 'content/company.json'));
  return { root, save: (id, changes = {}) => writeFile(join(root, 'content/projects', id+'.json'),
    JSON.stringify({ id, title: 'QA example', displayOrder: 10, ...changes })) };
}

test('new projects default to draft; only published records enter client data in display order', async t => {
  const {root,save} = await fixture(t);
  await save('alpha', { published: true, displayOrder: 20 });
  await save('beta', { published: true, displayOrder: 1 });
  await save('private-example');
  const built = await buildContent(root);
  assert.deepEqual(built.projects.map(p => p.id), ['beta','alpha']);
  assert.equal((await readFile(join(root, 'src/lib/generated/content.json'), 'utf8')).includes('private-example'), false);
});

test('upload and attach an image; retain alt and caption and generate a readable WebP', async t => {
  const {root,save} = await fixture(t);
  const src = '/projects/uploads/acceptance.png';
  await sharp({create:{width:2048,height:256,channels:3,background:'#334466'}}).png().toFile(join(root,'public',src));
  await save('demo', { title:'Edited QA record', published:true, photos:[{src,alt:'Blue test panel for review.',description:'Caption for review.'}] });
  const item = (await buildContent(root)).projects[0];
  assert.equal(item.title, 'Edited QA record');
  const [photo] = item.photos;
  assert.equal(photo.alt, 'Blue test panel for review.');
  assert.equal(photo.description, 'Caption for review.');
  const result = await sharp(join(root,'public',photo.src)).metadata();
  assert.equal(result.format, 'webp');
  assert.equal(result.width, 1920);
  await save('other',{photos:[{src,alt:'Same image already in use.'}]});
  await assert.rejects(buildContent(root), /already attached/);
});

test('rejected records identify the file and preserve the last generated data', async t => {
  const {root,save} = await fixture(t);
  await save('example', { published: true });
  await buildContent(root);
  const file=join(root,'src/lib/generated/content.json');
  const before=await readFile(file,'utf8');
  for (const [changes,why] of [
    [{id:'renamed'},'stable ID'], [{title:'  '},'title'], [{published:'yes'},'published'],
    [{formEndpoint:'unexpected'},'Unrecognized'], [{displayOrder:-2},'displayOrder'],
    [{photos:[{src:'/projects/uploads/missing.jpg',alt:'A missing photo.'}]},'Missing or invalid'],
    [{photos:[{src:'/projects/2026/../../brand/logo.svg',alt:'A traversal path.'}]},'photos.0.src'],
    [{photos:[{src:'/projects/uploads/example.jpg',alt:' '} ]},'photos.0.alt'],
  ]) {
    await save('example',changes);
    await assert.rejects(buildContent(root), e => e.message.includes('example.json') && e.message.includes(why));
  }
  await writeFile(join(root,'content/projects/example.json'),'{oops');
  await assert.rejects(buildContent(root), /example.json/);
  assert.equal(await readFile(file,'utf8'),before);
});

test('reject duplicate job numbers, invalid company fields and disguised, oversized or misplaced uploads', async t => {
  const {root,save} = await fixture(t);
  await save('a',{sourceJobNumber:1}); await save('b',{sourceJobNumber:1});
  const company = JSON.parse(await readFile(join(root,'content/company.json'),'utf8'));
  await writeFile(join(root,'content/company.json'),JSON.stringify({...company,publicPhone:'javascript:bad'}));
  await writeFile(join(root,'public/projects/uploads/not-a-photo.jpg'),'fake JPEG');
  await writeFile(join(root,'public/projects/uploads/large.png'),Buffer.alloc(10_000_001));
  await writeFile(join(root,'public/projects/wrong.jpg'),'wrong folder');
  await assert.rejects(buildContent(root,false), e => ['Duplicate job','publicPhone','not-a-photo','10 MB','wrong.jpg'].every(msg => e.message.includes(msg)));
});
