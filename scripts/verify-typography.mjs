import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.env.TEST_STATIC_DIR || 'out');
const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = process.env.TEST_BASE_URL ? null : createServer(async (request, response) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path += '/index.html';
    response.setHeader('Content-Type', mimeTypes[extname(path)] || 'application/octet-stream');
    response.end(await readFile(path));
  } catch { response.writeHead(404); response.end('Not found'); }
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({executablePath: process.env.BROWSER_EXECUTABLE_PATH, args:['--no-sandbox','--disable-dev-shm-usage']});
const base = process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
try {
 for(const width of [320,390,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.match(await page.locator('body').evaluate(e=>getComputedStyle(e).fontFamily),/Outfit/);
  assert.match(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily),/Michroma/);
  assert.equal(await page.getByRole('heading',{level:1,name:'SURE Mechanical',exact:true}).count(),1);
  assert.equal(await page.getByRole('heading',{name:'Experienced. Inclusive. Diverse.',exact:true}).count(),1);
  for(const theme of ['light','dark']) {
   await page.evaluate(theme=>{document.documentElement.dataset.theme=theme},theme);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width} ${theme}: page overflow`);
   const clipped=await page.locator('.type-word-mask, .hero-title .thermal-word').evaluateAll(es=>es.filter(e=>{const b=e.getBoundingClientRect();return b.left < -1 || b.right > innerWidth+1}).map(e=>e.textContent));
   assert.deepEqual(clipped,[],`${width} ${theme}: clipped words`);
   if([390,1440].includes(width)) {
    await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(theme=>{document.documentElement.dataset.theme=theme},theme);
    await page.screenshot({path:`docs/qa/type-${width}-${theme}-hero.png`});
    for(const [name,selector] of [['about','#our-story'],['service','#service'],['projects','#projects'],['contact','#cta']])await page.locator(selector).screenshot({path:`docs/qa/type-${width}-${theme}-${name}.png`});
   }
  }
  if(width===320) {
   await page.evaluate(()=>document.documentElement.style.fontSize='20px');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'320: enlarged text overflow');
   const largeClip=await page.locator('.type-word-mask, .hero-title .thermal-word').evaluateAll(es=>es.filter(e=>{const b=e.getBoundingClientRect();return b.left < -1 || b.right > innerWidth+1}).map(e=>e.textContent));
   assert.deepEqual(largeClip,[],'320: enlarged text clipped words');
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${width}: loaded Michroma/Outfit, accessible title, light/dark layout, no clipped words or overflow.`);await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:900}});const page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});
 await page.locator('#projects').scrollIntoViewIfNeeded();await page.waitForTimeout(1400);
 assert.ok(await page.locator('#projects .type-word').first().evaluate(e=>+getComputedStyle(e).opacity)>.99);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(250);
 assert.equal(await page.locator('#projects .type-word').first().evaluate(e=>getComputedStyle(e).opacity),'1');
 console.log('PASS text entrance and reduced-motion restoration.');await context.close();
}finally{await browser.close();server?.close();}
