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
for (const width of [390,768,1440]) {
 const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.route('https://formspree.io/**', route=>route.abort());
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});
 assert.equal((await page.locator('h1').innerText()).toUpperCase(),'SURE MECHANICAL');
 assert.deepEqual(await page.locator('main > section').evaluateAll(es=>es.slice(0,2).map(e=>e.id)),['hero','installation']);
 assert.equal(await page.locator('#our-story h4').count(),7);
 assert.equal(await page.locator('#cta details[open]').count(),0);
 assert.equal(await page.locator('a[href^="mailto:"]').count(),0);
 assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(es=>es.filter(e=>!document.getElementById(e.hash.slice(1))).map(e=>e.hash)),[]);
 await page.getByRole('button',{name:'Grid view',exact:true}).click();assert.equal(await page.locator('#project-cards button').count(),9);
 await page.locator('#projects details summary').click();assert.equal(await page.locator('#projects details li').count(),14);
 await page.locator('#project-search').fill('Lane');assert.match(await page.locator('#projects [role=status]').innerText(),/1 project/);
 await page.locator('#project-search').fill('');
 await page.locator('#project-cards button').first().click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Next photo',exact:true}).click();assert.match(await page.getByRole('dialog').getByRole('status').innerText(),/Photo 2/);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
 for(const kind of ['general','hr']) {
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
 await page.locator('#contact-form summary').click();
 const failedForm=page.locator('#contact-form form');await failedForm.locator('[name=name]').fill('Network Test');await failedForm.locator('[name=email]').fill('review@example.com');await failedForm.locator('[name=message]').fill('Retain after network error');await failedForm.locator('button[type=submit]').click();await failedForm.getByRole('alert').waitFor();assert.equal(await failedForm.locator('[name=message]').inputValue(),'Retain after network error');
 // Native retry is explicit, mocked, and keeps the original form in its tab.
 await context.unroute('https://formspree.io/**');
 await context.route('https://formspree.io/**', route=>route.fulfill({status:200,contentType:'text/html',body:'<h1>Mock native response</h1>'}));
 const nativeRequest=context.waitForEvent('request',r=>r.url().includes('formspree.io/f/')&&r.isNavigationRequest());
 const popupPromise=context.waitForEvent('page');
 await failedForm.getByRole('button',{name:'Try standard submission'}).click();
 const native=await nativeRequest;assert.equal(native.method(),'POST');assert.equal(new URLSearchParams(native.postData()).get('message'),'Retain after network error');
 const popup=await popupPromise;await popup.close();assert.equal(await failedForm.locator('[name=message]').inputValue(),'Retain after network error');
 // Two immediate submit events still produce exactly one AJAX request.
 await context.unroute('https://formspree.io/**');let submitted=0;
 await context.route('https://formspree.io/**', async route=>{submitted++;await new Promise(r=>setTimeout(r,150));await route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({errors:[{message:'Mock rejection'}]})});});
 // Use HR, whose native guard was not just activated by the previous check.
 await page.locator('#hr-form summary').click();const guarded=page.locator('#hr-form form');
 await guarded.locator('[name=name]').fill('Guard test');await guarded.locator('[name=email]').fill('review@example.com');await guarded.locator('[name=message]').fill('Mock duplicate protection');
 await guarded.evaluate(f=>{f.requestSubmit();f.requestSubmit();});await guarded.getByRole('alert').waitFor();assert.equal(submitted,1);
 for(const theme of ['dark','light']) {
  await page.getByRole('button',{name:`Switch to ${theme} mode`}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:`docs/qa/hero-${width}.png`});
 await page.locator('#clients').screenshot({path:`docs/qa/clients-${width}.png`});
 if(width===390) await page.locator('#sure-system').screenshot({path:'docs/qa/story-mobile.png'});
 await page.locator('#contact-form summary').click();await page.screenshot({path:`docs/qa/contact-${width}.png`});
 assert.deepEqual(errors,[]);console.log(`PASS ${width}: hero order, values, portfolio/search, mocked General/HR forms, rejection/rate limit, theme, anchors, overflow`);await context.close();
}
// The project route must not silently reuse General or HR while unverified.
const projectContext=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
let projectPosts=0;
await projectContext.route('https://formspree.io/**', route=>{projectPosts++;return route.abort();});
const pp=await projectContext.newPage();await pp.goto(base,{waitUntil:'networkidle'});
await pp.locator('#project-form summary').click();const pf=pp.locator('#project-form form');
await pf.locator('[name=name]').fill('Project route test');await pf.locator('[name=email]').fill('review@example.com');await pf.locator('[name=message]').fill('No live submission');
await pf.getByRole('button',{name:'Prepare Project Inquiry'}).click();await pf.getByRole('alert').waitFor();
assert.equal(projectPosts,0);assert.equal(await pf.getByRole('status').count(),0);assert.equal(await pf.getByRole('button',{name:'Try standard submission'}).count(),0);
assert.equal(await pf.locator('[name=message]').inputValue(),'No live submission');await pf.screenshot({path:'docs/qa/project-fallback.png'});await projectContext.close();
console.log('PASS unconfigured project route: no misrouted POST, retained inputs, honest email fallback');

// Full, visible linear story for mobile/reduced-motion/no-JS/short desktops.
for(const opts of [
 {viewport:{width:390,height:900},reducedMotion:'no-preference'},
 {viewport:{width:1440,height:900},reducedMotion:'reduce'},
 {viewport:{width:1440,height:700},reducedMotion:'no-preference'},
 {viewport:{width:1440,height:900},javaScriptEnabled:false},
]) {
 const c=await browser.newContext(opts);const p=await c.newPage();await p.goto(base,{waitUntil:'networkidle'});
 assert.equal(await p.locator('.story-track').isVisible(),false);assert.equal(await p.locator('.story-linear').isVisible(),true);
 assert.match(await p.locator('.story-linear').innerText(),/2010[\s\S]*2025[\s\S]*Together the two companies/);
 assert.equal(await p.locator('.story-linear a').count(),2);await c.close();
}
const animated=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
const ap=await animated.newPage();const motionErrors=[];ap.on('pageerror',e=>motionErrors.push(e.message));await ap.goto(base,{waitUntil:'networkidle'});
assert.equal(await ap.locator('#sure-system').getAttribute('data-enhanced'),'true');
const bounds=await ap.locator('.story-track').evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,height:e.clientHeight}));
for(const [name,progress] of [['founder',0],['branches',.58],['rtu',.99]]) {
 await ap.evaluate(({top,height,progress})=>window.scrollTo(0,top+(height-innerHeight)*progress),{...bounds,progress});
 await ap.waitForTimeout(900);await ap.screenshot({path:`docs/qa/timeline-${name}.png`});
 if(name==='branches'){assert.equal(await ap.locator('[data-duct=foundation]').evaluate(e=>parseFloat(getComputedStyle(e).strokeDashoffset)),0);assert.equal(await ap.locator('.story-acquired').first().evaluate(e=>Number(getComputedStyle(e).opacity)>.95),true);}
 if(name==='rtu'){const box=await ap.locator('.story-conclusion').boundingBox();assert.ok(box.y+box.height<960);assert.equal(await ap.locator('.rtu-iso').evaluate(e=>Number(getComputedStyle(e).opacity)>.95),true);}
}
assert.deepEqual(motionErrors,[]);
await ap.emulateMedia({reducedMotion:'reduce'});await ap.waitForTimeout(200);assert.equal(await ap.locator('.story-linear').isVisible(),true);
await ap.emulateMedia({reducedMotion:'no-preference'});await ap.setViewportSize({width:390,height:900});await ap.locator('#sure-system').scrollIntoViewIfNeeded();await ap.screenshot({path:'docs/qa/companies-390.png'});await animated.close();console.log('PASS timeline scroll beats, responsive/reduced-motion/no-JS states');
const introContext=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'no-preference'});
 const intro=await introContext.newPage();await intro.route('**/hero-rooftop.webp',async route=>{await new Promise(resolve=>setTimeout(resolve,1200));await route.continue();});
 await intro.goto(base,{waitUntil:'domcontentloaded'});assert.equal(await intro.locator('#hero').getAttribute('data-ready'),'false');assert.equal(await intro.locator('.hero-title').evaluate(e=>getComputedStyle(e).opacity),'0');assert.match(await intro.locator('#hero').getAttribute('style'),/data:image/);
 await intro.locator('#hero[data-ready="true"]').waitFor();await intro.waitForTimeout(300);assert.equal(await intro.locator('.hero-support').first().evaluate(e=>getComputedStyle(e).opacity),'0');await intro.waitForTimeout(2600);assert.equal(await intro.locator('.hero-title').evaluate(e=>getComputedStyle(e).opacity),'1');await intro.screenshot({path:'docs/qa/intro-mobile.png'});await introContext.close();
 const fallback=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});await fallback.route('**/hero-rooftop.webp',route=>route.abort());await fallback.goto(base,{waitUntil:'networkidle'});await fallback.waitForTimeout(3000);assert.equal(await fallback.locator('.hero-title').evaluate(e=>getComputedStyle(e).opacity),'1');await fallback.close();console.log('PASS slow-image intro order and failed-image fallback');
} finally {await browser.close();server?.close();}
