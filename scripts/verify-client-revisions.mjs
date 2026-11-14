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
const base = `http://127.0.0.1:${server.address().port}`;
try {
for (const width of [390,768,1440]) {
 const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.route('https://formspree.io/**', route=>route.abort());
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});
 assert.equal(await page.locator('h1').innerText(),'SURE Mechanical');
 assert.deepEqual(await page.locator('main > section').evaluateAll(es=>es.slice(0,2).map(e=>e.id)),['hero','installation']);
 assert.equal(await page.locator('#our-story h4').count(),7);
 assert.equal(await page.locator('#cta details[open]').count(),0);
 assert.equal(await page.locator('a[href^="mailto:"]').count(),0);
 assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(es=>es.filter(e=>!document.getElementById(e.hash.slice(1))).map(e=>e.hash)),[]);
 await page.getByRole('button',{name:'Grid view',exact:true}).click();assert.equal(await page.locator('#project-cards button').count(),9);
 await page.locator('#projects details summary').click();assert.equal(await page.locator('#projects details li').count(),14);
 await page.locator('#project-search').fill('Lane');assert.match(await page.locator('#projects [role=status]').innerText(),/1 project/);
 await page.locator('#project-search').fill('');
 for(const kind of ['project','general','hr']) {
  const id=kind==='general'?'contact-form':`${kind}-form`;
  await page.locator(`#${id} summary`).click();
  const form=page.locator(`#${id} form`);await form.locator('[name=name]').fill('Review Test');await form.locator('[name=email]').fill('review@example.com');await form.locator('[name=message]').fill('Mock submission only');
  for(const [status,body] of [[422,{errors:[{message:'Rejected'}]}],[429,{errors:[{message:'Rate limit'}]}],[200,{ok:false}],[200,{ok:true}]]) {
   await context.unroute('https://formspree.io/**');
   await context.route('https://formspree.io/**', route=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)}));
   await form.locator('button[type=submit]').click();
   if(body.ok===true){await form.getByRole('status').waitFor();}else{await form.getByRole('alert').waitFor();assert.equal(await form.locator('[name=message]').inputValue(),'Mock submission only');assert.equal(await form.getByRole('status').count(),0);}
  }
 }
 await context.unroute('https://formspree.io/**');
 await context.route('https://formspree.io/**', route=>route.abort());
 await page.locator('#project-form summary').click();
 const failedForm=page.locator('#project-form form');await failedForm.locator('[name=name]').fill('Network Test');await failedForm.locator('[name=email]').fill('review@example.com');await failedForm.locator('[name=message]').fill('Retain after network error');await failedForm.locator('button[type=submit]').click();await failedForm.getByRole('alert').waitFor();assert.equal(await failedForm.locator('[name=message]').inputValue(),'Retain after network error');
 for(const theme of ['dark','light']) {
  await page.getByRole('button',{name:`Switch to ${theme} mode`}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:`docs/qa/hero-${width}.png`});
 await page.locator('#contact-form summary').click();await page.screenshot({path:`docs/qa/contact-${width}.png`});
 assert.deepEqual(errors,[]);console.log(`PASS ${width}: hero order, values, portfolio/search, three mocked forms, rejection/rate limit, theme, anchors, overflow`);await context.close();
}
const animated=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'no-preference'});const ap=await animated.newPage();await ap.goto(base,{waitUntil:'networkidle'});await ap.locator('#sure-system').scrollIntoViewIfNeeded();await ap.waitForTimeout(800);await ap.screenshot({path:'docs/qa/companies-390.png'});assert.equal(await ap.locator('#sure-system').evaluate(e=>e.querySelectorAll('path[style*="stroke-dasharray"]').length>0),true);console.log('PASS mobile scroll animation initialized');await animated.close();
} finally {await browser.close();server.close();}
